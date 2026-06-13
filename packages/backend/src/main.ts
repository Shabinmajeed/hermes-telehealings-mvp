import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import * as express from 'express';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor';

function setupSecurity(app: INestApplication) {
  // Raw body for Stripe webhook verification
  app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

  // Compression middleware — gzip responses > 1KB
  app.use(
    compression({
      threshold: 1024,
      level: 6,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      },
    }),
  );

  // Helmet security headers (CSP, HSTS, X-Frame-Options, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-origin' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );

  // CORS whitelist — only known origins, no wildcard
  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.THERAPIST_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean);

  const corsOrigins =
    allowedOrigins.length > 0
      ? allowedOrigins
      : [
          'http://localhost:3001',
          'http://localhost:5173',
          'http://localhost:5174',
        ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    maxAge: 86400,
  });

  app.setGlobalPrefix('api');

  // Global request size limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Global validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Global XSS sanitization interceptor
  app.useGlobalInterceptors(new SanitizeInterceptor());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSecurity(app);

  const port = process.env.PORT || 5172;
  await app.listen(port);
  console.log(`TeleHealings API running on http://localhost:${port}/api`);
}
bootstrap();
