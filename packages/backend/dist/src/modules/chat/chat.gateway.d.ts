import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private readonly logger;
    private typingTimeouts;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: JoinRoomDto): Promise<{
        error: string;
        success?: undefined;
        room?: undefined;
    } | {
        success: boolean;
        room: string;
        error?: undefined;
    }>;
    handleLeaveRoom(client: Socket, data: JoinRoomDto): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleSendMessage(client: Socket, data: SendMessageDto): Promise<{
        success: boolean;
        message: {
            sender: {
                id: string;
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            content: string;
            senderId: string;
        };
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        message?: undefined;
    }>;
    handleTyping(client: Socket, data: {
        sessionId: string;
        isTyping: boolean;
    }): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleGetMessageHistory(client: Socket, data: {
        sessionId: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        success: boolean;
        messages: ({
            sender: {
                id: string;
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sessionId: string;
            content: string;
            senderId: string;
        })[];
        total: number;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        messages?: undefined;
        total?: undefined;
    }>;
}
