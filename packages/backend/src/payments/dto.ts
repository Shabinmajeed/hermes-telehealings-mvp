import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  clientId: string;

  @IsString()
  therapistId: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdatePaymentStatusDto {
  @IsEnum(['PENDING', 'COMPLETED', 'REFUNDED', 'FAILED'])
  status: string;
}
