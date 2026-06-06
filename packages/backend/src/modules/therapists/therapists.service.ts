import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TherapistsService {
  constructor(private prisma: PrismaService) {}

  async searchTherapists(
    filters: any = {},
  ): Promise<any> {
    const {
      specialization,
      language,
      minPrice,
      maxPrice,
      minRating,
      skip = 0,
      take = 10,
    } = filters;

    const whereClause: any = {};

    if (specialization) {
      whereClause.specializations = {
        has: specialization,
      };
    }

    if (language) {
      whereClause.languages = {
        has: language,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.hourlyRate = {};
      if (minPrice !== undefined) whereClause.hourlyRate.gte = minPrice;
      if (maxPrice !== undefined) whereClause.hourlyRate.lte = maxPrice;
    }

    if (minRating !== undefined) {
      whereClause.rating = {
        gte: minRating,
      };
    }

    const therapists = await this.prisma.therapist.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        availability: true,
      },
    });

    const total = await this.prisma.therapist.count({
      where: whereClause,
    });

    return {
      therapists,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async getTherapistById(therapistId: string): Promise<any> {
    return this.prisma.therapist.findUnique({
      where: { id: therapistId },
      include: {
        availability: true,
      },
    });
  }

  async getTherapistAvailability(therapistId: string): Promise<any> {
    return this.prisma.therapistAvailability.findMany({
      where: { therapistId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async getTherapistReviews(therapistId: string): Promise<any> {
    // Placeholder for reviews
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };
  }

  async addToFavorites(
    userId: string,
    therapistId: string,
  ): Promise<any> {
    return {
      message: 'Added to favorites',
      // Would be implemented in favorite model
    };
  }

  async getUserFavorites(userId: string): Promise<any> {
    // Placeholder for user favorites
    return {
      favorites: [],
      message: 'No favorite therapists yet',
    };
  }
}
