import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { CreateTherapistProfileDto } from './dto';

@Controller('therapists')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TherapistsController {
  constructor(private therapistsService: TherapistsService) {}

  @Get()
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async findAll(@Body() params: any) {
    return this.therapistsService.findAll(params);
  }

  @Get(':id')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.therapistsService.findOne(id);
  }

  @Post('profile')
  @Roles(Role.THERAPIST)
  async createProfile(@Req() req: any, @Body() data: CreateTherapistProfileDto) {
    return this.therapistsService.createProfile(req.user.id, data);
  }

  @Patch('profile')
  @Roles(Role.THERAPIST)
  async updateProfile(@Req() req: any, @Body() data: CreateTherapistProfileDto) {
    return this.therapistsService.updateProfile(req.user.id, data);
  }

  @Get(':id/sessions')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async getSessions(@Param('id') id: string) {
    return this.therapistsService.getSessions(id);
  }

  @Get(':id/availability')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async getAvailability(@Param('id') id: string) {
    return this.therapistsService.getAvailability(id);
  }
}
