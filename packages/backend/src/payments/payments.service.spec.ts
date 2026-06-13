import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

const mockPrismaService = {
  payment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

const mockRedisService = {
  getJson: jest.fn().mockResolvedValue(null),
  setJson: jest.fn().mockResolvedValue(undefined),
  deletePattern: jest.fn().mockResolvedValue(undefined),
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated payments', async () => {
      const payments = [
        { id: 'p-1', amount: 100, status: 'COMPLETED' },
        { id: 'p-2', amount: 200, status: 'PENDING' },
      ];
      mockPrismaService.payment.findMany.mockResolvedValue(payments);

      const result = await service.findAll({ limit: 20 });

      expect(result.data).toEqual(payments);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it('should filter by status when provided', async () => {
      mockPrismaService.payment.findMany.mockResolvedValue([]);

      await service.findAll({ status: 'COMPLETED' });

      expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'COMPLETED' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const payment = {
        id: 'p-1',
        amount: 100,
        client: { id: 'c-1' },
        session: { id: 's-1' },
      };
      mockPrismaService.payment.findUnique.mockResolvedValue(payment);

      const result = await service.findOne('p-1');

      expect(result).toEqual(payment);
    });
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const paymentData = {
        clientId: 'client-1',
        therapistId: 'therapist-1',
        amount: 100,
        currency: 'USD',
      };
      const created = { id: 'p-new', ...paymentData, status: 'PENDING' };
      mockPrismaService.payment.create.mockResolvedValue(created);

      const result = await service.create(paymentData);

      expect(result).toEqual(created);
    });
  });

  describe('updateStatus', () => {
    it('should update payment status', async () => {
      const updated = { id: 'p-1', status: 'COMPLETED' };
      mockPrismaService.payment.update.mockResolvedValue(updated);

      const result = await service.updateStatus('p-1', 'COMPLETED');

      expect(result).toEqual(updated);
      expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { status: 'COMPLETED' },
      });
    });
  });

  describe('processRefund', () => {
    it('should process a refund', async () => {
      const refunded = { id: 'p-1', status: 'REFUNDED' };
      mockPrismaService.payment.update.mockResolvedValue(refunded);

      const result = await service.processRefund('p-1');

      expect(result).toEqual(refunded);
      expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { status: 'REFUNDED' },
      });
    });
  });
});
