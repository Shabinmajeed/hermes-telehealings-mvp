import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  booking: {
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
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated bookings', async () => {
      const bookings = [
        { id: 'b-1', status: 'PENDING' },
        { id: 'b-2', status: 'CONFIRMED' },
      ];
      mockPrismaService.booking.findMany.mockResolvedValue(bookings);

      const result = await service.findAll({ limit: 20 });

      expect(result.data).toEqual(bookings);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('should filter by status when provided', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([]);

      await service.findAll({ status: 'CONFIRMED' });

      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'CONFIRMED' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const booking = { id: 'b-1', status: 'PENDING' };
      mockPrismaService.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne('b-1');

      expect(result).toEqual(booking);
    });
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const bookingData = {
        clientId: 'client-1',
        therapistId: 'therapist-1',
        scheduledAt: new Date(),
        sessionType: 'VIDEO',
      };
      const created = { id: 'b-new', ...bookingData, status: 'PENDING' };
      mockPrismaService.booking.create.mockResolvedValue(created);

      const result = await service.create(bookingData);

      expect(result).toEqual(created);
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      const updated = { id: 'b-1', status: 'CONFIRMED' };
      mockPrismaService.booking.update.mockResolvedValue(updated);

      const result = await service.updateStatus('b-1', 'CONFIRMED');

      expect(result).toEqual(updated);
      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'b-1' },
        data: { status: 'CONFIRMED' },
      });
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const cancelled = { id: 'b-1', status: 'CANCELLED' };
      mockPrismaService.booking.update.mockResolvedValue(cancelled);

      const result = await service.cancel('b-1');

      expect(result).toEqual(cancelled);
      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'b-1' },
        data: { status: 'CANCELLED' },
      });
    });
  });
});
