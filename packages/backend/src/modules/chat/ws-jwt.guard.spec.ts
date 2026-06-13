import { Test, TestingModule } from '@nestjs/testing';
import { WsJwtGuard } from './ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

const mockJwtService = {
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-secret'),
};

describe('WsJwtGuard', () => {
  let guard: WsJwtGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WsJwtGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    guard = module.get<WsJwtGuard>(WsJwtGuard);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token provided', () => {
    const context = {
      switchToWs: () =>
        ({
          getClient: () => ({
            handshake: { auth: {}, query: {}, headers: {} },
          }),
        } as any),
    } as any;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should accept valid token from auth', () => {
    mockJwtService.verify.mockReturnValue({
      sub: 'user-1',
      email: 'test@test.com',
      role: 'CLIENT',
    });

    const mockClient = {
      handshake: {
        auth: { token: 'valid-token' },
        query: {},
        headers: {},
      },
      data: {},
    };

    const context = {
      switchToWs: () =>
        ({
          getClient: () => mockClient,
        } as any),
    } as any;

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockClient.data.user).toEqual({
      id: 'user-1',
      email: 'test@test.com',
      role: 'CLIENT',
    });
  });

  it('should accept token with Bearer prefix from auth', () => {
    mockJwtService.verify.mockReturnValue({
      sub: 'user-1',
      email: 'test@test.com',
      role: 'CLIENT',
    });

    const mockClient = {
      handshake: {
        auth: { token: 'Bearer valid-token' },
        query: {},
        headers: {},
      },
      data: {},
    };

    const context = {
      switchToWs: () =>
        ({
          getClient: () => mockClient,
        } as any),
    } as any;

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
      secret: 'test-secret',
    });
  });

  it('should accept token from query parameter', () => {
    mockJwtService.verify.mockReturnValue({
      sub: 'user-1',
      email: 'test@test.com',
      role: 'THERAPIST',
    });

    const mockClient = {
      handshake: {
        auth: {},
        query: { token: 'query-token' },
        headers: {},
      },
      data: {},
    };

    const context = {
      switchToWs: () =>
        ({
          getClient: () => mockClient,
        } as any),
    } as any;

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should accept token from authorization header', () => {
    mockJwtService.verify.mockReturnValue({
      sub: 'user-1',
      email: 'test@test.com',
      role: 'ADMIN',
    });

    const mockClient = {
      handshake: {
        auth: {},
        query: {},
        headers: { authorization: 'Bearer header-token' },
      },
      data: {},
    };

    const context = {
      switchToWs: () =>
        ({
          getClient: () => mockClient,
        } as any),
    } as any;

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException for invalid token', () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const mockClient = {
      handshake: {
        auth: { token: 'invalid-token' },
        query: {},
        headers: {},
      },
      data: {},
    };

    const context = {
      switchToWs: () =>
        ({
          getClient: () => mockClient,
        } as any),
    } as any;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
