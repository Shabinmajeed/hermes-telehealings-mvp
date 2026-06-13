import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  clientId: string;

  @IsString()
  therapistId: string;

  @IsOptional()
  @IsEnum(['VIDEO', 'AUDIO', 'CHAT'])
  sessionType?: string;

  @IsDateString()
  scheduledAt: string;
}

export class UpdateBookingStatusDto {
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status: string;
}
