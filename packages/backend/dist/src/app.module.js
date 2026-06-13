"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./common/prisma.module");
const redis_module_1 = require("./common/redis.module");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const therapists_module_1 = require("./therapists/therapists.module");
const clients_module_1 = require("./clients/clients.module");
const sessions_module_1 = require("./sessions/sessions.module");
const bookings_module_1 = require("./bookings/bookings.module");
const payments_module_1 = require("./payments/payments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const mail_module_1 = require("./modules/mail/mail.module");
const chat_module_1 = require("./modules/chat/chat.module");
const stripe_module_1 = require("./stripe/stripe.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_logger_middleware_1.RequestLoggerMiddleware)
            .exclude('health/(.*)')
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: () => ({
                    throttlers: [
                        {
                            name: 'default',
                            ttl: 60000,
                            limit: 60,
                        },
                        {
                            name: 'auth',
                            ttl: 900000,
                            limit: 10,
                        },
                    ],
                    errorMessage: 'Too many requests. Please try again later.',
                }),
            }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            therapists_module_1.TherapistsModule,
            clients_module_1.ClientsModule,
            sessions_module_1.SessionsModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            stripe_module_1.StripeModule,
            notifications_module_1.NotificationsModule,
            mail_module_1.MailModule,
            chat_module_1.ChatModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map