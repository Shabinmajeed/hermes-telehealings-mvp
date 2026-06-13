import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { CursorPaginationDto } from '../common/pagination/pagination.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() pagination: CursorPaginationDto) {
    return this.paymentsService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @Roles(Role.CLIENT, Role.ADMIN)
  async create(@Body() data: any) {
    return this.paymentsService.create(data);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  async updateStatus(@Param('id') id: string, @Body() dto: any) {
    return this.paymentsService.updateStatus(id, dto.status);
  }

  @Post(':id/refund')
  @Roles(Role.ADMIN)
  async refund(@Param('id') id: string) {
    return this.paymentsService.processRefund(id);
  }
}
