import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  notification: {
    findMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
    create: jest.fn(),
  },
};

const mockRedisService = {
  getJson: jest.fn().mockResolvedValue(null),
  setJson: jest.fn().mockResolvedValue(undefined),
  deletePattern: jest.fn().mockResolvedValue(undefined),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return notifications for a user', async () => {
      const notifications = [
        { id: 'n-1', title: 'Booking confirmed', isRead: false },
        { id: 'n-2', title: 'Session reminder', isRead: true },
      ];
      mockPrismaService.notification.findMany.mockResolvedValue(notifications);

      const result = await service.findAll('user-1');

      expect(result).toEqual(notifications);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          orderBy: { createdAt: 'desc' },
        }),
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notification count', async () => {
      mockPrismaService.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(result).toEqual({ unreadCount: 5 });
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
      });
    });

    it('should return 0 when no unread notifications', async () => {
      mockPrismaService.notification.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('user-1');

      expect(result).toEqual({ unreadCount: 0 });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markAsRead('n-1', 'user-1');

      expect(result).toEqual({ count: 1 });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { id: 'n-1', userId: 'user-1' },
        data: { isRead: true },
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead('user-1');

      expect(result).toEqual({ count: 3 });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
        data: { isRead: true },
      });
    });
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const notifData = {
        userId: 'user-1',
        title: 'Test notification',
        body: 'Test body',
        type: 'BOOKING_CONFIRMATION',
      };
      const created = { id: 'n-new', ...notifData, isRead: false };
      mockPrismaService.notification.create.mockResolvedValue(created);

      const result = await service.create(notifData);

      expect(result).toEqual(created);
    });

    it('should default type to SYSTEM when not provided', async () => {
      const created = { id: 'n-new', type: 'SYSTEM' };
      mockPrismaService.notification.create.mockResolvedValue(created);

      await service.create({ userId: 'user-1', title: 'Test', body: 'Body' });

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: 'SYSTEM' }),
        }),
      );
    });
  });
});
