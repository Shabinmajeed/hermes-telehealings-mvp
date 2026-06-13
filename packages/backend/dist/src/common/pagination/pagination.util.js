"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
exports.buildPaginatedResult = buildPaginatedResult;
function encodeCursor(id) {
    return Buffer.from(id).toString('base64');
}
function decodeCursor(cursor) {
    return Buffer.from(cursor, 'base64').toString('utf-8');
}
function buildPaginatedResult(items, limit, total) {
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
//# sourceMappingURL=pagination.util.js.map