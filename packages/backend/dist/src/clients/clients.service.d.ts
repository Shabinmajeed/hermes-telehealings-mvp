import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
export declare class ClientsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(params: {
        cursor?: string;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
    }): Promise<PaginatedResult<any>>;
    findOne(id: string): Promise<{} | null>;
    createProfile(userId: string, data: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        address: string | null;
        emergencyContact: string | null;
        medicalHistory: string | null;
        avatar: string | null;
        userId: string;
    }>;
    updateProfile(userId: string, data: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        address: string | null;
        emergencyContact: string | null;
        medicalHistory: string | null;
        avatar: string | null;
        userId: string;
    }>;
    getSessions(clientId: string): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        therapist: {
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    }[]>;
}
