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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const pagination_util_1 = require("../common/pagination/pagination.util");
let BookingsService = class BookingsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll(params) {
        const { cursor, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', status, clientId, } = params;
        const cacheKey = `bookings:list:${status || 'all'}:${clientId || 'all'}:${cursor || 'start'}:${limit}`;
        const cached = await this.redis.getJson(cacheKey);
        if (cached)
            return cached;
        const where = {
            ...(status ? { status: status } : {}),
            ...(clientId ? { clientId } : {}),
        };
        if (cursor) {
            where.id = { gt: (0, pagination_util_1.decodeCursor)(cursor) };
        }
        const items = await this.prisma.booking.findMany({
            where,
            take: limit + 1,
            select: {
                id: true,
                sessionType: true,
                scheduledAt: true,
                status: true,
                createdAt: true,
            },
            orderBy: { [sortBy]: sortOrder },
        });
        const result = (0, pagination_util_1.buildPaginatedResult)(items, limit);
        await this.redis.setJson(cacheKey, result, 60);
        return result;
    }
    async findOne(id) {
        return this.prisma.booking.findUnique({ where: { id } });
    }
    async create(data) {
        const result = await this.prisma.booking.create({ data });
        await this.redis.deletePattern('bookings:list:*');
        return result;
    }
    async updateStatus(id, status) {
        const result = await this.prisma.booking.update({
            where: { id },
            data: { status: status },
        });
        await this.redis.deletePattern('bookings:list:*');
        return result;
    }
    async cancel(id) {
        const result = await this.prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
        await this.redis.deletePattern('bookings:list:*');
        return result;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map