"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const join_room_dto_1 = require("./dto/join-room.dto");
const ws_jwt_guard_1 = require("./ws-jwt.guard");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    typingTimeouts = new Map();
    constructor(chatService) {
        this.chatService = chatService;
    }
    handleConnection(client) {
        const user = client.data?.user;
        if (user) {
            this.logger.log(`Client connected: ${client.id} (user: ${user.id}, role: ${user.role})`);
        }
        else {
            this.logger.log(`Client connected: ${client.id} (unauthenticated)`);
        }
    }
    handleDisconnect(client) {
        const user = client.data?.user;
        this.logger.log(`Client disconnected: ${client.id} (user: ${user?.id ?? 'unknown'})`);
        const typingKey = `${client.id}:typing`;
        const timeout = this.typingTimeouts.get(typingKey);
        if (timeout) {
            clearTimeout(timeout);
            this.typingTimeouts.delete(typingKey);
        }
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
    async handleJoinRoom(client, data) {
        const user = client.data?.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        const { sessionId } = data;
        const isParticipant = await this.chatService.isSessionParticipant(sessionId, user.id);
        if (!isParticipant) {
            return { error: 'You are not a participant in this session' };
        }
        const roomName = `session:${sessionId}`;
        await client.join(roomName);
        this.logger.log(`User ${user.id} joined room ${roomName}`);
        return { success: true, room: roomName };
    }
    async handleLeaveRoom(client, data) {
        const user = client.data?.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        const { sessionId } = data;
        const roomName = `session:${sessionId}`;
        await client.leave(roomName);
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
    async handleSendMessage(client, data) {
        const user = client.data?.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        const { sessionId, content } = data;
        try {
            const message = await this.chatService.saveMessage(sessionId, user.id, content);
            const roomName = `session:${sessionId}`;
            this.server.to(roomName).emit('newMessage', {
                id: message.id,
                sessionId: message.sessionId,
                senderId: message.senderId,
                senderEmail: message.sender.email,
                senderRole: message.sender.role,
                content: message.content,
                createdAt: message.createdAt,
            });
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
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async handleTyping(client, data) {
        const user = client.data?.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        const { sessionId, isTyping } = data;
        const roomName = `session:${sessionId}`;
        if (!client.rooms.has(roomName)) {
            return { error: 'You have not joined this room' };
        }
        client.to(roomName).emit('typing', {
            userId: user.id,
            sessionId,
            isTyping,
        });
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
    async handleGetMessageHistory(client, data) {
        const user = client.data?.user;
        if (!user) {
            return { error: 'Unauthorized' };
        }
        const { sessionId, limit = 50, offset = 0 } = data;
        try {
            const result = await this.chatService.getMessageHistory(sessionId, user.id, limit, offset);
            return { success: true, messages: result.messages, total: result.total };
        }
        catch (error) {
            return { error: error.message };
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        join_room_dto_1.JoinRoomDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        join_room_dto_1.JoinRoomDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getMessageHistory'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetMessageHistory", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [
                process.env.CLIENT_URL || 'http://localhost:3001',
                process.env.THERAPIST_URL || 'http://localhost:5173',
                process.env.ADMIN_URL || 'http://localhost:5174',
            ],
            credentials: true,
        },
        namespace: '/chat',
    }),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map