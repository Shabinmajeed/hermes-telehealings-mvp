import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { RedisModule } from './common/redis.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TherapistsModule } from './therapists/therapists.module';
import { ClientsModule } from './clients/clients.module';
import { SessionsModule } from './sessions/sessions.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './modules/mail/mail.module';
import { ChatModule } from './modules/chat/chat.module';
import { StripeModule } from './stripe/stripe.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting: 60 requests per minute per IP (general), stricter for auth
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000, // 1 minute window
            limit: 60, // 60 requests per minute
          },
          {
            name: 'auth',
            ttl: 900000, // 15 minute window
            limit: 10, // 10 attempts per 15 minutes for auth endpoints
          },
        ],
        errorMessage: 'Too many requests. Please try again later.',
      }),
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    TherapistsModule,
    ClientsModule,
    SessionsModule,
    BookingsModule,
    PaymentsModule,
    StripeModule,
    NotificationsModule,
    MailModule,
    ChatModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude('health/(.*)')
      .forRoutes('*');
  }
}
