import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Generate OTP and send (mocked)
  async sendOtp(phone: string): Promise<{ otpId: string; message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = uuidv4();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.otp.create({
      data: {
        id: otpId,
        phone,
        code: otp,
        expiresAt,
      },
    });

    // In production, send SMS here
    console.log(`OTP for ${phone}: ${otp}`);

    return {
      otpId,
      message: `OTP sent to ${phone}`,
    };
  }

  // Verify OTP and create user
  async verifyOtp(
    otpId: string,
    code: string,
    phone: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const otp = await this.prisma.otp.findUnique({ where: { id: otpId } });

    if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    // Check if user exists or create
    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: uuidv4(),
          phone,
          email: '',
          passwordHash: '',
          phoneVerified: true,
          emailVerified: false,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true },
      });
    }

    // Create tokens
    const accessToken = this.jwtService.sign(
      { userId: user.id, role: 'user' },
      { expiresIn: '1h' },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.authToken.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    // Delete OTP
    await this.prisma.otp.delete({ where: { id: otpId } });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
      },
    };
  }

  // Email/Password signup
  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        phone: '',
        passwordHash,
        emailVerified: false,
        phoneVerified: false,
      },
    });

    // Create profile
    await this.prisma.userProfile.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        name,
        bio: '',
      },
    });

    const accessToken = this.jwtService.sign(
      { userId: user.id, role: 'user' },
      { expiresIn: '1h' },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    await this.prisma.authToken.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  // Email/Password login
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.jwtService.sign(
      { userId: user.id, role: 'user' },
      { expiresIn: '1h' },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    await this.prisma.authToken.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  // Refresh token
  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const authToken = await this.prisma.authToken.findUnique({
        where: { refreshToken },
      });

      if (!authToken || authToken.expiresAt < new Date()) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { userId: decoded.userId, role: 'user' },
        { expiresIn: '1h' },
      );

      const newRefreshToken = this.jwtService.sign(
        { userId: decoded.userId },
        { expiresIn: '7d' },
      );

      await this.prisma.authToken.delete({ where: { id: authToken.id } });

      await this.prisma.authToken.create({
        data: {
          id: uuidv4(),
          userId: decoded.userId,
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logout
  async logout(userId: string): Promise<{ message: string }> {
    await this.prisma.authToken.deleteMany({ where: { userId } });
    return { message: 'Logged out successfully' };
  }

  // Password reset
  async passwordReset(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { message: 'Password reset successfully' };
  }

  // Validate JWT
  async validateUser(userId: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
