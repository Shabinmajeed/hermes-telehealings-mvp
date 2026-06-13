import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
export declare class PaymentsService {
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
    findOne(id: string): Promise<({
        client: {
            id: string;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
        };
        session: {
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
        } | null;
    } & {
        id: string;
        therapistId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        stripePaymentId: string | null;
        stripePaymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        sessionId: string | null;
    }) | null>;
    create(data: any): Promise<{
        id: string;
        therapistId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        stripePaymentId: string | null;
        stripePaymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        sessionId: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        therapistId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        stripePaymentId: string | null;
        stripePaymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        sessionId: string | null;
    }>;
    processRefund(id: string): Promise<{
        id: string;
        therapistId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        stripePaymentId: string | null;
        stripePaymentIntentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        sessionId: string | null;
    }>;
}
