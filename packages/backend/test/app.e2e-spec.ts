import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * E2E Tests for Critical Flows
 *
 * Tests the full flow: registration -> login -> book session -> payment -> session completion
 *
 * NOTE: These tests use mocked Prisma and external services to avoid needing
 * a real database, Stripe account, or email server.
 */

// Mock Prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  refreshToken: {
    findFirst: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  session: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  booking: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  payment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  notification: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  clientProfile: {
    create: jest.fn(),
    update: jest.fn(),
  },
  therapistProfile: {
    create: jest.fn(),
    update: jest.fn(),
  },
  message: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  fileUpload: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  },
  emailLog: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

const mockConfig = {
  get: jest.fn((key: string, defaultValue?: string) => {
    const config: Record<string, string> = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRY: '15m',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_REFRESH_EXPIRY: '7d',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      STRIPE_SECRET_KEY: 'sk_test_123',
      STRIPE_WEBHOOK_SECRET: 'whsec_123',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: 'test@test.com',
      SMTP_PASS: 'password',
      MAIL_FROM: 'test@test.com',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '6379',
      APP_URL: 'http://localhost:3001',
    };
    return config[key] || defaultValue;
  }),
};

// Mock BullMQ to avoid Redis connection errors
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({}),
  })),
  Worker: jest.fn().mockImplementation(() => ({})),
  JobsOptions: {},
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_secret',
        status: 'requires_payment_method',
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
        latest_charge: 'ch_test_123',
      }),
    },
    refunds: {
      create: jest.fn().mockResolvedValue({ id: 're_test_123' }),
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_123', latest_charge: 'ch_test_123' } },
      }),
    },
  }));
});

describe('E2E: Critical Flows', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(ConfigService)
      .useValue(mockConfig)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    userId = 'test-user-' + Date.now();
    accessToken = jwtService.sign({
      sub: userId,
      email: 'test@example.com',
      role: 'CLIENT',
    });
  });

  describe('Registration -> Login Flow', () => {
    it('POST /auth/register - should register a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null); // no existing user
      mockPrisma.user.create.mockResolvedValueOnce({
        id: userId,
        email: 'newuser@example.com',
        password: 'hashed',
        role: 'CLIENT',
      });
      mockPrisma.refreshToken.create.mockResolvedValueOnce({ id: 'rt-1' });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'newuser@example.com', password: 'password123' })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
      expect(response.body.user).toHaveProperty('role', 'CLIENT');
    });

    it('POST /auth/register - should reject duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'existing',
        email: 'existing@example.com',
      });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'existing@example.com', password: 'password123' })
        .expect(409);
    });

    it('POST /auth/register - should reject invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });

    it('POST /auth/register - should reject short password', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'short' })
        .expect(400);
    });

    it('POST /auth/login - should login with valid credentials', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: userId,
        email: 'test@example.com',
        password: hashedPassword,
        role: 'CLIENT',
      });
      mockPrisma.refreshToken.create.mockResolvedValueOnce({ id: 'rt-1' });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('POST /auth/login - should reject invalid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
        .expect(401);
    });
  });

  describe('Auth Guards', () => {
    it('GET /auth/me - should return profile with valid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: userId,
        email: 'test@example.com',
        role: 'CLIENT',
        clientProfile: null,
        therapistProfile: null,
      });

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('GET /auth/me - should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('GET /auth/me - should reject with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Booking Flow', () => {
    it('POST /bookings - should create a booking', async () => {
      const bookingId = 'booking-1';
      mockPrisma.booking.create.mockResolvedValueOnce({
        id: bookingId,
        clientId: userId,
        therapistId: 'therapist-1',
        scheduledAt: new Date().toISOString(),
        sessionType: 'VIDEO',
        status: 'PENDING',
      });

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clientId: userId,
          therapistId: 'therapist-1',
          sessionType: 'VIDEO',
          scheduledAt: new Date().toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'PENDING');
    });

    it('GET /bookings - should list bookings', async () => {
      // Note: The controller uses @Body() for GET params (unusual pattern)
      // The service defaults skip/take when params is undefined
      mockPrisma.booking.findMany.mockResolvedValueOnce([
        { id: 'b-1', status: 'PENDING' },
      ]);

      // Send body with the GET request to match the controller's @Body() pattern
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /bookings/:id/cancel - should cancel a booking', async () => {
      mockPrisma.booking.update.mockResolvedValueOnce({
        id: 'b-1',
        status: 'CANCELLED',
      });

      const response = await request(app.getHttpServer())
        .post('/bookings/b-1/cancel')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('status', 'CANCELLED');
    });
  });

  describe('Session Flow', () => {
    it('POST /sessions - should create a session', async () => {
      const sessionId = 'session-1';
      mockPrisma.session.create.mockResolvedValueOnce({
        id: sessionId,
        clientId: userId,
        therapistId: 'therapist-1',
        scheduledAt: new Date().toISOString(),
        status: 'SCHEDULED',
      });

      const response = await request(app.getHttpServer())
        .post('/sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clientId: userId,
          therapistId: 'therapist-1',
          scheduledAt: new Date().toISOString(),
          duration: 60,
          type: 'VIDEO',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'SCHEDULED');
    });

    it('GET /sessions/:id - should get session details', async () => {
      mockPrisma.session.findUnique.mockResolvedValueOnce({
        id: 's-1',
        status: 'SCHEDULED',
        client: {},
        therapist: {},
        payment: null,
      });

      const response = await request(app.getHttpServer())
        .get('/sessions/s-1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', 's-1');
    });

    it('POST /sessions/:id/complete - should complete a session', async () => {
      mockPrisma.session.update.mockResolvedValueOnce({
        id: 's-1',
        status: 'COMPLETED',
        feedback: 'Great session',
        rating: 5,
      });

      const response = await request(app.getHttpServer())
        .post('/sessions/s-1/complete')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ feedback: 'Great session', rating: 5 })
        .expect(201);

      expect(response.body).toHaveProperty('status', 'COMPLETED');
    });
  });

  describe('Payment Flow', () => {
    it('GET /stripe/config - should return publishable key', async () => {
      const response = await request(app.getHttpServer())
        .get('/stripe/config')
        .expect(200);

      expect(response.body).toHaveProperty('publishableKey');
    });

    it('POST /payments - should create a payment', async () => {
      mockPrisma.payment.create.mockResolvedValueOnce({
        id: 'pay-1',
        clientId: userId,
        amount: 100,
        status: 'PENDING',
      });

      const response = await request(app.getHttpServer())
        .post('/payments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clientId: userId,
          therapistId: 'therapist-1',
          amount: 100,
          currency: 'USD',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'PENDING');
    });
  });

  describe('Notifications Flow', () => {
    it('GET /notifications - should return user notifications', async () => {
      mockPrisma.notification.findMany.mockResolvedValueOnce([
        { id: 'n-1', title: 'Booking confirmed', isRead: false },
      ]);

      const response = await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /notifications/unread-count - should return unread count', async () => {
      mockPrisma.notification.count.mockResolvedValueOnce(3);

      const response = await request(app.getHttpServer())
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('unreadCount', 3);
    });
  });

  describe('Role Guards', () => {
    it('GET /users - should require ADMIN role', async () => {
      // CLIENT role should be denied
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });

    it('GET /payments - should require ADMIN role', async () => {
      await request(app.getHttpServer())
        .get('/payments')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
