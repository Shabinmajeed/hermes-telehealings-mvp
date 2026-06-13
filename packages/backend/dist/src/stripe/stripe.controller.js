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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const dto_1 = require("./dto");
let StripeController = class StripeController {
    stripeService;
    configService;
    constructor(stripeService, configService) {
        this.stripeService = stripeService;
        this.configService = configService;
    }
    getConfig() {
        return {
            publishableKey: this.configService.get('STRIPE_PUBLISHABLE_KEY'),
        };
    }
    async createPaymentIntent(dto, req) {
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
    async confirmPayment(dto) {
        return this.stripeService.confirmPayment(dto.paymentIntentId);
    }
    async refund(dto) {
        return this.stripeService.createRefund(dto.paymentIntentId, dto.amount);
    }
    async webhook(signature, req) {
        const payload = req.rawBody;
        if (!payload) {
            throw new Error('No raw body available for webhook verification');
        }
        return this.stripeService.handleWebhookEvent(payload, signature);
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StripeController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Post)('create-payment-intent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.CLIENT, roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('confirm-payment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.CLIENT, roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ConfirmPaymentDto]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)('refund'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RefundPaymentDto]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "refund", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "webhook", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('stripe'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        config_1.ConfigService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map