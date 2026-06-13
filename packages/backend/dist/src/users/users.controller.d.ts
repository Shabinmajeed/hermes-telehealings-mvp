import { UsersService } from './users.service';
import { CursorPaginationDto } from '../common/pagination/pagination.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(pagination: CursorPaginationDto): Promise<import("../common/pagination/pagination.dto").PaginatedResult<any>>;
    findOne(id: string): Promise<{} | null>;
    update(id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
