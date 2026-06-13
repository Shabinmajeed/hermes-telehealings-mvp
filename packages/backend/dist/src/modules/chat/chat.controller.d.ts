import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMessageHistory(sessionId: string, limit: number | undefined, offset: number | undefined, req: any): Promise<{
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
    }>;
    sendMessage(sessionId: string, body: {
        content: string;
    }, req: any): Promise<{
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
    }>;
    isSessionParticipant(sessionId: string, req: any): Promise<{
        isParticipant: any;
    }>;
}
