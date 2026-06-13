import type { Request } from 'express';
import { UploadsService } from './uploads.service';
import { FileQueryDto, UploadFileDto } from './dto';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: any, body: UploadFileDto, req: Request): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        category: string;
        url: string;
        createdAt: Date;
    }>;
    listFiles(query: FileQueryDto): Promise<{
        files: {
            path: string;
            id: string;
            createdAt: Date;
            category: string;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            uploadedBy: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    serveFile(filename: string, res: any): Promise<any>;
    deleteFile(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
