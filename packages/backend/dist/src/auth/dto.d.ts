import { Role } from '../auth/roles.decorator';
export declare class RegisterDto {
    email: string;
    password: string;
    role?: Role;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refreshToken: string;
}
