import type { RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentIntentDto, ConfirmPaymentDto, RefundPaymentDto } from './dto';
export declare class StripeController {
    private stripeService;
    private configService;
    constructor(stripeService: StripeService, configService: ConfigService);
    getConfig(): {
        publishableKey: string | undefined;
    };
    createPaymentIntent(dto: CreatePaymentIntentDto, req: any): Promise<{
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
    confirmPayment(dto: ConfirmPaymentDto): Promise<{
        paymentIntent: any;
        payment: import("@prisma/client").Prisma.BatchPayload;
    }>;
    refund(dto: RefundPaymentDto): Promise<any>;
    webhook(signature: string, req: RawBodyRequest<any>): Promise<{
        received: boolean;
        type: any;
    }>;
}
