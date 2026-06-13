import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
export interface EmailJobData {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
    emailLogId: string;
}
export declare class MailService {
    private configService;
    private prisma;
    private transporter;
    private emailQueue;
    private readonly logger;
    private readonly templatesDir;
    constructor(configService: ConfigService, prisma: PrismaService);
    private renderTemplate;
    private processEmail;
    sendEmail(to: string, subject: string, template: string, context: Record<string, any>): Promise<string>;
    sendWelcomeEmail(to: string, name: string): Promise<string>;
    sendSessionReminder(to: string, name: string, therapistName: string, sessionDate: string, sessionTime: string, sessionType: string): Promise<string>;
    sendBookingConfirmation(to: string, name: string, therapistName: string, sessionDate: string, sessionTime: string, sessionType: string): Promise<string>;
    sendPasswordReset(to: string, name: string, resetToken: string): Promise<string>;
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
}
