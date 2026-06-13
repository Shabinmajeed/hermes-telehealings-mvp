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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const redis_service_1 = require("../common/redis.service");
const pagination_util_1 = require("../common/pagination/pagination.util");
let PaymentsService = class PaymentsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findAll(params) {
        const { cursor, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status, clientId, } = params;
        const cacheKey = `payments:list:${status || 'all'}:${clientId || 'all'}:${cursor || 'start'}:${limit}`;
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
        const items = await this.prisma.payment.findMany({
            where,
            take: limit + 1,
            select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                createdAt: true,
                client: { select: { id: true, clientProfile: { select: { firstName: true, lastName: true } } } },
                session: { select: { id: true, scheduledAt: true } },
            },
            orderBy: { [sortBy]: sortOrder },
        });
        const result = (0, pagination_util_1.buildPaginatedResult)(items, limit);
        await this.redis.setJson(cacheKey, result, 60);
        return result;
    }
    async findOne(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: { client: true, session: true },
        });
    }
    async create(data) {
        const result = await this.prisma.payment.create({ data });
        await this.redis.deletePattern('payments:list:*');
        return result;
    }
    async updateStatus(id, status) {
        const result = await this.prisma.payment.update({
            where: { id },
            data: { status: status },
        });
        await this.redis.deletePattern('payments:list:*');
        return result;
    }
    async processRefund(id) {
        const result = await this.prisma.payment.update({
            where: { id },
            data: { status: 'REFUNDED' },
        });
        await this.redis.deletePattern('payments:list:*');
        return result;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map