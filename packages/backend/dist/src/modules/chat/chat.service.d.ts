import { PrismaService } from '../../common/prisma.service';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    saveMessage(sessionId: string, senderId: string, content: string): Promise<{
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
    getMessageHistory(sessionId: string, userId: string, limit?: number, offset?: number): Promise<{
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
    isSessionParticipant(sessionId: string, userId: string): Promise<boolean>;
}
