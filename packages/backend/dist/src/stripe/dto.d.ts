export declare class CreatePaymentIntentDto {
    clientId: string;
    therapistId: string;
    sessionId?: string;
    amount: number;
    currency?: string;
    idempotencyKey?: string;
}
export declare class ConfirmPaymentDto {
    paymentIntentId: string;
}
export declare class RefundPaymentDto {
    paymentIntentId: string;
    amount?: number;
}
