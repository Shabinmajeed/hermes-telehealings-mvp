# ============================================
# Mobile Web Dockerfile — Expo web export
# Stage 1: Install & build web export
# Stage 2: Serve with nginx
# ============================================

# ---- Stage 1: Builder ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy config files for dependency installation
COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY packages/mobile/package.json ./packages/mobile/
COPY shared/package.json ./shared/package.json

# Install dependencies
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts

# Copy source
COPY packages/mobile ./packages/mobile
COPY shared ./shared

# Build Expo web export
RUN cd packages/mobile && \
    npx expo export --platform web --output-dir dist

# ---- Stage 2: Serve with nginx ----
FROM nginx:1.27-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built web assets
COPY --from=builder /app/packages/mobile/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 3001; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /_expo/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    access_log /var/log/nginx/access.log; \
    error_log /var/log/nginx/error.log; \
}' > /etc/nginx/conf.d/app.conf

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
