import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  clientProfile: {
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

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return only CLIENT users', async () => {
      const clients = [
        { id: '1', email: 'client@test.com', role: 'CLIENT', clientProfile: null },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(clients);

      const result = await service.findAll({ limit: 20 });

      expect(result.data).toEqual(clients);
      expect(result.hasMore).toBe(false);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'CLIENT' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a client with profile', async () => {
      const client = {
        id: '1',
        email: 'client@test.com',
        clientProfile: { firstName: 'John', lastName: 'Doe' },
      };
      mockPrismaService.user.findUnique.mockResolvedValue(client);

      const result = await service.findOne('1');

      expect(result).toEqual(client);
    });
  });

  describe('createProfile', () => {
    it('should create a client profile', async () => {
      const profileData = { firstName: 'John', lastName: 'Doe', phone: '123456' };
      const createdProfile = { id: 'cp-1', userId: 'user-1', ...profileData };
      mockPrismaService.clientProfile.create.mockResolvedValue(createdProfile);

      const result = await service.createProfile('user-1', profileData);

      expect(result).toEqual(createdProfile);
      expect(mockPrismaService.clientProfile.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', ...profileData },
      });
    });
  });

  describe('updateProfile', () => {
    it('should update a client profile', async () => {
      const updateData = { firstName: 'Jane' };
      const updatedProfile = { id: 'cp-1', userId: 'user-1', firstName: 'Jane', lastName: 'Doe' };
      mockPrismaService.clientProfile.update.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile('user-1', updateData);

      expect(result).toEqual(updatedProfile);
      expect(mockPrismaService.clientProfile.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: updateData,
      });
    });
  });

  describe('getSessions', () => {
    it('should return sessions for a client', async () => {
      const sessions = [
        { id: 's-1', clientId: 'user-1', status: 'SCHEDULED' },
      ];
      mockPrismaService.session.findMany.mockResolvedValue(sessions);

      const result = await service.getSessions('user-1');

      expect(result).toEqual(sessions);
      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clientId: 'user-1' },
          orderBy: { scheduledAt: 'desc' },
        }),
      );
    });
  });
});
