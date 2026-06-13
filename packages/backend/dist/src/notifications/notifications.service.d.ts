import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
export declare class NotificationsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(userId: string): Promise<{}>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    create(data: {
        userId: string;
        title: string;
        body: string;
        type?: string;
    }): Promise<{
        type: import("@prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        body: string;
        isRead: boolean;
    }>;
}
