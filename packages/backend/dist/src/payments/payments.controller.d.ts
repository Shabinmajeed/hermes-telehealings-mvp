import { PaymentsService } from './payments.service';
import { CursorPaginationDto } from '../common/pagination/pagination.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(pagination: CursorPaginationDto): Promise<import("../common/pagination/pagination.dto").PaginatedResult<any>>;
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
    updateStatus(id: string, dto: any): Promise<{
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
    refund(id: string): Promise<{
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
