import { Controller, Get, Post, Query, Param, Body, UseGuards } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Therapists')
@Controller('therapists')
export class TherapistsController {
  constructor(private therapistsService: TherapistsService) {}

  @Get()
  async searchTherapists(
    @Query('specialization') specialization?: string,
    @Query('language') language?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    return this.therapistsService.searchTherapists({
      specialization,
      language,
      minPrice,
      maxPrice,
      minRating,
      skip,
      take,
    });
  }

  @Get(':id')
  async getTherapist(@Param('id') therapistId: string) {
    return this.therapistsService.getTherapistById(therapistId);
  }

  @Get(':id/availability')
  async getAvailability(@Param('id') therapistId: string) {
    return this.therapistsService.getTherapistAvailability(therapistId);
  }

  @Get(':id/reviews')
  async getReviews(@Param('id') therapistId: string) {
    return this.therapistsService.getTherapistReviews(therapistId);
  }

  @Post(':therapistId/favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addToFavorites(
    @Body('userId') userId: string,
    @Param('therapistId') therapistId: string,
  ) {
    return this.therapistsService.addToFavorites(userId, therapistId);
  }

  @Get('user/:userId/favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFavorites(@Param('userId') userId: string) {
    return this.therapistsService.getUserFavorites(userId);
  }
}
