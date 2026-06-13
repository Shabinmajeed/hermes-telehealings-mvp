// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(userId: string) {
    const cacheKey = `notifications:${userId}:list`;
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

    const result = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.setJson(cacheKey, result, 30);
    return result;
  }

  async getUnreadCount(userId: string) {
    const cacheKey = `notifications:${userId}:unread`;
    const cached = await this.redis.getJson<{ unreadCount: number }>(cacheKey);
    if (cached) return cached;

    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    const result = { unreadCount: count };
    await this.redis.setJson(cacheKey, result, 30);
    return result;
  }

  async markAsRead(id: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    await this.redis.deletePattern(`notifications:${userId}:*`);
    return result;
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    await this.redis.deletePattern(`notifications:${userId}:*`);
    return result;
  }

  async create(data: {
    userId: string;
    title: string;
    body: string;
    type?: string;
  }) {
    const result = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        type: (data.type as NotificationType) || NotificationType.SYSTEM,
      },
    });
    await this.redis.deletePattern(`notifications:${data.userId}:*`);
    return result;
  }
}
