export declare class SendWelcomeEmailDto {
    to: string;
    name: string;
}
export declare class SendSessionReminderDto {
    to: string;
    name: string;
    therapistName: string;
    sessionDate: string;
    sessionTime: string;
    sessionType: string;
}
export declare class SendBookingConfirmationDto {
    to: string;
    name: string;
    therapistName: string;
    sessionDate: string;
    sessionTime: string;
    sessionType: string;
}
export declare class SendPasswordResetDto {
    to: string;
    name: string;
    resetToken: string;
}
