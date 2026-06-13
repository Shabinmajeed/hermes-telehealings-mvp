import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { CreateClientProfileDto } from './dto';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.THERAPIST)
  async findAll() {
    return this.clientsService.findAll({});
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.THERAPIST, Role.CLIENT)
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post('profile')
  @Roles(Role.CLIENT)
  async createProfile(@Req() req: any, @Body() data: CreateClientProfileDto) {
    return this.clientsService.createProfile(req.user.id, data);
  }

  @Patch('profile')
  @Roles(Role.CLIENT)
  async updateProfile(@Req() req: any, @Body() data: CreateClientProfileDto) {
    return this.clientsService.updateProfile(req.user.id, data);
  }

  @Get(':id/sessions')
  @Roles(Role.ADMIN, Role.THERAPIST, Role.CLIENT)
  async getSessions(@Param('id') id: string) {
    return this.clientsService.getSessions(id);
  }
}
