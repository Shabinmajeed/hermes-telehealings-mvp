import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../../common/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockPrismaService = {
  session: {
    findUnique: jest.fn(),
  },
  message: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    jest.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should save a message when user is a participant', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      const mockMessage = {
        id: 'msg-1',
        sessionId: 'session-1',
        senderId: 'client-1',
        content: 'Hello!',
        sender: { id: 'client-1', email: 'c@test.com', role: 'CLIENT' },
      };
      mockPrismaService.message.create.mockResolvedValue(mockMessage);

      const result = await service.saveMessage('session-1', 'client-1', 'Hello!');

      expect(result).toEqual(mockMessage);
      expect(mockPrismaService.message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            sessionId: 'session-1',
            senderId: 'client-1',
            content: 'Hello!',
          },
        }),
      );
    });

    it('should throw NotFoundException if session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(
        service.saveMessage('nonexistent', 'user-1', 'Hello'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not a participant', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      await expect(
        service.saveMessage('session-1', 'outsider-1', 'Hello'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow therapist to send message', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      const mockMessage = {
        id: 'msg-2',
        sessionId: 'session-1',
        senderId: 'therapist-1',
        content: 'Hi there!',
        sender: { id: 'therapist-1', email: 't@test.com', role: 'THERAPIST' },
      };
      mockPrismaService.message.create.mockResolvedValue(mockMessage);

      const result = await service.saveMessage('session-1', 'therapist-1', 'Hi there!');

      expect(result).toEqual(mockMessage);
    });
  });

  describe('getMessageHistory', () => {
    it('should return message history for a participant', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      const messages = [
        { id: 'msg-1', content: 'Hello' },
        { id: 'msg-2', content: 'Hi!' },
      ];
      mockPrismaService.message.findMany.mockResolvedValue(messages);
      mockPrismaService.message.count.mockResolvedValue(2);

      const result = await service.getMessageHistory('session-1', 'client-1');

      expect(result.messages).toEqual(messages);
      expect(result.total).toBe(2);
    });

    it('should throw NotFoundException if session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(
        service.getMessageHistory('nonexistent', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not a participant', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      await expect(
        service.getMessageHistory('session-1', 'outsider-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should support pagination with limit and offset', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      mockPrismaService.message.findMany.mockResolvedValue([]);
      mockPrismaService.message.count.mockResolvedValue(0);

      await service.getMessageHistory('session-1', 'client-1', 10, 20);

      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 20,
        }),
      );
    });
  });

  describe('isSessionParticipant', () => {
    it('should return true if user is the client', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      const result = await service.isSessionParticipant('session-1', 'client-1');

      expect(result).toBe(true);
    });

    it('should return true if user is the therapist', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      const result = await service.isSessionParticipant('session-1', 'therapist-1');

      expect(result).toBe(true);
    });

    it('should return false if user is not a participant', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: 'session-1',
        clientId: 'client-1',
        therapistId: 'therapist-1',
      });

      const result = await service.isSessionParticipant('session-1', 'outsider-1');

      expect(result).toBe(false);
    });

    it('should return false if session does not exist', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      const result = await service.isSessionParticipant('nonexistent', 'user-1');

      expect(result).toBe(false);
    });
  });
});
