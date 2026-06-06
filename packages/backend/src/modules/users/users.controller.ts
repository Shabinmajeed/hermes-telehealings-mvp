import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Param('id') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(@Param('id') userId: string, @Body() data: any) {
    return this.usersService.updateUserProfile(userId, data);
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadAvatar(
    @Param('id') userId: string,
    @Body('avatarUrl') avatarUrl: string,
  ) {
    return this.usersService.uploadAvatar(userId, avatarUrl);
  }

  @Get(':id/sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getSessions(@Param('id') userId: string) {
    return this.usersService.getUserSessions(userId);
  }

  @Get(':id/recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getRecommendations(@Param('id') userId: string) {
    return this.usersService.getRecommendations(userId);
  }
}
