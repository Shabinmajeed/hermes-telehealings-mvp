// src/modules/chat/chat.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(sessionId: string, senderId: string, content: string) {
    // Verify session exists and user is a participant
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.clientId !== senderId && session.therapistId !== senderId) {
      throw new ForbiddenException('You are not a participant in this session');
    }

    return this.prisma.message.create({
      data: {
        sessionId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async getMessageHistory(sessionId: string, userId: string, limit = 50, offset = 0) {
    // Verify session exists and user is a participant
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.clientId !== userId && session.therapistId !== userId) {
      throw new ForbiddenException('You are not a participant in this session');
    }

    const messages = await this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const total = await this.prisma.message.count({
      where: { sessionId },
    });

    return { messages, total };
  }

  async isSessionParticipant(sessionId: string, userId: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) return false;
    return session.clientId === userId || session.therapistId === userId;
  }
}
