// src/sessions/sessions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
import { buildPaginatedResult, decodeCursor } from '../common/pagination/pagination.util';

@Injectable()
export class SessionsService {
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
    therapistId?: string;
  }): Promise<PaginatedResult<any>> {
    const {
      cursor,
      limit = 20,
      sortBy = 'scheduledAt',
      sortOrder = 'desc',
      status,
      clientId,
      therapistId,
    } = params;

    const cacheKey = `sessions:list:${status || 'all'}:${clientId || 'all'}:${therapistId || 'all'}:${cursor || 'start'}:${limit}:${sortBy}:${sortOrder}`;
    const cached = await this.redis.getJson<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const where: any = {
      ...(status ? { status: status as any } : {}),
      ...(clientId ? { clientId } : {}),
      ...(therapistId ? { therapistId } : {}),
    };

    if (cursor) {
      where.id = { gt: decodeCursor(cursor) };
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

    const result = buildPaginatedResult(items, limit);
    await this.redis.setJson(cacheKey, result, 60);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `session:${id}:detail`;
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

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
    if (!session) throw new NotFoundException('Session not found');

    await this.redis.setJson(cacheKey, session, 120);
    return session;
  }

  async create(data: any) {
    const result = await this.prisma.session.create({ data });
    await this.redis.invalidateSessionListCache();
    return result;
  }

  async update(id: string, data: any) {
    const result = await this.prisma.session.update({ where: { id }, data });
    await this.redis.invalidateSessionListCache();
    await this.redis.deletePattern(`session:${id}:*`);
    return result;
  }

  async cancel(id: string) {
    const result = await this.prisma.session.update({
      where: { id },
      data: { status: 'CANCELLED' as any },
    });
    await this.redis.invalidateSessionListCache();
    await this.redis.deletePattern(`session:${id}:*`);
    return result;
  }

  async complete(id: string, feedback?: string, rating?: number) {
    const result = await this.prisma.session.update({
      where: { id },
      data: { status: 'COMPLETED' as any, feedback, rating },
    });
    await this.redis.invalidateSessionListCache();
    await this.redis.deletePattern(`session:${id}:*`);
    return result;
  }
}
