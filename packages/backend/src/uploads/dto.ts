// src/uploads/dto.ts
import { IsString, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  category?: string;
}

export class FileCategoryDto {
  @IsIn(['profile_photo', 'therapy_document', 'content_asset', 'general'])
  category: string;
}

export class FileQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
