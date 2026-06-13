// src/stripe/stripe.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import {
  CreatePaymentIntentDto,
  ConfirmPaymentDto,
  RefundPaymentDto,
} from './dto';

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  // GET /stripe/config — return publishable key for frontend
  @Get('config')
  getConfig() {
    return {
      publishableKey: this.configService.get<string>('STRIPE_PUBLISHABLE_KEY'),
    };
  }

  // POST /stripe/create-payment-intent
  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto, @Req() req: any) {
    const idempotencyKey = dto.idempotencyKey || `${req.user?.userId}-${Date.now()}`;
    return this.stripeService.createPaymentIntent({
      amount: dto.amount,
      currency: dto.currency || 'USD',
      clientId: dto.clientId,
      therapistId: dto.therapistId,
      sessionId: dto.sessionId,
      idempotencyKey,
    });
  }

  // POST /stripe/confirm-payment
  @Post('confirm-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  async confirmPayment(@Body() dto: ConfirmPaymentDto) {
    return this.stripeService.confirmPayment(dto.paymentIntentId);
  }

  // POST /stripe/refund
  @Post('refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async refund(@Body() dto: RefundPaymentDto) {
    return this.stripeService.createRefund(dto.paymentIntentId, dto.amount);
  }

  // POST /stripe/webhook — raw body for signature verification
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<any>,
  ) {
    const payload = req.rawBody;
    if (!payload) {
      throw new Error('No raw body available for webhook verification');
    }
    return this.stripeService.handleWebhookEvent(payload, signature);
  }
}
