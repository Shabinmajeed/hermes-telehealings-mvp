// src/modules/mail/dto/send-email.dto.ts
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendWelcomeEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  name: string;
}

export class SendSessionReminderDto {
  @IsEmail()
  to: string;

  @IsString()
  name: string;

  @IsString()
  therapistName: string;

  @IsString()
  sessionDate: string;

  @IsString()
  sessionTime: string;

  @IsString()
  sessionType: string;
}

export class SendBookingConfirmationDto {
  @IsEmail()
  to: string;

  @IsString()
  name: string;

  @IsString()
  therapistName: string;

  @IsString()
  sessionDate: string;

  @IsString()
  sessionTime: string;

  @IsString()
  sessionType: string;
}

export class SendPasswordResetDto {
  @IsEmail()
  to: string;

  @IsString()
  name: string;

  @IsString()
  resetToken: string;
}
