import { PrismaService } from '../common/prisma.service';
export declare class UploadsService {
    private prisma;
    constructor(prisma: PrismaService);
    static getStaticUploadDir(): string;
    getUploadDir(): string;
    saveFileMetadata(filename: string, originalName: string, mimeType: string, size: number, filePath: string, uploadedBy?: string, category?: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        category: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string | null;
    }>;
    findByFilename(filename: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        category: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string | null;
    }>;
    findById(id: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        category: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        uploadedBy: string | null;
    }>;
    findAll(category?: string, page?: number, limit?: number): Promise<{
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
    deleteById(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getFilePath(filename: string): string;
    virusScan(filePath: string): Promise<{
        clean: boolean;
        details?: string;
    }>;
}
