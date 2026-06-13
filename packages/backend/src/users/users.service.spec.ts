import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockRedisService = {
  getJson: jest.fn().mockResolvedValue(null),
  setJson: jest.fn().mockResolvedValue(undefined),
  deletePattern: jest.fn().mockResolvedValue(undefined),
  invalidateUserCache: jest.fn().mockResolvedValue(undefined),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [
        { id: '1', email: 'a@test.com', role: 'CLIENT' },
        { id: '2', email: 'b@test.com', role: 'THERAPIST' },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll({ limit: 20 });

      expect(result.data).toEqual(users);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('should filter by role when provided', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.findAll({ role: 'THERAPIST' });

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'THERAPIST' },
        }),
      );
    });

    it('should use default pagination values', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.findAll({});

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 21,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        role: 'CLIENT',
        clientProfile: null,
        therapistProfile: null,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: '1' } }),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'test@test.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = { id: '1', email: 'test@test.com', status: 'active' };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', { status: 'active' });

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'active' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockPrismaService.user.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result).toEqual({ id: '1' });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
