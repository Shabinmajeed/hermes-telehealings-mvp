import { TherapistsService } from './therapists.service';
import { CreateTherapistProfileDto } from './dto';
export declare class TherapistsController {
    private therapistsService;
    constructor(therapistsService: TherapistsService);
    findAll(params: any): Promise<import("../common/pagination/pagination.dto").PaginatedResult<any>>;
    findOne(id: string): Promise<{} | null>;
    createProfile(req: any, data: CreateTherapistProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        userId: string;
        specialization: string[];
        bio: string | null;
        licenseNumber: string | null;
        yearsExperience: number;
        rating: number;
        reviewCount: number;
        isVerified: boolean;
    }>;
    updateProfile(req: any, data: CreateTherapistProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        userId: string;
        specialization: string[];
        bio: string | null;
        licenseNumber: string | null;
        yearsExperience: number;
        rating: number;
        reviewCount: number;
        isVerified: boolean;
    }>;
    getSessions(id: string): Promise<{
        type: import("@prisma/client").$Enums.SessionType;
        id: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        client: {
            id: string;
            clientProfile: {
                firstName: string;
                lastName: string;
                avatar: string | null;
            } | null;
        };
        scheduledAt: Date;
        duration: number;
    }[]>;
    getAvailability(id: string): Promise<{
        therapistId: string;
        availability: never[];
    }>;
}
