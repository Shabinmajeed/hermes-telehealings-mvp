import { IsString, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CreateTherapistProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialization?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;
}
