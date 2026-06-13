import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async findAll(@Body() params: any) {
    return this.bookingsService.findAll(params);
  }

  @Get(':id')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @Roles(Role.CLIENT, Role.ADMIN)
  async create(@Body() data: CreateBookingDto) {
    return this.bookingsService.create(data);
  }

  @Patch(':id/status')
  @Roles(Role.THERAPIST, Role.ADMIN)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto.status);
  }

  @Post(':id/cancel')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
