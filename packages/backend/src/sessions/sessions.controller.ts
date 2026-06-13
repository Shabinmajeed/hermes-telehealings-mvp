import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { CreateSessionDto, UpdateSessionDto, CompleteSessionDto } from './dto';

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async findAll(@Body() params: any) {
    return this.sessionsService.findAll(params);
  }

  @Get(':id')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Post()
  @Roles(Role.CLIENT, Role.ADMIN)
  async create(@Body() data: CreateSessionDto) {
    return this.sessionsService.create(data);
  }

  @Patch(':id')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async update(@Param('id') id: string, @Body() data: UpdateSessionDto) {
    return this.sessionsService.update(id, data);
  }

  @Post(':id/cancel')
  @Roles(Role.CLIENT, Role.THERAPIST, Role.ADMIN)
  async cancel(@Param('id') id: string) {
    return this.sessionsService.cancel(id);
  }

  @Post(':id/complete')
  @Roles(Role.THERAPIST, Role.ADMIN)
  async complete(@Param('id') id: string, @Body() body: CompleteSessionDto) {
    return this.sessionsService.complete(id, body.feedback, body.rating);
  }
}
