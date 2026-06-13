import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'telehealings-api',
    };
  }

  @Get()
  root() {
    return {
      status: 'ok',
      message: 'TeleHealings API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
