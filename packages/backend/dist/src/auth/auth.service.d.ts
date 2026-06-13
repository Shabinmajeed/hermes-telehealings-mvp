import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { Role } from './roles.decorator';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private redisService;
    private readonly MAX_FAILED_LOGINS;
    private readonly LOCKOUT_DURATION_MS;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, redisService: RedisService);
    register(email: string, password: string, role?: Role): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    login(email: string, password: string, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, accessTokenJti?: string): Promise<{
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
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
    private generateTokens;
    private getTokenFingerprint;
}
