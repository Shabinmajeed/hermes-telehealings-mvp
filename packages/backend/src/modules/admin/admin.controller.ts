import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== USER MANAGEMENT ==========

  @Get('users')
  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'suspended', 'all'] })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getUsers(@Query('status') status?: string, @Query('search') search?: string) {
    return this.adminService.getUsers({
      status: status === 'all' ? undefined : status,
      search,
    });
  }

  @Post('users/:userId/suspend')
  @ApiOperation({ summary: 'Suspend a user account' })
  @ApiParam({ name: 'userId', description: 'User ID to suspend' })
  @HttpCode(HttpStatus.OK)
  async suspendUser(@Param('userId') userId: string) {
    return this.adminService.suspendUser(userId);
  }

  @Post('users/:userId/unsuspend')
  @ApiOperation({ summary: 'Unsuspend a user account' })
  @ApiParam({ name: 'userId', description: 'User ID to unsuspend' })
  @HttpCode(HttpStatus.OK)
  async unsuspendUser(@Param('userId') userId: string) {
    return this.adminService.unsuspendUser(userId);
  }

  @Post('users/:userId/delete')
  @ApiOperation({ summary: 'Delete a user account' })
  @ApiParam({ name: 'userId', description: 'User ID to delete' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // ========== THERAPIST MANAGEMENT ==========

  @Get('therapists')
  @ApiOperation({ summary: 'Get all therapists with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'verified', 'all'] })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'List of therapists' })
  async getTherapists(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getTherapists({
      status: status === 'all' ? undefined : status,
      search,
    });
  }

  @Post('therapists/:therapistId/approve')
  @ApiOperation({ summary: 'Approve a therapist' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID to approve' })
  @HttpCode(HttpStatus.OK)
  async approveTherapist(@Param('therapistId') therapistId: string) {
    return this.adminService.approveTherapist(therapistId);
  }

  @Post('therapists/:therapistId/reject')
  @ApiOperation({ summary: 'Reject a therapist' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID to reject' })
  @HttpCode(HttpStatus.OK)
  async rejectTherapist(@Param('therapistId') therapistId: string) {
    return this.adminService.rejectTherapist(therapistId);
  }

  // ========== ANALYTICS & REPORTS ==========

  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  @ApiResponse({ status: 200, description: 'Platform statistics' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get platform reports' })
  @ApiResponse({ status: 200, description: 'Registration reports' })
  async getReports() {
    return this.adminService.getReports();
  }

  // ========== PLATFORM SETTINGS ==========

  @Get('settings')
  @ApiOperation({ summary: 'Get platform settings' })
  @ApiResponse({ status: 200, description: 'Platform settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update platform settings' })
  @ApiResponse({ status: 200, description: 'Updated settings' })
  async updateSettings(@Body() data: Record<string, any>) {
    return this.adminService.updateSettings(data);
  }
}
