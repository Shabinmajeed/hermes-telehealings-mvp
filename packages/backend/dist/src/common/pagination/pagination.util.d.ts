import { PaginatedResult } from './pagination.dto';
export declare function encodeCursor(id: string): string;
export declare function decodeCursor(cursor: string): string;
export declare function buildPaginatedResult<T extends {
    id: string;
}>(items: T[], limit: number, total?: number): PaginatedResult<T>;
