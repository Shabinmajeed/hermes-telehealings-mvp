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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const pagination_util_1 = require("../common/pagination/pagination.util");
let SessionsService = class SessionsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll(params) {
        const { cursor, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', status, clientId, therapistId, } = params;
        const cacheKey = `sessions:list:${status || 'all'}:${clientId || 'all'}:${therapistId || 'all'}:${cursor || 'start'}:${limit}:${sortBy}:${sortOrder}`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const where = {
            ...(status ? { status: status } : {}),
            ...(clientId ? { clientId } : {}),
            ...(therapistId ? { therapistId } : {}),
        };
        if (cursor) {
            where.id = { gt: (0, pagination_util_1.decodeCursor)(cursor) };
        }
        const items = await this.prisma.session.findMany({
            where,
            take: limit + 1,
            select: {
                id: true,
                scheduledAt: true,
                duration: true,
                type: true,
                status: true,
                rating: true,
                createdAt: true,
                client: {
                    select: {
                        id: true,
                        clientProfile: { select: { firstName: true, lastName: true, avatar: true } },
                    },
                },
                therapist: {
                    select: {
                        user: { select: { id: true } },
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { [sortBy]: sortOrder },
        });
        const result = (0, pagination_util_1.buildPaginatedResult)(items, limit);
        await this.redis.setJson(cacheKey, result, 60);
        return result;
    }
    async findOne(id) {
        const cacheKey = `session:${id}:detail`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const session = await this.prisma.session.findUnique({
            where: { id },
            select: {
                id: true,
                scheduledAt: true,
                duration: true,
                type: true,
                status: true,
                notes: true,
                rating: true,
                feedback: true,
                createdAt: true,
                client: {
                    select: {
                        id: true,
                        clientProfile: { select: { firstName: true, lastName: true, avatar: true } },
                    },
                },
                therapist: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        specialization: true,
                    },
                },
                payment: { select: { id: true, amount: true, status: true } },
            },
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        await this.redis.setJson(cacheKey, session, 120);
        return session;
    }
    async create(data) {
        const result = await this.prisma.session.create({ data });
        await this.redis.invalidateSessionListCache();
        return result;
    }
    async update(id, data) {
        const result = await this.prisma.session.update({ where: { id }, data });
        await this.redis.invalidateSessionListCache();
        await this.redis.deletePattern(`session:${id}:*`);
        return result;
    }
    async cancel(id) {
        const result = await this.prisma.session.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
        await this.redis.invalidateSessionListCache();
        await this.redis.deletePattern(`session:${id}:*`);
        return result;
    }
    async complete(id, feedback, rating) {
        const result = await this.prisma.session.update({
            where: { id },
            data: { status: 'COMPLETED', feedback, rating },
        });
        await this.redis.invalidateSessionListCache();
        await this.redis.deletePattern(`session:${id}:*`);
        return result;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map