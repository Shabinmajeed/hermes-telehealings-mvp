// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
import { buildPaginatedResult, decodeCursor } from '../common/pagination/pagination.util';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(params: {
    cursor?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    role?: string;
  }): Promise<PaginatedResult<any>> {
    const {
      cursor,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      role,
    } = params;

    const cacheKey = `users:list:${role || 'all'}:${cursor || 'start'}:${limit}`;
    const cached = await this.redis.getJson<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const where: any = role ? { role: role as any } : {};

    if (cursor) {
      where.id = { gt: decodeCursor(cursor) };
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

    const result = buildPaginatedResult(items, limit);
    await this.redis.setJson(cacheKey, result, 120);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `user:${id}:profile`;
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: any) {
    const result = await this.prisma.user.update({ where: { id }, data });
    await this.redis.invalidateUserCache(id);
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.user.delete({ where: { id } });
    await this.redis.invalidateUserCache(id);
    return result;
  }
}
