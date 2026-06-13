// src/modules/mail/mail.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('logs')
  async getEmailLogs() {
    return this.mailService.getEmailLogs();
  }

  @Post('test/welcome')
  async testWelcome(@Body() body: { to: string; name: string }) {
    const logId = await this.mailService.sendWelcomeEmail(body.to, body.name);
    return { message: 'Welcome email queued', logId };
  }

  @Post('test/session-reminder')
  async testSessionReminder(
    @Body()
    body: {
      to: string;
      name: string;
      therapistName: string;
      sessionDate: string;
      sessionTime: string;
      sessionType: string;
    },
  ) {
    const logId = await this.mailService.sendSessionReminder(
      body.to,
      body.name,
      body.therapistName,
      body.sessionDate,
      body.sessionTime,
      body.sessionType,
    );
    return { message: 'Session reminder queued', logId };
  }

  @Post('test/booking-confirmation')
  async testBookingConfirmation(
    @Body()
    body: {
      to: string;
      name: string;
      therapistName: string;
      sessionDate: string;
      sessionTime: string;
      sessionType: string;
    },
  ) {
    const logId = await this.mailService.sendBookingConfirmation(
      body.to,
      body.name,
      body.therapistName,
      body.sessionDate,
      body.sessionTime,
      body.sessionType,
    );
    return { message: 'Booking confirmation queued', logId };
  }

  @Post('test/password-reset')
  async testPasswordReset(@Body() body: { to: string; name: string; resetToken: string }) {
    const logId = await this.mailService.sendPasswordReset(
      body.to,
      body.name,
      body.resetToken,
    );
    return { message: 'Password reset email queued', logId };
  }
}
