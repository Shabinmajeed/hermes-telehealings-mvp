import { Controller, Post, Get, Body, UseGuards, Req, Ip } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, LoginDto, RefreshDto } from './dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 registrations per minute
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.role);
  }

  @Post('login')
  @Throttle({ auth: { limit: 10, ttl: 900000 } }) // 10 login attempts per 15 minutes
  async login(@Body() dto: LoginDto, @Ip() ip: string) {
    return this.authService.login(dto.email, dto.password, ip);
  }

  @Post('refresh')
  @Throttle({ auth: { limit: 10, ttl: 900000 } }) // 10 refresh attempts per 15 minutes
  async refresh(@Body() dto: RefreshDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.authService.refresh(userId, dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const jti = req.user?.jti;
    return this.authService.logout(req.user.id, jti);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Req() req: any) {
    return this.authService.logoutAll(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
