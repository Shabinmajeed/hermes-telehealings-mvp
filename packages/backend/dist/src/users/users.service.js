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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const pagination_util_1 = require("../common/pagination/pagination.util");
let UsersService = class UsersService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll(params) {
        const { cursor, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', role, } = params;
        const cacheKey = `users:list:${role || 'all'}:${cursor || 'start'}:${limit}`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const where = role ? { role: role } : {};
        if (cursor) {
            where.id = { gt: (0, pagination_util_1.decodeCursor)(cursor) };
        }
        const items = await this.prisma.user.findMany({
            where,
            take: limit + 1,
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                clientProfile: { select: { firstName: true, lastName: true, avatar: true } },
                therapistProfile: { select: { firstName: true, lastName: true, avatar: true, specialization: true, rating: true, isVerified: true } },
            },
            orderBy: { [sortBy]: sortOrder },
        });
        const result = (0, pagination_util_1.buildPaginatedResult)(items, limit);
        await this.redis.setJson(cacheKey, result, 120);
        return result;
    }
    async findOne(id) {
        const cacheKey = `user:${id}:profile`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const result = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                clientProfile: true,
                therapistProfile: true,
            },
        });
        if (result) {
            await this.redis.setJson(cacheKey, result, 300);
        }
        return result;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async update(id, data) {
        const result = await this.prisma.user.update({ where: { id }, data });
        await this.redis.invalidateUserCache(id);
        return result;
    }
    async remove(id) {
        const result = await this.prisma.user.delete({ where: { id } });
        await this.redis.invalidateUserCache(id);
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], UsersService);
//# sourceMappingURL=users.service.js.map