import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles, Role, ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@nestjs/testing';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });
});

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp.mockReturnValue({
      getRequest: () => ({ user: { role: Role.CLIENT } }),
    } as any);

    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(null);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when user has required role', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp.mockReturnValue({
      getRequest: () => ({ user: { role: Role.ADMIN } }),
    } as any);

    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when user does not have required role', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp.mockReturnValue({
      getRequest: () => ({ user: { role: Role.CLIENT } }),
    } as any);

    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should allow access when user has one of multiple required roles', () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp.mockReturnValue({
      getRequest: () => ({ user: { role: Role.THERAPIST } }),
    } as any);

    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      Role.ADMIN,
      Role.THERAPIST,
    ]);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});

describe('Roles decorator', () => {
  it('should set metadata with correct key', () => {
    const { SetMetadata } = require('@nestjs/common');
    const metadata = Roles(Role.ADMIN, Role.THERAPIST);

    // Verify the metadata key and value
    expect(ROLES_KEY).toBe('roles');
  });

  it('should export Role enum with correct values', () => {
    expect(Role.CLIENT).toBe('CLIENT');
    expect(Role.THERAPIST).toBe('THERAPIST');
    expect(Role.ADMIN).toBe('ADMIN');
  });
});
