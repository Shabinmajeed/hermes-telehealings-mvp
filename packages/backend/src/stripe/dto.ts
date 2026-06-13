// src/stripe/dto.ts
import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  therapistId: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @IsNumber()
  @Min(0.5)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class ConfirmPaymentDto {
  @IsString()
  paymentIntentId: string;
}

export class RefundPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  amount?: number;
}
