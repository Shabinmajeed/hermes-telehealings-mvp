// src/clients/clients.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
import { buildPaginatedResult, decodeCursor } from '../common/pagination/pagination.util';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(params: {
    cursor?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedResult<any>> {
    const {
      cursor,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const cacheKey = `clients:list:${cursor || 'start'}:${limit}`;
    const cached = await this.redis.getJson<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const where: any = { role: 'CLIENT' as any };

    if (cursor) {
      where.id = { gt: decodeCursor(cursor) };
    }

    const items = await this.prisma.user.findMany({
      where,
      take: limit + 1,
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        clientProfile: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
    });

    const result = buildPaginatedResult(items, limit);
    await this.redis.setJson(cacheKey, result, 120);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `client:${id}:profile`;
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

    const result = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        clientProfile: true,
      },
    });

    if (result) {
      await this.redis.setJson(cacheKey, result, 300);
    }
    return result;
  }

  async createProfile(userId: string, data: any) {
    const result = await this.prisma.clientProfile.create({
      data: { userId, ...data },
    });
    await this.redis.deletePattern('clients:list:*');
    return result;
  }

  async updateProfile(userId: string, data: any) {
    const result = await this.prisma.clientProfile.update({
      where: { userId },
      data,
    });
    await this.redis.deletePattern('clients:list:*');
    await this.redis.deletePattern(`client:${userId}:*`);
    return result;
  }

  async getSessions(clientId: string) {
    return this.prisma.session.findMany({
      where: { clientId },
      select: {
        id: true,
        scheduledAt: true,
        duration: true,
        type: true,
        status: true,
        rating: true,
        therapist: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }
}
