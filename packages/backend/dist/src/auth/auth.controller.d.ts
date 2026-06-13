import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    login(dto: LoginDto, ip: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(dto: RefreshDto, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    logoutAll(req: any): Promise<{
        message: string;
    }>;
    me(req: any): Promise<{
        clientProfile: {
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
        } | null;
        therapistProfile: {
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
        } | null;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
