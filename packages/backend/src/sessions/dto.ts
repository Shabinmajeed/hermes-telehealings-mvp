import { IsString, IsOptional, IsInt, Min, IsEnum, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  clientId: string;

  @IsString()
  therapistId: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsEnum(['VIDEO', 'AUDIO', 'CHAT'])
  type?: string;
}

export class UpdateSessionDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsEnum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteSessionDto {
  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  rating?: number;
}
