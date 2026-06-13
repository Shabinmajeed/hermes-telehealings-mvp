// src/stripe/stripe.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: any = null;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not configured — payment features disabled');
    }
  }

  isEnabled(): boolean {
    return this.stripe !== null;
  }

  getClient() {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY to enable payments.');
    }
    return this.stripe;
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    clientId: string;
    therapistId: string;
    sessionId?: string;
    idempotencyKey: string;
  }) {
    const { amount, currency, clientId, therapistId, sessionId, idempotencyKey } = params;

    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // cents
        currency: currency.toLowerCase(),
        metadata: {
          clientId,
          therapistId,
          sessionId: sessionId || '',
        },
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey },
    );

    // Create payment record in DB
    const payment = await this.prisma.payment.create({
      data: {
        clientId,
        therapistId,
        sessionId: sessionId || null,
        amount,
        currency,
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return {
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const statusMap: Record<string, string> = {
      succeeded: 'COMPLETED',
      processing: 'PENDING',
      requires_payment_method: 'FAILED',
      canceled: 'FAILED',
      requires_confirmation: 'PENDING',
      requires_action: 'PENDING',
      requires_capture: 'PENDING',
    };

    const paymentStatus = statusMap[paymentIntent.status] || 'PENDING';

    const payment = await this.prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: {
        status: paymentStatus as any,
        stripePaymentId: paymentIntent.latest_charge as string,
      },
    });

    return { paymentIntent, payment };
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    const params: any = {
      payment_intent: paymentIntentId,
    };
    if (amount) {
      params.amount = Math.round(amount * 100);
    }

    const refund = await this.stripe.refunds.create(params);

    await this.prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: 'REFUNDED' as any },
    });

    return refund;
  }

  async handleWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Webhook signature verification failed: ${message}`);
      throw new Error('Webhook signature verification failed');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as any);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as any);
        break;

      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as any);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true, type: event.type };
  }

  private async handlePaymentIntentSucceeded(paymentIntent: any) {
    await this.prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'COMPLETED' as any,
        stripePaymentId: paymentIntent.latest_charge as string,
      },
    });
    this.logger.log(`Payment succeeded for intent: ${paymentIntent.id}`);
  }

  private async handlePaymentIntentFailed(paymentIntent: any) {
    await this.prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' as any },
    });
    this.logger.log(`Payment failed for intent: ${paymentIntent.id}`);
  }

  private async handleChargeRefunded(charge: any) {
    if (charge.payment_intent) {
      await this.prisma.payment.updateMany({
        where: { stripePaymentIntentId: charge.payment_intent as string },
        data: { status: 'REFUNDED' as any },
      });
      this.logger.log(`Refund processed for intent: ${charge.payment_intent}`);
    }
  }
}
