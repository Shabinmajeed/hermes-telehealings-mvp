// src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
import { buildPaginatedResult, decodeCursor } from '../common/pagination/pagination.util';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(params: {
    cursor?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
    clientId?: string;
  }): Promise<PaginatedResult<any>> {
    const {
      cursor,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      clientId,
    } = params;

    const cacheKey = `payments:list:${status || 'all'}:${clientId || 'all'}:${cursor || 'start'}:${limit}`;
    const cached = await this.redis.getJson<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const where: any = {
      ...(status ? { status: status as any } : {}),
      ...(clientId ? { clientId } : {}),
    };

    if (cursor) {
      where.id = { gt: decodeCursor(cursor) };
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

    const result = buildPaginatedResult(items, limit);
    await this.redis.setJson(cacheKey, result, 60);
    return result;
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { client: true, session: true },
    });
  }

  async create(data: any) {
    const result = await this.prisma.payment.create({ data });
    await this.redis.deletePattern('payments:list:*');
    return result;
  }

  async updateStatus(id: string, status: string) {
    const result = await this.prisma.payment.update({
      where: { id },
      data: { status: status as any },
    });
    await this.redis.deletePattern('payments:list:*');
    return result;
  }

  async processRefund(id: string) {
    const result = await this.prisma.payment.update({
      where: { id },
      data: { status: 'REFUNDED' as any },
    });
    await this.redis.deletePattern('payments:list:*');
    return result;
  }
}
