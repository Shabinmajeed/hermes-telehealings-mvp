export declare const ROLES_KEY = "roles";
export declare enum Role {
    CLIENT = "CLIENT",
    THERAPIST = "THERAPIST",
    ADMIN = "ADMIN"
}
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
