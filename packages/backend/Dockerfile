# ============================================
# Backend Dockerfile — Optimized build
# Uses multi-stage with aggressive caching
# ============================================

# ---- Stage 1: Builder ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy lock file first for better cache utilization
COPY package-lock.json* pnpm-lock.yaml* ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/backend/prisma ./packages/backend/prisma/
COPY shared/package.json ./shared/package.json
COPY package.json ./

# Install dependencies (this layer is cached unless lock file changes)
RUN npm ci --ignore-scripts --prefer-offline 2>/dev/null || npm install --ignore-scripts --prefer-offline

# Copy source
COPY packages/backend ./packages/backend
COPY shared ./shared

# Build
RUN cd packages/backend && \
    npx prisma generate && \
    npm run build

# ---- Stage 2: Production ----
FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared

RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5172

# Simple health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5172/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "packages/backend/dist/src/main"]
