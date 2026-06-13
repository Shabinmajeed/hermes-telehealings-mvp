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
exports.TherapistsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const pagination_util_1 = require("../common/pagination/pagination.util");
let TherapistsService = class TherapistsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll(params) {
        const { cursor, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', specialization, } = params;
        const cacheKey = `therapists:list:${specialization || 'all'}:${cursor || 'start'}:${limit}`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const where = {
            role: 'THERAPIST',
            ...(specialization
                ? { therapistProfile: { specialization: { has: specialization } } }
                : {}),
        };
        if (cursor) {
            where.id = { gt: (0, pagination_util_1.decodeCursor)(cursor) };
        }
        const items = await this.prisma.user.findMany({
            where,
            take: limit + 1,
            select: {
                id: true,
                status: true,
                createdAt: true,
                therapistProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        specialization: true,
                        rating: true,
                        reviewCount: true,
                        yearsExperience: true,
                        isVerified: true,
                    },
                },
            },
            orderBy: { [sortBy]: sortOrder },
        });
        const result = (0, pagination_util_1.buildPaginatedResult)(items, limit);
        await this.redis.setJson(cacheKey, result, 120);
        return result;
    }
    async findOne(id) {
        const cacheKey = `therapist:${id}:profile`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const result = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                createdAt: true,
                therapistProfile: true,
            },
        });
        if (result) {
            await this.redis.setJson(cacheKey, result, 300);
        }
        return result;
    }
    async createProfile(userId, data) {
        const result = await this.prisma.therapistProfile.create({
            data: { userId, ...data },
        });
        await this.redis.deletePattern('therapists:list:*');
        return result;
    }
    async updateProfile(userId, data) {
        const result = await this.prisma.therapistProfile.update({
            where: { userId },
            data,
        });
        await this.redis.deletePattern('therapists:list:*');
        await this.redis.deletePattern(`therapist:${userId}:*`);
        return result;
    }
    async getSessions(therapistId) {
        return this.prisma.session.findMany({
            where: { therapistId },
            select: {
                id: true,
                scheduledAt: true,
                duration: true,
                type: true,
                status: true,
                client: {
                    select: {
                        id: true,
                        clientProfile: { select: { firstName: true, lastName: true, avatar: true } },
                    },
                },
            },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async getAvailability(therapistId) {
        return { therapistId, availability: [] };
    }
};
exports.TherapistsService = TherapistsService;
exports.TherapistsService = TherapistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], TherapistsService);
//# sourceMappingURL=therapists.service.js.map