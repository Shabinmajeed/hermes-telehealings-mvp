// src/therapists/therapists.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { PaginatedResult } from '../common/pagination/pagination.dto';
import { buildPaginatedResult, decodeCursor } from '../common/pagination/pagination.util';

@Injectable()
export class TherapistsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(params: {
    cursor?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    specialization?: string;
  }): Promise<PaginatedResult<any>> {
    const {
      cursor,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      specialization,
    } = params;

    const cacheKey = `therapists:list:${specialization || 'all'}:${cursor || 'start'}:${limit}`;
    const cached = await this.redis.getJson<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

    const where: any = {
      role: 'THERAPIST' as any,
      ...(specialization
        ? { therapistProfile: { specialization: { has: specialization } } }
        : {}),
    };

    if (cursor) {
      where.id = { gt: decodeCursor(cursor) };
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

    const result = buildPaginatedResult(items, limit);
    await this.redis.setJson(cacheKey, result, 120);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `therapist:${id}:profile`;
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

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

  async createProfile(userId: string, data: any) {
    const result = await this.prisma.therapistProfile.create({
      data: { userId, ...data },
    });
    await this.redis.deletePattern('therapists:list:*');
    return result;
  }

  async updateProfile(userId: string, data: any) {
    const result = await this.prisma.therapistProfile.update({
      where: { userId },
      data,
    });
    await this.redis.deletePattern('therapists:list:*');
    await this.redis.deletePattern(`therapist:${userId}:*`);
    return result;
  }

  async getSessions(therapistId: string) {
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

  async getAvailability(therapistId: string) {
    return { therapistId, availability: [] };
  }
}
