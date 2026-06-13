import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
export declare class BookingsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(params: {
        cursor?: string;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
        status?: string;
        clientId?: string;
    }): Promise<PaginatedResult<any>>;
    findOne(id: string): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    } | null>;
    create(data: any): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    }>;
    cancel(id: string): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    }>;
}
