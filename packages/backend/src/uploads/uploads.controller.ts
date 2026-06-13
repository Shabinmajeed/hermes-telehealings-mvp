// src/uploads/uploads.controller.ts
import type { Response, Request } from 'express';
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve, sep } from 'path';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileQueryDto, UploadFileDto } from './dto';

// Allowed MIME types for images and documents
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * POST /uploads
   * Upload a single file.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = UploadsService.getStaticUploadDir();
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `File type "${file.mimetype}" is not allowed. Allowed types: images (jpeg, png, gif, webp, svg) and documents (pdf, doc, docx, xls, xlsx, txt, csv)`,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Body() body: UploadFileDto,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Virus scan hook
    const scanResult = await this.uploadsService.virusScan(file.path);
    if (!scanResult.clean) {
      const fs = await import('fs');
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException(`File rejected by virus scan: ${scanResult.details}`);
    }

    // Determine category
    const category = body.category || 'general';

    // Save metadata to database
    const record = await this.uploadsService.saveFileMetadata(
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
      file.path,
      (req as any).user?.userId,
      category,
    );

    return {
      id: record.id,
      filename: record.filename,
      originalName: record.originalName,
      mimeType: record.mimeType,
      size: record.size,
      category: record.category,
      url: `/uploads/${record.filename}`,
      createdAt: record.createdAt,
    };
  }

  /**
   * GET /uploads
   * List uploaded files with optional category filter and pagination.
   */
  @Get()
  async listFiles(@Query() query: FileQueryDto) {
    const { category, page = 1, limit = 20 } = query;
    return this.uploadsService.findAll(category, page, limit);
  }

  /**
   * GET /uploads/:filename
   * Serve a file by its stored filename.
   * Security: validates filename to prevent path traversal attacks.
   */
  @Get(':filename')
  async serveFile(@Param('filename') filename: string, @Res() res: any) {
    // Prevent path traversal: reject filenames with path separators or parent directory references
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
      throw new BadRequestException('Invalid filename');
    }

    const file = await this.uploadsService.findByFilename(filename);
    const filePath = join(this.uploadsService.getUploadDir(), filename);

    // Double-check the resolved path is within the upload directory
    const resolvedPath = resolve(filePath);
    const uploadDir = resolve(this.uploadsService.getUploadDir());
    if (!resolvedPath.startsWith(uploadDir + sep) && resolvedPath !== uploadDir) {
      throw new BadRequestException('Invalid file path');
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
    // Security headers for file serving
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    return res.sendFile(filePath);
  }

  /**
   * DELETE /uploads/:id
   * Delete a file by its database ID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') id: string) {
    return this.uploadsService.deleteById(id);
  }
}
