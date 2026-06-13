import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    getEmailLogs(): Promise<{
        error: string | null;
        id: string;
        status: string;
        createdAt: Date;
        to: string;
        subject: string;
        attempts: number;
        template: string;
        sentAt: Date | null;
    }[]>;
    testWelcome(body: {
        to: string;
        name: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
    testSessionReminder(body: {
        to: string;
        name: string;
        therapistName: string;
        sessionDate: string;
        sessionTime: string;
        sessionType: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
    testBookingConfirmation(body: {
        to: string;
        name: string;
        therapistName: string;
        sessionDate: string;
        sessionTime: string;
        sessionType: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
    testPasswordReset(body: {
        to: string;
        name: string;
        resetToken: string;
    }): Promise<{
        message: string;
        logId: string;
    }>;
}
