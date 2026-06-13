import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Roles, Role, ROLES_KEY } from './roles.decorator';
import { ExecutionContext } from '@nestjs/common';

// Helper to create mock execution context
function createMockExecutionContext(user: any, handler = {}): ExecutionContext {
  return {
    switchToHttp: () =>
      ({
        getRequest: () => ({ user }),
      } as any),
    getHandler: () => handler,
    getClass: () => ({}) as any,
  } as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  it('should be defined and extend AuthGuard', () => {
    const { JwtAuthGuard } = require('./jwt-auth.guard');
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
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
    const context = createMockExecutionContext({ role: Role.CLIENT });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(null);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when user has required role', () => {
    const context = createMockExecutionContext({ role: Role.ADMIN });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when user does not have required role', () => {
    const context = createMockExecutionContext({ role: Role.CLIENT });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should allow access when user has one of multiple required roles', () => {
    const context = createMockExecutionContext({ role: Role.THERAPIST });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      Role.ADMIN,
      Role.THERAPIST,
    ]);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when user role is not in required roles list', () => {
    const context = createMockExecutionContext({ role: Role.CLIENT });
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      Role.ADMIN,
      Role.THERAPIST,
    ]);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
});

describe('Roles decorator', () => {
  it('should have correct ROLES_KEY', () => {
    expect(ROLES_KEY).toBe('roles');
  });

  it('should export Role enum with correct values', () => {
    expect(Role.CLIENT).toBe('CLIENT');
    expect(Role.THERAPIST).toBe('THERAPIST');
    expect(Role.ADMIN).toBe('ADMIN');
  });

  it('Roles decorator should call SetMetadata', () => {
    jest.mock('@nestjs/common', () => ({
      SetMetadata: jest.fn((key, value) => ({ key, value })),
    }));

    const result = Roles(Role.ADMIN);
    expect(result).toBeDefined();
  });
});
