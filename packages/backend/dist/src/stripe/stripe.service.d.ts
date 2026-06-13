import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
export declare class StripeService {
    private configService;
    private prisma;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    isEnabled(): boolean;
    getClient(): any;
    createPaymentIntent(params: {
        amount: number;
        currency: string;
        clientId: string;
        therapistId: string;
        sessionId?: string;
        idempotencyKey: string;
    }): Promise<{
        payment: {
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
        };
        clientSecret: any;
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        paymentIntent: any;
        payment: import("@prisma/client").Prisma.BatchPayload;
    }>;
    createRefund(paymentIntentId: string, amount?: number): Promise<any>;
    handleWebhookEvent(payload: Buffer, signature: string): Promise<{
        received: boolean;
        type: any;
    }>;
    private handlePaymentIntentSucceeded;
    private handlePaymentIntentFailed;
    private handleChargeRefunded;
}
