import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { PrismaService } from '../common/prisma.service';

const mockPrismaService = {
  fileUpload: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UploadsService', () => {
  let service: UploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
    jest.clearAllMocks();
  });

  describe('saveFileMetadata', () => {
    it('should save file metadata to database', async () => {
      const fileData = {
        filename: 'test-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        filePath: '/uploads/test-123.jpg',
        uploadedBy: 'user-1',
        category: 'profile_photo',
      };
      const created = { id: 'f-1', ...fileData };
      mockPrismaService.fileUpload.create.mockResolvedValue(created);

      const result = await service.saveFileMetadata(
        fileData.filename,
        fileData.originalName,
        fileData.mimeType,
        fileData.size,
        fileData.filePath,
        fileData.uploadedBy,
        fileData.category,
      );

      expect(result).toEqual(created);
      expect(mockPrismaService.fileUpload.create).toHaveBeenCalledWith({
        data: {
          filename: fileData.filename,
          originalName: fileData.originalName,
          mimeType: fileData.mimeType,
          size: fileData.size,
          path: fileData.filePath,
          uploadedBy: fileData.uploadedBy,
          category: fileData.category,
        },
      });
    });

    it('should use default category when not provided', async () => {
      mockPrismaService.fileUpload.create.mockResolvedValue({ id: 'f-1' });

      await service.saveFileMetadata(
        'test.jpg',
        'test.jpg',
        'image/jpeg',
        1024,
        '/path/test.jpg',
      );

      expect(mockPrismaService.fileUpload.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ category: 'general' }),
      });
    });
  });

  describe('findByFilename', () => {
    it('should find a file by filename', async () => {
      const file = { id: 'f-1', filename: 'test-123.jpg' };
      mockPrismaService.fileUpload.findFirst.mockResolvedValue(file);

      const result = await service.findByFilename('test-123.jpg');

      expect(result).toEqual(file);
    });

    it('should throw NotFoundException if file not found', async () => {
      mockPrismaService.fileUpload.findFirst.mockResolvedValue(null);

      await expect(service.findByFilename('nonexistent.jpg')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should find a file by id', async () => {
      const file = { id: 'f-1', filename: 'test.jpg' };
      mockPrismaService.fileUpload.findUnique.mockResolvedValue(file);

      const result = await service.findById('f-1');

      expect(result).toEqual(file);
    });

    it('should throw NotFoundException if file not found', async () => {
      mockPrismaService.fileUpload.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated files', async () => {
      const files = [{ id: 'f-1' }, { id: 'f-2' }];
      mockPrismaService.fileUpload.findMany.mockResolvedValue(files);
      mockPrismaService.fileUpload.count.mockResolvedValue(2);

      const result = await service.findAll(undefined, 1, 20);

      expect(result).toEqual({
        files,
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should filter by category when provided', async () => {
      mockPrismaService.fileUpload.findMany.mockResolvedValue([]);
      mockPrismaService.fileUpload.count.mockResolvedValue(0);

      await service.findAll('profile_photo', 1, 20);

      expect(mockPrismaService.fileUpload.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: 'profile_photo' },
        }),
      );
    });

    it('should calculate total pages correctly', async () => {
      mockPrismaService.fileUpload.findMany.mockResolvedValue([]);
      mockPrismaService.fileUpload.count.mockResolvedValue(25);

      const result = await service.findAll(undefined, 1, 10);

      expect(result.totalPages).toBe(3);
    });
  });

  describe('deleteById', () => {
    it('should delete a file by id', async () => {
      const file = {
        id: 'f-1',
        filename: 'test.jpg',
        originalName: 'test.jpg',
        path: '/uploads/test.jpg',
      };
      mockPrismaService.fileUpload.findUnique.mockResolvedValue(file);
      mockPrismaService.fileUpload.delete.mockResolvedValue(file);

      const result = await service.deleteById('f-1');

      expect(result.success).toBe(true);
      expect(mockPrismaService.fileUpload.delete).toHaveBeenCalledWith({
        where: { id: 'f-1' },
      });
    });

    it('should throw NotFoundException if file not found', async () => {
      mockPrismaService.fileUpload.findUnique.mockResolvedValue(null);

      await expect(service.deleteById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('virusScan', () => {
    it('should return clean by default (placeholder)', async () => {
      const result = await service.virusScan('/path/to/file.jpg');

      expect(result.clean).toBe(true);
    });
  });

  describe('getUploadDir', () => {
    it('should return upload directory path', () => {
      // Static method test
      const dir = UploadsService.getStaticUploadDir();
      expect(dir).toContain('uploads');
    });
  });
});
