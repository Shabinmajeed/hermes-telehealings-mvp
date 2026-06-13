// src/uploads/uploads.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Static version of getUploadDir for use in Multer config (before DI).
   */
  static getStaticUploadDir(): string {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    return UPLOAD_DIR;
  }

  /**
   * Ensure the upload directory exists.
   */
  getUploadDir(): string {
    return UploadsService.getStaticUploadDir();
  }

  /**
   * Save file metadata to the database.
   */
  async saveFileMetadata(
    filename: string,
    originalName: string,
    mimeType: string,
    size: number,
    filePath: string,
    uploadedBy?: string,
    category = 'general',
  ) {
    return this.prisma.fileUpload.create({
      data: {
        filename,
        originalName,
        mimeType,
        size,
        path: filePath,
        uploadedBy,
        category,
      },
    });
  }

  /**
   * Find a file record by its filename.
   */
  async findByFilename(filename: string) {
    const file = await this.prisma.fileUpload.findFirst({
      where: { filename },
    });
    if (!file) {
      throw new NotFoundException(`File "${filename}" not found`);
    }
    return file;
  }

  /**
   * Find a file record by its ID.
   */
  async findById(id: string) {
    const file = await this.prisma.fileUpload.findUnique({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException(`File with id "${id}" not found`);
    }
    return file;
  }

  /**
   * List files with optional category filter and pagination.
   */
  async findAll(category?: string, page = 1, limit = 20) {
    const where = category ? { category } : {};
    const [files, total] = await Promise.all([
      this.prisma.fileUpload.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fileUpload.count({ where }),
    ]);
    return {
      files,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Delete a file by its ID. Removes both DB record and physical file.
   */
  async deleteById(id: string) {
    const file = await this.findById(id);

    // Remove physical file
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      // Log but continue — DB record should still be removed
      console.error(`Failed to delete physical file: ${file.path}`, err);
    }

    // Remove DB record
    await this.prisma.fileUpload.delete({ where: { id } });
    return { success: true, message: `File "${file.originalName}" deleted` };
  }

  /**
   * Get the full filesystem path for a filename.
   */
  getFilePath(filename: string): string {
    return path.join(this.getUploadDir(), filename);
  }

  /**
   * Virus scan hook placeholder.
   * In production, integrate with ClamAV or a cloud scanning service.
   */
  async virusScan(filePath: string): Promise<{ clean: boolean; details?: string }> {
    // Placeholder: always returns clean
    // TODO: Integrate with ClamAV (clamscan) or cloud service
    return { clean: true, details: 'Virus scan placeholder — no scan performed' };
  }
}
