// src/common/pagination/pagination.util.ts
import { PaginatedResult } from './pagination.dto';

export function encodeCursor(id: string): string {
  return Buffer.from(id).toString('base64');
}

export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf-8');
}

export function buildPaginatedResult<T extends { id: string }>(
  items: T[],
  limit: number,
  total?: number,
): PaginatedResult<T> {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore && data.length > 0
    ? encodeCursor(data[data.length - 1].id)
    : null;

  return {
    data,
    nextCursor,
    hasMore,
    total,
  };
}
