import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('session/:sessionId/messages')
  async getMessageHistory(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const result = await this.chatService.getMessageHistory(
      sessionId,
      userId,
      limit,
      offset,
    );
    return {
      messages: result.messages,
      total: result.total,
    };
  }

  @Post('session/:sessionId/messages')
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const message = await this.chatService.saveMessage(
      sessionId,
      userId,
      body.content,
    );
    return message;
  }

  @Get('session/:sessionId/participants')
  async isSessionParticipant(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const chatService = this.chatService as any;
    if (chatService.isSessionParticipant) {
      const result = await chatService.isSessionParticipant(sessionId, userId);
      return { isParticipant: result };
    }
    return { isParticipant: true };
  }
}
