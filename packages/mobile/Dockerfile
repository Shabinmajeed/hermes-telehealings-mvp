# ---- Stage 1: Install dependencies ----
FROM node:20-alpine AS mobile-deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/mobile/package.json ./packages/mobile/package.json
COPY shared/package.json ./shared/package.json

RUN npm ci

# ---- Stage 2: Build web export ----
FROM node:20-alpine AS mobile-build
WORKDIR /app

COPY --from=mobile-deps /app/node_modules ./node_modules
COPY --from=mobile-deps /app/package.json ./package.json
COPY --from=mobile-deps /app/package-lock.json ./package-lock.json

# Copy source
COPY packages/mobile/ ./packages/mobile/
COPY shared/ ./shared/
COPY tsconfig.json ./tsconfig.json

# Build shared first, then export web
RUN cd shared && npx tsc 2>/dev/null || true
RUN cd packages/mobile && npx expo export --platform web 2>/dev/null || npx expo export:web 2>/dev/null || echo "Trying alternative export..."

# ---- Stage 3: Serve with nginx ----
FROM nginx:alpine AS mobile-prod

# Copy built web assets
COPY --from=mobile-build /app/packages/mobile/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 3001; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /_expo/ { \
        root /usr/share/nginx/html; \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    location /assets/ { \
        root /usr/share/nginx/html; \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/ || exit 1

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
