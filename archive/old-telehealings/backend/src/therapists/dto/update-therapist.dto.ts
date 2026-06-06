import { IsOptional, IsString, IsNumber, IsArray, IsDate, Min, MaxLength } from 'class-validator';

export class UpdateTherapistDto {
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licenseType?: string;

  @IsOptional()
  @IsString()
  licenseState?: string;

  @IsOptional()
  @IsDate()
  licenseExpiry?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsString()
  verificationDocument?: string;

  @IsOptional()
  @IsBoolean()
  licenseVerified?: boolean;
}