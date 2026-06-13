import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { Role } from './roles.decorator';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_LOGINS = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async register(email: string, password: string, role: Role = Role.CLIENT) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  async login(email: string, password: string, ip?: string) {
    // Brute-force protection: check failed attempts
    const identifier = ip ? `${email}:${ip}` : email;
    const failedCount = await this.redisService.getFailedLoginCount(identifier);
    if (failedCount >= this.MAX_FAILED_LOGINS) {
      throw new ForbiddenException('Account temporarily locked due to too many failed login attempts. Try again in 15 minutes.');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      await this.redisService.recordFailedLogin(identifier);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.redisService.recordFailedLogin(identifier);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user account is suspended
    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Account suspended. Contact support.');
    }

    // Reset failed login attempts on success
    await this.redisService.resetFailedLogins(identifier);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  async refresh(userId: string, refreshToken: string) {
    // Verify the refresh token is valid JWT first
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if this refresh token has been used before (token rotation detection)
    const tokenFingerprint = this.getTokenFingerprint(refreshToken);
    const hasFingerprint = await this.redisService.hasRefreshTokenFingerprint(userId, tokenFingerprint);

    if (hasFingerprint) {
      // Token reuse detected! This means the refresh token was stolen.
      // Invalidate all sessions for this user as a security measure.
      await this.redisService.deleteAllRefreshFingerprints(userId);
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
      throw new UnauthorizedException('Refresh token reuse detected. All sessions invalidated.');
    }

    // Check DB for the refresh token
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: { userId, token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Blacklist the old refresh token's fingerprint
    await this.redisService.storeRefreshTokenFingerprint(userId, tokenFingerprint, 7 * 24 * 3600);

    // Delete old refresh token from DB
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new token pair (rotation)
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return tokens;
  }

  async logout(userId: string, accessTokenJti?: string) {
    // Blacklist the access token if JTI provided
    if (accessTokenJti) {
      const ttl = this.configService.get<number>('JWT_EXPIRY_SECONDS', 900);
      await this.redisService.blacklistToken(accessTokenJti, ttl);
    }

    // Delete all refresh tokens for this user
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    await this.redisService.deleteAllRefreshFingerprints(userId);

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    // Invalidate all sessions
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    await this.redisService.deleteAllRefreshFingerprints(userId);
    return { message: 'All sessions logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true, therapistProfile: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const jti = crypto.randomUUID();
    const payload = { sub: userId, email, role, jti };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRY', '15m') as any,
    } as any);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY', '7d') as any,
    } as any);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { userId, token: refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private getTokenFingerprint(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex').substring(0, 16);
  }
}
