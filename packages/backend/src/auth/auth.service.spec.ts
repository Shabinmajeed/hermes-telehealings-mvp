import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { Role } from './roles.decorator';

// Mock PrismaService
const createMockPrisma = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  refreshToken: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
});

// Mock RedisService
const createMockRedis = () => ({
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  scan: jest.fn().mockResolvedValue(['0', []]),
  quit: jest.fn(),
  getJson: jest.fn(),
  setJson: jest.fn(),
  deletePattern: jest.fn(),
  invalidateUserCache: jest.fn(),
  invalidateSessionListCache: jest.fn(),
  blacklistToken: jest.fn(),
  isTokenBlacklisted: jest.fn(),
  storeRefreshTokenFingerprint: jest.fn(),
  hasRefreshTokenFingerprint: jest.fn(),
  deleteRefreshTokenFingerprint: jest.fn(),
  deleteAllRefreshFingerprints: jest.fn(),
  recordFailedLogin: jest.fn().mockResolvedValue(1),
  getFailedLoginCount: jest.fn().mockResolvedValue(0),
  resetFailedLogins: jest.fn(),
});

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: string) => {
    const config: Record<string, string> = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRY: '15m',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_REFRESH_EXPIRY: '7d',
    };
    return config[key] || defaultValue;
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: ReturnType<typeof createMockPrisma>;
  let mockJwt: any;
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(async () => {
    mockPrisma = createMockPrisma();
    mockRedis = createMockRedis();
    let signCallCount = 0;
    mockJwt = {
      sign: jest.fn(() => {
        signCallCount++;
        return signCallCount === 1 ? 'access-token' : 'refresh-token';
      }),
      verify: jest.fn((token: string) => {
        if (token === 'valid-refresh-token' || token === 'refresh-token') {
          return { sub: 'user-1', email: 'test@example.com', role: 'CLIENT' };
        }
        throw new Error('Invalid token');
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email,
        password: 'hashed-pw',
        role: Role.CLIENT,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      const result = await service.register(email, password);

      expect(result.user).toEqual({
        id: 'user-1',
        email,
        role: Role.CLIENT,
      });
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { email, password: expect.any(String), role: Role.CLIENT },
      });
    });

    it('should register a user with THERAPIST role', async () => {
      const email = 'therapist@example.com';
      const password = 'password123';

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-2',
        email,
        password: 'hashed',
        role: Role.THERAPIST,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' });

      const result = await service.register(email, password, Role.THERAPIST);

      expect(result.user.role).toBe(Role.THERAPIST);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing',
        email: 'test@example.com',
      });

      await expect(
        service.register('test@example.com', 'password123'),
      ).rejects.toThrow(ConflictException);

      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@example.com';

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email,
        password: 'hashed-pw',
        role: Role.CLIENT,
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      // Mock bcrypt.compare to return true for this test
      const bcryptCompare = jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      const result = await service.login(email, 'any-password');

      expect(result.user).toEqual({
        id: 'user-1',
        email,
        role: Role.CLIENT,
      });
      expect(result.accessToken).toBe('access-token');
      bcryptCompare.mockRestore();
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-pw',
        role: Role.CLIENT,
      });

      // bcrypt.compare will return false since we're comparing with a mock hash
      await expect(
        service.login('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully', async () => {
      const userId = 'user-1';
      const refreshToken = 'valid-refresh-token';

      mockRedis.hasRefreshTokenFingerprint.mockResolvedValue(false);
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1',
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        role: Role.CLIENT,
      });
      mockPrisma.refreshToken.delete.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' });

      // Reset sign call count for this test
      mockJwt.sign.mockReturnValueOnce('new-access-token');
      mockJwt.sign.mockReturnValueOnce('new-refresh-token');

      const result = await service.refresh(userId, refreshToken);

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedException for expired refresh token', async () => {
      // Mock JWT verify to succeed (token is valid JWT but expired in DB)
      mockJwt.verify.mockReturnValueOnce({
        sub: 'user-1',
        email: 'test@example.com',
        role: 'CLIENT',
      });
      mockRedis.hasRefreshTokenFingerprint.mockResolvedValue(false);
      mockPrisma.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1',
        userId: 'user-1',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 86400000),
      });

      await expect(
        service.refresh('user-1', 'expired-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent refresh token', async () => {
      // Mock JWT verify to succeed (token is valid JWT but not in DB)
      mockJwt.verify.mockReturnValueOnce({
        sub: 'user-1',
        email: 'test@example.com',
        role: 'CLIENT',
      });
      mockRedis.hasRefreshTokenFingerprint.mockResolvedValue(false);
      mockPrisma.refreshToken.findFirst.mockResolvedValue(null);

      await expect(
        service.refresh('user-1', 'nonexistent-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token is reused (theft detection)', async () => {
      mockJwt.verify.mockReturnValueOnce({
        sub: 'user-1',
        email: 'test@example.com',
        role: 'CLIENT',
      });
      mockRedis.hasRefreshTokenFingerprint.mockResolvedValue(true);

      await expect(
        service.refresh('user-1', 'reused-token'),
      ).rejects.toThrow('Refresh token reuse detected');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.logout('user-1');

      expect(result.message).toBe('Logged out successfully');
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: Role.CLIENT,
        password: 'hashed-password',
        clientProfile: { firstName: 'John', lastName: 'Doe' },
        therapistProfile: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-1');

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id', 'user-1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('clientProfile');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
