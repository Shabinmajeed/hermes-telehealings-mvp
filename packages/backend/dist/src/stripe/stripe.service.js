"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../common/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = StripeService_1 = class StripeService {
    configService;
    prisma;
    stripe = null;
    logger = new common_1.Logger(StripeService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (secretKey) {
            this.stripe = new stripe_1.default(secretKey, {
                apiVersion: '2025-02-24.acacia',
            });
        }
        else {
            this.logger.warn('STRIPE_SECRET_KEY not configured — payment features disabled');
        }
    }
    isEnabled() {
        return this.stripe !== null;
    }
    getClient() {
        if (!this.stripe) {
            throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY to enable payments.');
        }
        return this.stripe;
    }
    async createPaymentIntent(params) {
        const { amount, currency, clientId, therapistId, sessionId, idempotencyKey } = params;
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            metadata: {
                clientId,
                therapistId,
                sessionId: sessionId || '',
            },
            automatic_payment_methods: { enabled: true },
        }, { idempotencyKey });
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
    async confirmPayment(paymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        const statusMap = {
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
                status: paymentStatus,
                stripePaymentId: paymentIntent.latest_charge,
            },
        });
        return { paymentIntent, payment };
    }
    async createRefund(paymentIntentId, amount) {
        const params = {
            payment_intent: paymentIntentId,
        };
        if (amount) {
            params.amount = Math.round(amount * 100);
        }
        const refund = await this.stripe.refunds.create(params);
        await this.prisma.payment.updateMany({
            where: { stripePaymentIntentId: paymentIntentId },
            data: { status: 'REFUNDED' },
        });
        return refund;
    }
    async handleWebhookEvent(payload, signature) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            this.logger.error(`Webhook signature verification failed: ${message}`);
            throw new Error('Webhook signature verification failed');
        }
        this.logger.log(`Processing webhook event: ${event.type}`);
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentIntentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await this.handleChargeRefunded(event.data.object);
                break;
            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
        return { received: true, type: event.type };
    }
    async handlePaymentIntentSucceeded(paymentIntent) {
        await this.prisma.payment.updateMany({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: {
                status: 'COMPLETED',
                stripePaymentId: paymentIntent.latest_charge,
            },
        });
        this.logger.log(`Payment succeeded for intent: ${paymentIntent.id}`);
    }
    async handlePaymentIntentFailed(paymentIntent) {
        await this.prisma.payment.updateMany({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: { status: 'FAILED' },
        });
        this.logger.log(`Payment failed for intent: ${paymentIntent.id}`);
    }
    async handleChargeRefunded(charge) {
        if (charge.payment_intent) {
            await this.prisma.payment.updateMany({
                where: { stripePaymentIntentId: charge.payment_intent },
                data: { status: 'REFUNDED' },
            });
            this.logger.log(`Refund processed for intent: ${charge.payment_intent}`);
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map