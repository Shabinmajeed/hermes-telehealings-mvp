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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const client_1 = require("@prisma/client");
let NotificationsService = class NotificationsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll(userId) {
        const cacheKey = `notifications:${userId}:list`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const result = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        await this.redis.setJson(cacheKey, result, 30);
        return result;
    }
    async getUnreadCount(userId) {
        const cacheKey = `notifications:${userId}:unread`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });
        const result = { unreadCount: count };
        await this.redis.setJson(cacheKey, result, 30);
        return result;
    }
    async markAsRead(id, userId) {
        const result = await this.prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
        await this.redis.deletePattern(`notifications:${userId}:*`);
        return result;
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        await this.redis.deletePattern(`notifications:${userId}:*`);
        return result;
    }
    async create(data) {
        const result = await this.prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                body: data.body,
                type: data.type || client_1.NotificationType.SYSTEM,
            },
        });
        await this.redis.deletePattern(`notifications:${data.userId}:*`);
        return result;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map