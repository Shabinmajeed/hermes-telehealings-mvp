import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto, CompleteSessionDto } from './dto';
export declare class SessionsController {
    private sessionsService;
    constructor(sessionsService: SessionsService);
    findAll(params: any): Promise<import("../common/pagination/pagination.dto").PaginatedResult<any>>;
    findOne(id: string): Promise<{}>;
    create(data: CreateSessionDto): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
    update(id: string, data: UpdateSessionDto): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
    cancel(id: string): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
    complete(id: string, body: CompleteSessionDto): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        notes: string | null;
        feedback: string | null;
    }>;
}
