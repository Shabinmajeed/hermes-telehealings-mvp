import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(params: any): Promise<import("../common/pagination/pagination.dto").PaginatedResult<any>>;
    findOne(id: string): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    } | null>;
    create(data: CreateBookingDto): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    }>;
    updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    }>;
    cancel(id: string): Promise<{
        id: string;
        therapistId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        scheduledAt: Date;
        sessionType: import("@prisma/client").$Enums.SessionType;
    }>;
}
