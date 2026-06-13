export declare class CursorPaginationDto {
    cursor?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
    total?: number;
}
