# ============================================
# Therapist Web Dockerfile — Vite build + nginx
# Stage 1: Install & build
# Stage 2: Serve with nginx
# ============================================

# ---- Stage 1: Builder ----
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5172
ARG VITE_WS_URL=ws://localhost:5172/chat

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

# Copy config files
COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY packages/web-therapist/package.json ./packages/web-therapist/
COPY shared/package.json ./shared/package.json

# Install dependencies
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts

# Copy source
COPY packages/web-therapist ./packages/web-therapist
COPY shared ./shared

# Build
RUN cd packages/web-therapist && npm run build

# ---- Stage 2: Serve with nginx ----
FROM nginx:1.27-alpine AS production

# Copy built assets
COPY --from=builder /app/packages/web-therapist/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml; \
    access_log /var/log/nginx/access.log; \
    error_log /var/log/nginx/error.log; \
}' > /etc/nginx/conf.d/app.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
