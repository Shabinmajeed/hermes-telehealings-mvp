import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  session: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockRedisService = {
  getJson: jest.fn().mockResolvedValue(null),
  setJson: jest.fn().mockResolvedValue(undefined),
  deletePattern: jest.fn().mockResolvedValue(undefined),
  invalidateSessionListCache: jest.fn().mockResolvedValue(undefined),
};

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated sessions', async () => {
      const sessions = [
        { id: 's-1', status: 'SCHEDULED' },
        { id: 's-2', status: 'COMPLETED' },
      ];
      mockPrismaService.session.findMany.mockResolvedValue(sessions);

      const result = await service.findAll({ limit: 20 });

      expect(result.data).toEqual(sessions);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('should return paginated result with nextCursor when more items exist', async () => {
      const sessions = [
        { id: 's-1', status: 'SCHEDULED' },
        { id: 's-2', status: 'COMPLETED' },
        { id: 's-3', status: 'SCHEDULED' },
      ];
      mockPrismaService.session.findMany.mockResolvedValue(sessions);

      const result = await service.findAll({ limit: 2 });

      expect(result.data).toEqual(sessions.slice(0, 2));
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBeTruthy();
    });

    it('should filter by status when provided', async () => {
      mockPrismaService.session.findMany.mockResolvedValue([]);

      await service.findAll({ status: 'SCHEDULED' });

      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'SCHEDULED' }),
        }),
      );
    });

    it('should filter by clientId when provided', async () => {
      mockPrismaService.session.findMany.mockResolvedValue([]);

      await service.findAll({ clientId: 'client-1' });

      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ clientId: 'client-1' }),
        }),
      );
    });

    it('should filter by therapistId when provided', async () => {
      mockPrismaService.session.findMany.mockResolvedValue([]);

      await service.findAll({ therapistId: 'therapist-1' });

      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ therapistId: 'therapist-1' }),
        }),
      );
    });

    it('should use default pagination values', async () => {
      mockPrismaService.session.findMany.mockResolvedValue([]);

      await service.findAll({});

      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 21,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const session = {
        id: 's-1',
        status: 'SCHEDULED',
        client: {},
        therapist: {},
        payment: null,
      };
      mockPrismaService.session.findUnique.mockResolvedValue(session);

      const result = await service.findOne('s-1');

      expect(result).toEqual(session);
    });

    it('should throw NotFoundException if session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a session', async () => {
      const sessionData = {
        clientId: 'client-1',
        therapistId: 'therapist-1',
        scheduledAt: new Date(),
      };
      const created = { id: 's-new', ...sessionData, status: 'SCHEDULED' };
      mockPrismaService.session.create.mockResolvedValue(created);

      const result = await service.create(sessionData);

      expect(result).toEqual(created);
      expect(mockPrismaService.session.create).toHaveBeenCalledWith({
        data: sessionData,
      });
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updated = { id: 's-1', notes: 'Updated notes' };
      mockPrismaService.session.update.mockResolvedValue(updated);

      const result = await service.update('s-1', { notes: 'Updated notes' });

      expect(result).toEqual(updated);
      expect(mockPrismaService.session.update).toHaveBeenCalledWith({
        where: { id: 's-1' },
        data: { notes: 'Updated notes' },
      });
    });
  });

  describe('cancel', () => {
    it('should cancel a session', async () => {
      const cancelled = { id: 's-1', status: 'CANCELLED' };
      mockPrismaService.session.update.mockResolvedValue(cancelled);

      const result = await service.cancel('s-1');

      expect(result).toEqual(cancelled);
      expect(mockPrismaService.session.update).toHaveBeenCalledWith({
        where: { id: 's-1' },
        data: { status: 'CANCELLED' },
      });
    });
  });

  describe('complete', () => {
    it('should complete a session with feedback and rating', async () => {
      const completed = {
        id: 's-1',
        status: 'COMPLETED',
        feedback: 'Great session',
        rating: 5,
      };
      mockPrismaService.session.update.mockResolvedValue(completed);

      const result = await service.complete('s-1', 'Great session', 5);

      expect(result).toEqual(completed);
      expect(mockPrismaService.session.update).toHaveBeenCalledWith({
        where: { id: 's-1' },
        data: { status: 'COMPLETED', feedback: 'Great session', rating: 5 },
      });
    });

    it('should complete a session without feedback', async () => {
      const completed = { id: 's-1', status: 'COMPLETED' };
      mockPrismaService.session.update.mockResolvedValue(completed);

      const result = await service.complete('s-1');

      expect(result).toEqual(completed);
    });
  });
});
