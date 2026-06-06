import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Telehealings API')
    .setDescription('Telehealings Telehealth Platform API Documentation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Therapists', 'Therapist management endpoints')
    .addTag('Appointments', 'Appointment management endpoints')
    .addTag('Sessions', 'Session management endpoints')
    .addTag('Payments', 'Payment endpoints')
    .addTag('Admin', 'Admin endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application running on port ${PORT}`);
  console.log(`Swagger API docs available at http://localhost:${PORT}/api`);
}

bootstrap();
