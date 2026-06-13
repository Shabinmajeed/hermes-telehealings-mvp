// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { WsJwtGuard } from './ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3001',
      process.env.THERAPIST_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:5174',
    ],
    credentials: true,
  },
  namespace: '/chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // Track typing timeouts per socket
  private typingTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const user = client.data?.user;
    if (user) {
      this.logger.log(`Client connected: ${client.id} (user: ${user.id}, role: ${user.role})`);
    } else {
      this.logger.log(`Client connected: ${client.id} (unauthenticated)`);
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    this.logger.log(`Client disconnected: ${client.id} (user: ${user?.id ?? 'unknown'})`);

    // Clear any typing indicators
    const typingKey = `${client.id}:typing`;
    const timeout = this.typingTimeouts.get(typingKey);
    if (timeout) {
      clearTimeout(timeout);
      this.typingTimeouts.delete(typingKey);
    }

    // Notify rooms that user stopped typing
    if (user) {
      for (const room of client.rooms) {
        if (room !== client.id) {
          client.to(room).emit('typing', {
            userId: user.id,
            sessionId: room,
            isTyping: false,
          });
        }
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ) {
    const user = client.data?.user;
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const { sessionId } = data;

    // Verify user is a participant
    const isParticipant = await this.chatService.isSessionParticipant(sessionId, user.id);
    if (!isParticipant) {
      return { error: 'You are not a participant in this session' };
    }

    // Join the room
    const roomName = `session:${sessionId}`;
    await client.join(roomName);

    this.logger.log(`User ${user.id} joined room ${roomName}`);

    return { success: true, room: roomName };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ) {
    const user = client.data?.user;
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const { sessionId } = data;
    const roomName = `session:${sessionId}`;
    await client.leave(roomName);

    // Clear typing indicator
    const typingKey = `${client.id}:typing`;
    const timeout = this.typingTimeouts.get(typingKey);
    if (timeout) {
      clearTimeout(timeout);
      this.typingTimeouts.delete(typingKey);
    }

    this.server.to(roomName).emit('typing', {
      userId: user.id,
      sessionId: data.sessionId,
      isTyping: false,
    });

    this.logger.log(`User ${user.id} left room ${roomName}`);

    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    const user = client.data?.user;
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const { sessionId, content } = data;

    try {
      const message = await this.chatService.saveMessage(sessionId, user.id, content);

      const roomName = `session:${sessionId}`;

      // Broadcast to room (including sender for consistency)
      this.server.to(roomName).emit('newMessage', {
        id: message.id,
        sessionId: message.sessionId,
        senderId: message.senderId,
        senderEmail: message.sender.email,
        senderRole: message.sender.role,
        content: message.content,
        createdAt: message.createdAt,
      });

      // Clear typing indicator on message send
      const typingKey = `${client.id}:typing`;
      const timeout = this.typingTimeouts.get(typingKey);
      if (timeout) {
        clearTimeout(timeout);
        this.typingTimeouts.delete(typingKey);
      }

      this.server.to(roomName).emit('typing', {
        userId: user.id,
        sessionId,
        isTyping: false,
      });

      return { success: true, message };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; isTyping: boolean },
  ) {
    const user = client.data?.user;
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const { sessionId, isTyping } = data;
    const roomName = `session:${sessionId}`;

    // Verify user is in the room
    if (!client.rooms.has(roomName)) {
      return { error: 'You have not joined this room' };
    }

    // Broadcast typing indicator to room (excluding sender)
    client.to(roomName).emit('typing', {
      userId: user.id,
      sessionId,
      isTyping,
    });

    // Auto-clear typing indicator after 3 seconds
    const typingKey = `${client.id}:typing`;
    const existingTimeout = this.typingTimeouts.get(typingKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    if (isTyping) {
      const timeout = setTimeout(() => {
        this.typingTimeouts.delete(typingKey);
        client.to(roomName).emit('typing', {
          userId: user.id,
          sessionId,
          isTyping: false,
        });
      }, 3000);
      this.typingTimeouts.set(typingKey, timeout);
    }

    return { success: true };
  }

  @SubscribeMessage('getMessageHistory')
  async handleGetMessageHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; limit?: number; offset?: number },
  ) {
    const user = client.data?.user;
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const { sessionId, limit = 50, offset = 0 } = data;

    try {
      const result = await this.chatService.getMessageHistory(
        sessionId,
        user.id,
        limit,
        offset,
      );
      return { success: true, messages: result.messages, total: result.total };
    } catch (error) {
      return { error: error.message };
    }
  }
}
