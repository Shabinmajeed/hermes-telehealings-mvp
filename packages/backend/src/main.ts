import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - allow frontend origins
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8081',
      'http://localhost:19006',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TeleHealings API')
    .setDescription('TeleHealings Telemedicine Platform API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addTag('Authentication', 'Auth endpoints (OTP, login, signup, refresh)')
    .addTag('Users', 'User profile management')
    .addTag('Therapists', 'Therapist search and discovery')
    .addTag('Therapist Registration', 'Therapist onboarding and verification')
    .addTag('Availability', 'Therapist scheduling and availability')
    .addTag('Admin', 'Admin management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('api/docs', app, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TeleHealings API Docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
================================================
  TeleHealings API Server Running
================================================
  Local:     http://localhost:${port}
  API Docs:  http://localhost:${port}/api/docs
  API Base:  http://localhost:${port}/api
================================================
  `);
}

bootstrap();
