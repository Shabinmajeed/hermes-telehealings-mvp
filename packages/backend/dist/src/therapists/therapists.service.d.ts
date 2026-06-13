import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
export declare class TherapistsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    findAll(params: {
        cursor?: string;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
        specialization?: string;
    }): Promise<PaginatedResult<any>>;
    findOne(id: string): Promise<{} | null>;
    createProfile(userId: string, data: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        userId: string;
        specialization: string[];
        bio: string | null;
        licenseNumber: string | null;
        yearsExperience: number;
        rating: number;
        reviewCount: number;
        isVerified: boolean;
    }>;
    updateProfile(userId: string, data: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        userId: string;
        specialization: string[];
        bio: string | null;
        licenseNumber: string | null;
        yearsExperience: number;
        rating: number;
        reviewCount: number;
        isVerified: boolean;
    }>;
    getSessions(therapistId: string): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        client: {
            id: string;
            clientProfile: {
                firstName: string;
                lastName: string;
                avatar: string | null;
            } | null;
        };
        scheduledAt: Date;
        duration: number;
    }[]>;
    getAvailability(therapistId: string): Promise<{
        therapistId: string;
        availability: never[];
    }>;
}
