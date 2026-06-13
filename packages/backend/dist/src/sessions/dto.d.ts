export declare class CreateSessionDto {
    clientId: string;
    therapistId: string;
    scheduledAt: string;
    duration?: number;
    type?: string;
}
export declare class UpdateSessionDto {
    scheduledAt?: string;
    duration?: number;
    status?: string;
    notes?: string;
}
export declare class CompleteSessionDto {
    feedback?: string;
    rating?: number;
}
