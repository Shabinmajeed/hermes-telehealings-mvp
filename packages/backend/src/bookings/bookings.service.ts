// src/bookings/bookings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
import { buildPaginatedResult, decodeCursor } from '../common/pagination/pagination.util';

@Injectable()
export class BookingsService {
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
      sortBy = 'scheduledAt',
      sortOrder = 'desc',
      status,
      clientId,
    } = params;

    const cacheKey = `bookings:list:${status || 'all'}:${clientId || 'all'}:${cursor || 'start'}:${limit}`;
    const cached = await this.redis.getJson<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const where: any = {
      ...(status ? { status: status as any } : {}),
      ...(clientId ? { clientId } : {}),
    };

    if (cursor) {
      where.id = { gt: decodeCursor(cursor) };
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

    const result = buildPaginatedResult(items, limit);
    await this.redis.setJson(cacheKey, result, 60);
    return result;
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async create(data: any) {
    const result = await this.prisma.booking.create({ data });
    await this.redis.deletePattern('bookings:list:*');
    return result;
  }

  async updateStatus(id: string, status: string) {
    const result = await this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
    });
    await this.redis.deletePattern('bookings:list:*');
    return result;
  }

  async cancel(id: string) {
    const result = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' as any },
    });
    await this.redis.deletePattern('bookings:list:*');
    return result;
  }
}
