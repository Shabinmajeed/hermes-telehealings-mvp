import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
export declare class SessionsService {
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
        therapistId?: string;
    }): Promise<PaginatedResult<any>>;
    findOne(id: string): Promise<{}>;
    create(data: any): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
    update(id: string, data: any): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
    cancel(id: string): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
    complete(id: string, feedback?: string, rating?: number): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
}
