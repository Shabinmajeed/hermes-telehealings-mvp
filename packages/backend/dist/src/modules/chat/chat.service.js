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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveMessage(sessionId, senderId, content) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.clientId !== senderId && session.therapistId !== senderId) {
            throw new common_1.ForbiddenException('You are not a participant in this session');
        }
        return this.prisma.message.create({
            data: {
                sessionId,
                senderId,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getMessageHistory(sessionId, userId, limit = 50, offset = 0) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.clientId !== userId && session.therapistId !== userId) {
            throw new common_1.ForbiddenException('You are not a participant in this session');
        }
        const messages = await this.prisma.message.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            take: limit,
            skip: offset,
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        const total = await this.prisma.message.count({
            where: { sessionId },
        });
        return { messages, total };
    }
    async isSessionParticipant(sessionId, userId) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session)
            return false;
        return session.clientId === userId || session.therapistId === userId;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map