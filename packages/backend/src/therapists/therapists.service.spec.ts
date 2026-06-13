import { Test, TestingModule } from '@nestjs/testing';
import { TherapistsService } from './therapists.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  therapistProfile: {
    create: jest.fn(),
    update: jest.fn(),
  },
  session: {
    findMany: jest.fn(),
  },
};

const mockRedisService = {
  getJson: jest.fn().mockResolvedValue(null),
  setJson: jest.fn().mockResolvedValue(undefined),
  deletePattern: jest.fn().mockResolvedValue(undefined),
};

describe('TherapistsService', () => {
  let service: TherapistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TherapistsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<TherapistsService>(TherapistsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return only THERAPIST users', async () => {
      const therapists = [
        { id: '1', email: 't@test.com', role: 'THERAPIST', therapistProfile: null },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(therapists);

      const result = await service.findAll({ limit: 20 });

      expect(result.data).toEqual(therapists);
      expect(result.hasMore).toBe(false);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'THERAPIST' },
        }),
      );
    });

    it('should filter by specialization when provided', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      await service.findAll({ specialization: 'anxiety' });

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            therapistProfile: { specialization: { has: 'anxiety' } },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a therapist with profile', async () => {
      const therapist = {
        id: '1',
        email: 't@test.com',
        therapistProfile: { specialization: ['anxiety'] },
      };
      mockPrismaService.user.findUnique.mockResolvedValue(therapist);

      const result = await service.findOne('1');

      expect(result).toEqual(therapist);
    });
  });

  describe('createProfile', () => {
    it('should create a therapist profile', async () => {
      const profileData = {
        firstName: 'Dr',
        lastName: 'Smith',
        specialization: ['anxiety', 'depression'],
        bio: 'Experienced therapist',
        yearsExperience: 10,
      };
      const created = { id: 'tp-1', userId: 'user-1', ...profileData };
      mockPrismaService.therapistProfile.create.mockResolvedValue(created);

      const result = await service.createProfile('user-1', profileData);

      expect(result).toEqual(created);
    });
  });

  describe('updateProfile', () => {
    it('should update a therapist profile', async () => {
      const updated = { id: 'tp-1', yearsExperience: 15 };
      mockPrismaService.therapistProfile.update.mockResolvedValue(updated);

      const result = await service.updateProfile('user-1', { yearsExperience: 15 });

      expect(result).toEqual(updated);
      expect(mockPrismaService.therapistProfile.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { yearsExperience: 15 },
      });
    });
  });

  describe('getSessions', () => {
    it('should return sessions for a therapist', async () => {
      const sessions = [{ id: 's-1', therapistId: 'user-1' }];
      mockPrismaService.session.findMany.mockResolvedValue(sessions);

      const result = await service.getSessions('user-1');

      expect(result).toEqual(sessions);
      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { therapistId: 'user-1' },
          orderBy: { scheduledAt: 'desc' },
        }),
      );
    });
  });

  describe('getAvailability', () => {
    it('should return availability placeholder', async () => {
      const result = await service.getAvailability('user-1');

      expect(result).toEqual({ therapistId: 'user-1', availability: [] });
    });
  });
});
