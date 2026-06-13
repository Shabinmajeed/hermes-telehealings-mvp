"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uploads_service_1 = require("./uploads.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const dto_1 = require("./dto");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadFile(file, body, req) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const scanResult = await this.uploadsService.virusScan(file.path);
        if (!scanResult.clean) {
            const fs = await import('fs');
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw new common_1.BadRequestException(`File rejected by virus scan: ${scanResult.details}`);
        }
        const category = body.category || 'general';
        const record = await this.uploadsService.saveFileMetadata(file.filename, file.originalname, file.mimetype, file.size, file.path, req.user?.userId, category);
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
    async listFiles(query) {
        const { category, page = 1, limit = 20 } = query;
        return this.uploadsService.findAll(category, page, limit);
    }
    async serveFile(filename, res) {
        if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
            throw new common_1.BadRequestException('Invalid filename');
        }
        const file = await this.uploadsService.findByFilename(filename);
        const filePath = (0, path_1.join)(this.uploadsService.getUploadDir(), filename);
        const resolvedPath = (0, path_1.resolve)(filePath);
        const uploadDir = (0, path_1.resolve)(this.uploadsService.getUploadDir());
        if (!resolvedPath.startsWith(uploadDir + path_1.sep) && resolvedPath !== uploadDir) {
            throw new common_1.BadRequestException('Invalid file path');
        }
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'private, max-age=3600');
        return res.sendFile(filePath);
    }
    async deleteFile(id) {
        return this.uploadsService.deleteById(id);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadDir = uploads_service_1.UploadsService.getStaticUploadDir();
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${(0, path_1.extname)(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException(`File type "${file.mimetype}" is not allowed. Allowed types: images (jpeg, png, gif, webp, svg) and documents (pdf, doc, docx, xls, xlsx, txt, csv)`), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: MAX_FILE_SIZE,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UploadFileDto, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FileQueryDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)(':filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "serveFile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "deleteFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map