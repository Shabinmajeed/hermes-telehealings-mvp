// src/modules/chat/dto/join-room.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;
}
