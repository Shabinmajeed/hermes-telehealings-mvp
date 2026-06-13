// src/modules/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Queue, Worker, Job, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
  emailLogId: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private emailQueue: Queue;
  private readonly logger = new Logger(MailService.name);
  private readonly templatesDir = join(__dirname, 'templates');

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });

    const connection = new IORedis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      maxRetriesPerRequest: null,
    });

    this.emailQueue = new Queue('email-queue', { connection } as any);

    // Initialize worker
    new Worker(
      'email-queue',
      async (job: Job<EmailJobData>) => {
        await this.processEmail(job);
      },
      { connection } as any,
    );
  }

  private renderTemplate(templateName: string, context: Record<string, any>): string {
    const templatePath = join(this.templatesDir, `${templateName}.hbs`);
    const templateSource = readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    return template(context);
  }

  private async processEmail(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, template, context, emailLogId } = job.data;

    try {
      const html = this.renderTemplate(template, context);

      await this.transporter.sendMail({
        from: this.configService.get<string>(
          'MAIL_FROM',
          '"TeleHealings" <noreply@telehealings.com>',
        ),
        to,
        subject,
        html,
      });

      await this.prisma.emailLog.update({
        where: { id: emailLogId },
        data: { status: 'sent', sentAt: new Date(), attempts: job.attemptsMade + 1 },
      });

      this.logger.log(`Email sent successfully to ${to} (${template})`);
    } catch (error: any) {
      const attempts = job.attemptsMade + 1;
      await this.prisma.emailLog.update({
        where: { id: emailLogId },
        data: {
          status: attempts >= 3 ? 'failed' : 'retrying',
          attempts,
          error: error.message,
        },
      });

      this.logger.error(
        `Failed to send email to ${to} (attempt ${attempts}/3): ${error.message}`,
      );
      throw error; // Re-throw to trigger BullMQ retry
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<string> {
    // Create email log entry
    const emailLog = await this.prisma.emailLog.create({
      data: {
        to,
        subject,
        template,
        status: 'pending',
        attempts: 0,
      },
    });

    // Add to queue with retry logic
    await this.emailQueue.add(
      'send-email',
      { to, subject, template, context, emailLogId: emailLog.id },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    this.logger.log(`Email queued: ${subject} to ${to} (log: ${emailLog.id})`);
    return emailLog.id;
  }

  async sendWelcomeEmail(to: string, name: string): Promise<string> {
    return this.sendEmail(to, 'Welcome to TeleHealings!', 'welcome', {
      name,
      loginUrl: this.configService.get<string>('APP_URL', 'https://telehealings.com'),
    });
  }

  async sendSessionReminder(
    to: string,
    name: string,
    therapistName: string,
    sessionDate: string,
    sessionTime: string,
    sessionType: string,
  ): Promise<string> {
    return this.sendEmail(to, 'Session Reminder - TeleHealings', 'session-reminder', {
      name,
      therapistName,
      sessionDate,
      sessionTime,
      sessionType,
    });
  }

  async sendBookingConfirmation(
    to: string,
    name: string,
    therapistName: string,
    sessionDate: string,
    sessionTime: string,
    sessionType: string,
  ): Promise<string> {
    return this.sendEmail(to, 'Booking Confirmed - TeleHealings', 'booking-confirmation', {
      name,
      therapistName,
      sessionDate,
      sessionTime,
      sessionType,
    });
  }

  async sendPasswordReset(to: string, name: string, resetToken: string): Promise<string> {
    const resetUrl = `${this.configService.get<string>('APP_URL', 'https://telehealings.com')}/reset-password?token=${resetToken}`;
    return this.sendEmail(to, 'Password Reset - TeleHealings', 'password-reset', {
      name,
      resetUrl,
    });
  }

  async getEmailLogs() {
    return this.prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
