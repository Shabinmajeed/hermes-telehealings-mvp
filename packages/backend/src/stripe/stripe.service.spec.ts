import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: string) => {
    const config: Record<string, string> = {
      STRIPE_SECRET_KEY: 'sk_test_123',
      STRIPE_WEBHOOK_SECRET: 'whsec_123',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
    };
    return config[key] || defaultValue;
  }),
};

const mockPrismaService = {
  payment: {
    create: jest.fn(),
    updateMany: jest.fn(),
  },
};

// Mock Stripe
const mockStripePaymentIntentsCreate = jest.fn();
const mockStripePaymentIntentsRetrieve = jest.fn();
const mockStripeRefundsCreate = jest.fn();
const mockStripeWebhooksConstructEvent = jest.fn();

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockStripePaymentIntentsCreate,
      retrieve: mockStripePaymentIntentsRetrieve,
    },
    refunds: {
      create: mockStripeRefundsCreate,
    },
    webhooks: {
      constructEvent: mockStripeWebhooksConstructEvent,
    },
  }));
});

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if STRIPE_SECRET_KEY is not configured', async () => {
      const badConfig = {
        get: jest.fn().mockReturnValue(undefined),
      };

      await expect(
        Test.createTestingModule({
          providers: [
            StripeService,
            { provide: ConfigService, useValue: badConfig },
            { provide: PrismaService, useValue: mockPrismaService },
          ],
        }).compile(),
      ).rejects.toThrow('STRIPE_SECRET_KEY is not configured');
    });
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent and DB record', async () => {
      mockStripePaymentIntentsCreate.mockResolvedValue({
        id: 'pi_123',
        client_secret: 'pi_123_secret',
        status: 'requires_payment_method',
      });

      mockPrismaService.payment.create.mockResolvedValue({
        id: 'pay-1',
        stripePaymentIntentId: 'pi_123',
        status: 'PENDING',
      });

      const result = await service.createPaymentIntent({
        amount: 50,
        currency: 'USD',
        clientId: 'client-1',
        therapistId: 'therapist-1',
        sessionId: 'session-1',
        idempotencyKey: 'idem-123',
      });

      expect(result.clientSecret).toBe('pi_123_secret');
      expect(result.payment.status).toBe('PENDING');
      expect(mockStripePaymentIntentsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 5000, // cents
          currency: 'usd',
        }),
        { idempotencyKey: 'idem-123' },
      );
    });

    it('should work without sessionId', async () => {
      mockStripePaymentIntentsCreate.mockResolvedValue({
        id: 'pi_456',
        client_secret: 'pi_456_secret',
        status: 'requires_payment_method',
      });

      mockPrismaService.payment.create.mockResolvedValue({
        id: 'pay-2',
        stripePaymentIntentId: 'pi_456',
      });

      const result = await service.createPaymentIntent({
        amount: 100,
        currency: 'EUR',
        clientId: 'client-1',
        therapistId: 'therapist-1',
        idempotencyKey: 'idem-456',
      });

      expect(result.clientSecret).toBe('pi_456_secret');
    });
  });

  describe('confirmPayment', () => {
    it('should confirm a payment with succeeded status', async () => {
      mockStripePaymentIntentsRetrieve.mockResolvedValue({
        id: 'pi_123',
        status: 'succeeded',
        latest_charge: 'ch_123',
      });

      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.confirmPayment('pi_123');

      expect(result.paymentIntent.status).toBe('succeeded');
      expect(mockPrismaService.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'COMPLETED' }),
        }),
      );
    });

    it('should map failed status correctly', async () => {
      mockStripePaymentIntentsRetrieve.mockResolvedValue({
        id: 'pi_123',
        status: 'requires_payment_method',
        latest_charge: null,
      });

      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      await service.confirmPayment('pi_123');

      expect(mockPrismaService.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
    });
  });

  describe('createRefund', () => {
    it('should create a full refund', async () => {
      mockStripeRefundsCreate.mockResolvedValue({ id: 're_123' });
      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.createRefund('pi_123');

      expect(result.id).toBe('re_123');
      expect(mockStripeRefundsCreate).toHaveBeenCalledWith({
        payment_intent: 'pi_123',
      });
      expect(mockPrismaService.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'REFUNDED' },
        }),
      );
    });

    it('should create a partial refund when amount is specified', async () => {
      mockStripeRefundsCreate.mockResolvedValue({ id: 're_456' });
      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      await service.createRefund('pi_123', 25);

      expect(mockStripeRefundsCreate).toHaveBeenCalledWith({
        payment_intent: 'pi_123',
        amount: 2500, // cents
      });
    });
  });

  describe('handleWebhookEvent', () => {
    it('should handle payment_intent.succeeded event', async () => {
      const event = {
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123', latest_charge: 'ch_123' } },
      };
      mockStripeWebhooksConstructEvent.mockReturnValue(event);
      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleWebhookEvent(
        Buffer.from('payload'),
        'sig_123',
      );

      expect(result.received).toBe(true);
      expect(result.type).toBe('payment_intent.succeeded');
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const event = {
        type: 'payment_intent.payment_failed',
        data: { object: { id: 'pi_123' } },
      };
      mockStripeWebhooksConstructEvent.mockReturnValue(event);
      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleWebhookEvent(
        Buffer.from('payload'),
        'sig_123',
      );

      expect(result.type).toBe('payment_intent.payment_failed');
    });

    it('should handle charge.refunded event', async () => {
      const event = {
        type: 'charge.refunded',
        data: { object: { payment_intent: 'pi_123' } },
      };
      mockStripeWebhooksConstructEvent.mockReturnValue(event);
      mockPrismaService.payment.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleWebhookEvent(
        Buffer.from('payload'),
        'sig_123',
      );

      expect(result.type).toBe('charge.refunded');
    });

    it('should throw on invalid webhook signature', async () => {
      mockStripeWebhooksConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(
        service.handleWebhookEvent(Buffer.from('payload'), 'bad_sig'),
      ).rejects.toThrow('Webhook signature verification failed');
    });
  });
});
