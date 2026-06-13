export declare class CreatePaymentDto {
    clientId: string;
    therapistId: string;
    sessionId?: string;
    amount: number;
    currency?: string;
}
export declare class UpdatePaymentStatusDto {
    status: string;
}
