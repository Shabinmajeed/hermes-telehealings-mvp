import { ClientsService } from './clients.service';
import { CreateClientProfileDto } from './dto';
export declare class ClientsController {
    private clientsService;
    constructor(clientsService: ClientsService);
    findAll(): Promise<import("../common/pagination/pagination.dto").PaginatedResult<any>>;
    findOne(id: string): Promise<{} | null>;
    createProfile(req: any, data: CreateClientProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        address: string | null;
        emergencyContact: string | null;
        medicalHistory: string | null;
        avatar: string | null;
        userId: string;
    }>;
    updateProfile(req: any, data: CreateClientProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        dateOfBirth: Date | null;
        gender: string | null;
        address: string | null;
        emergencyContact: string | null;
        medicalHistory: string | null;
        avatar: string | null;
        userId: string;
    }>;
    getSessions(id: string): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        rating: number | null;
        scheduledAt: Date;
        duration: number;
        therapist: {
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    }[]>;
}
