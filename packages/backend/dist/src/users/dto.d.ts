import { Role } from '../auth/roles.decorator';
export declare class CreateUserDto {
    email: string;
    password: string;
    role?: Role;
}
export declare class UpdateUserDto {
    status?: string;
}
