import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Availability')
@Controller('therapists')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createAvailability(
    @Param('id') therapistId: string,
    @Body() data: any,
  ) {
    return this.availabilityService.createAvailability(therapistId, data);
  }

  @Get(':id/availability')
  async getAvailability(@Param('id') therapistId: string) {
    return this.availabilityService.getAvailability(therapistId);
  }

  @Patch(':therapistId/availability/:slotId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateAvailability(
    @Param('slotId') slotId: string,
    @Body() data: any,
  ) {
    return this.availabilityService.updateAvailability(slotId, data);
  }

  @Delete(':therapistId/availability/:slotId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteAvailability(@Param('slotId') slotId: string) {
    return this.availabilityService.deleteAvailability(slotId);
  }

  @Post(':id/blocked-dates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createBlockedDate(@Param('id') therapistId: string, @Body() data: any) {
    return this.availabilityService.createBlockedDate(therapistId, data);
  }

  @Get(':id/blocked-dates')
  async getBlockedDates(@Param('id') therapistId: string) {
    return this.availabilityService.getBlockedDates(therapistId);
  }

  @Delete(':therapistId/blocked-dates/:dateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteBlockedDate(@Param('dateId') dateId: string) {
    return this.availabilityService.deleteBlockedDate(dateId);
  }

  @Get(':id/available-slots')
  async getAvailableSlots(
    @Param('id') therapistId: string,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailableSlots(therapistId, date);
  }
}
