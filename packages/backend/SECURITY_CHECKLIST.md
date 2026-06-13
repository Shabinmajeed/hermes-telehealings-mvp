# TeleHealings Security Audit & Hardening Checklist

**Date:** 2026-06-11
**Auditor:** QA Engineer (OWL)
**Scope:** Backend (NestJS), Mobile (Expo), Therapist Web, Admin Web

---

## 1. NPM Audit & Dependencies

### Findings
- **[HIGH] nodemailer <=8.0.4** — Multiple vulnerabilities (DoS via addressparser, SMTP command injection, email routing confusion). Fix: upgrade to nodemailer >=8.0.11 (requires major version bump from 6.x to 8.x — needs testing).
- **[MODERATE] @expo/config-plugins, @expo/cli, @expo/metro-config, etc.** — 14 moderate vulnerabilities in Expo toolchain. Fix: upgrade Expo SDK (major version bump required).
- **[MODERATE] prisma 6.20.0-dev.1 - 7.9.0-dev.7** — Via @prisma/dev dependency. Fix: upgrade Prisma to stable release.
- **[MODERATE] @hono/node-server <1.19.13** — Path traversal via repeated slashes in serveStatic. Fix: upgrade @hono/node-server.
- **[MODERATE] uuid <11.1.1** — Missing buffer bounds check. Fix: upgrade uuid.

### Actions Taken
- Installed `helmet` and `@nestjs/throttler` packages.
- Installed `sanitize-html` and `@types/sanitize-html` packages.
- **Note:** nodemailer upgrade deferred — requires major version bump (6.x -> 8.x) with breaking API changes. Recommend scheduling for next sprint.

---

## 2. Security Headers (Helmet.js)

### Status: IMPLEMENTED

Added Helmet.js to `main.ts` with the following configuration:
- **Content-Security-Policy:** Restrictive CSP with `default-src 'self'`, no `unsafe-eval`, `frame-src 'none'`
- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`
- **X-Frame-Options:** `deny` (via `frameguard`)
- **X-Content-Type-Options:** `nosniff`
- **X-XSS-Filter:** Enabled
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Cross-Origin-Embedder-Policy:** `require-corp`
- **Cross-Origin-Opener-Policy:** `same-origin`
- **Cross-Origin-Resource-Policy:** `same-origin`
- **DNS-Prefetch-Control:** Disabled

---

## 3. CORS Whitelist

### Status: IMPLEMENTED

- CORS origins now explicitly filtered from environment variables (`CLIENT_URL`, `THERAPIST_URL`, `ADMIN_URL`).
- Fallback to localhost defaults only when no env vars are set (development mode).
- Explicit `methods` whitelist: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
- Explicit `allowedHeaders`: `Content-Type, Authorization, X-Requested-With, Accept`.
- `credentials: true` maintained for cookie/auth header support.
- `maxAge: 86400` for preflight caching.

---

## 4. Input Sanitization (XSS Prevention)

### Status: IMPLEMENTED

- Created `SanitizeInterceptor` — a global NestJS interceptor that strips HTML/script tags from all string values in:
  - Request body
  - Query parameters
  - Response body
- Uses regex-based sanitization to remove `<tags>`, `javascript:` URLs, event handlers (`onerror=`, etc.), and HTML entities.
- Applied globally via `app.useGlobalInterceptors(new SanitizeInterceptor())`.

---

## 5. JWT Implementation (Token Rotation & Revocation)

### Status: IMPLEMENTED

### Token Blacklist (Access Token Revocation)
- Added `RedisService.blacklistToken(jti, ttl)` — stores blacklisted JWT IDs with TTL matching token expiration.
- Added `RedisService.isTokenBlacklisted(jti)` — checked on every authenticated request via `JwtStrategy.validate()`.
- On logout, the access token's JTI is blacklisted in Redis.

### Refresh Token Rotation
- Refresh tokens are now rotated on every use (old token deleted, new pair issued).
- Added `RedisService.storeRefreshTokenFingerprint()` to track used refresh tokens.
- **Token theft detection:** If a previously-used refresh token is presented again, ALL sessions for that user are invalidated immediately.

### JWT ID (JTI) Claim
- All access tokens now include a unique `jti` (JWT ID) claim using `crypto.randomUUID()`.
- The `jti` is passed through the JWT strategy and checked against the blacklist on every request.

### New Endpoints
- `POST /api/auth/logout-all` — Invalidates all sessions for the current user.

---

## 6. Brute-Force Protection

### Status: IMPLEMENTED

### Rate Limiting (ThrottlerModule)
- **Global rate limit:** 60 requests per minute per IP.
- **Auth endpoints rate limit:** 10 attempts per 15 minutes per IP.
  - `POST /api/auth/login` — 10 attempts per 15 min
  - `POST /api/auth/register` — 5 attempts per 1 min
  - `POST /api/auth/refresh` — 10 attempts per 15 min

### Account Lockout (Application-Level)
- After 5 failed login attempts (tracked per email+IP in Redis), the account is locked for 15 minutes.
- Failed attempts counter resets on successful login.
- Lockout uses Redis with 15-minute TTL for automatic expiration.

### Account Status Check
- Login now checks if the user account is `SUSPENDED` and rejects authentication.

---

## 7. File Upload Security

### Status: HARDENED

### Existing Protections (Already in Place)
- MIME type whitelist: images (jpeg, png, gif, webp, svg) and documents (pdf, doc, docx, xls, xlsx, txt, csv).
- File size limit: 10MB.
- Unique filename generation with timestamp + random suffix.
- Virus scan hook (placeholder — needs production integration).

### New Protections Added
- **Path traversal prevention:** `serveFile` endpoint now validates filenames:
  - Rejects filenames containing `/`, `\`, or `..`.
  - Double-checks resolved path is within the upload directory using `path.resolve()` and `path.sep`.
- **Security headers on file responses:**
  - `X-Content-Type-Options: nosniff`
  - `Cache-Control: private, max-age=3600`

### Recommendations for Production
- Integrate ClamAV or cloud virus scanning service (currently a no-op placeholder).
- Consider storing uploads in object storage (S3/GCS) instead of local filesystem.
- Add content-type verification by file magic bytes (not just MIME type from client).

---

## 8. SQL Injection Prevention

### Status: SAFE (No Action Needed)

- All database queries use Prisma ORM with parameterized queries.
- No raw SQL queries found in the codebase.
- Prisma automatically escapes all user inputs in `findUnique`, `findMany`, `create`, `update`, `delete` operations.
- **Verification:** Searched for `$queryRaw` and `$executeRaw` — none found.

---

## 9. Role-Based Access Control (RBAC)

### Status: HARDENED

### RBAC Review Results

| Controller | Endpoint | Before | After |
|---|---|---|---|
| **Auth** | All endpoints | No rate limiting | Rate limited per endpoint |
| **Users** | All endpoints | ADM only | ADM only (unchanged) |
| **Therapists** | GET / | No role guard | CLIENT, THERAPIST, ADMIN |
| **Therapists** | GET /:id | No role guard | CLIENT, THERAPIST, ADMIN |
| **Therapists** | POST /profile | THERAPIST | THERAPIST (unchanged) |
| **Therapists** | PATCH /profile | THERAPIST | THERAPIST (unchanged) |
| **Therapists** | GET /:id/sessions | No role guard | CLIENT, THERAPIST, ADMIN |
| **Therapists** | GET /:id/availability | No role guard | CLIENT, THERAPIST, ADMIN |
| **Clients** | GET /:id | No role guard | ADMIN, THERAPIST, CLIENT |
| **Clients** | POST /profile | No role guard | CLIENT only |
| **Clients** | PATCH /profile | No role guard | CLIENT only |
| **Clients** | GET /:id/sessions | No role guard | ADMIN, THERAPIST, CLIENT |
| **Sessions** | GET / | No role guard | CLIENT, THERAPIST, ADMIN |
| **Sessions** | GET /:id | No role guard | CLIENT, THERAPIST, ADMIN |
| **Sessions** | PATCH /:id | No role guard | CLIENT, THERAPIST, ADMIN |
| **Sessions** | POST /:id/cancel | No role guard | CLIENT, THERAPIST, ADMIN |
| **Sessions** | POST /:id/complete | No role guard | THERAPIST, ADMIN |
| **Bookings** | All endpoints | No RolesGuard | RolesGuard + per-endpoint roles |
| **Payments** | All endpoints | RolesGuard (partial) | RolesGuard on all endpoints |
| **Notifications** | All endpoints | JWT only | JWT only (user-scoped) |
| **Chat** | All endpoints | JWT only | JWT only (user-scoped) |
| **Uploads** | All endpoints | JWT only | JWT only (user-scoped) |
| **Stripe** | webhook | No auth | No auth (Stripe signature verified) |
| **Stripe** | All other endpoints | RolesGuard | RolesGuard (unchanged) |

### Controllers Updated
- `therapists.controller.ts` — Added `@Roles` to 4 endpoints
- `clients.controller.ts` — Added `@Roles` to 4 endpoints
- `sessions.controller.ts` — Added `@Roles` to 5 endpoints
- `bookings.controller.ts` — Added `RolesGuard` + `@Roles` to 5 endpoints

---

## 10. Security Headers (CSP, HSTS, X-Frame-Options)

### Status: IMPLEMENTED (via Helmet.js — see Section 2)

All security headers are now configured:
- **CSP:** `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: https:`, `object-src 'none'`, `frame-src 'none'`
- **HSTS:** `max-age=31536000; includeSubDomains; preload`
- **X-Frame-Options:** `deny`
- **X-Content-Type-Options:** `nosniff`
- **X-XSS-Protection:** `1; mode=block`
- **Referrer-Policy:** `strict-origin-when-cross-origin`

---

## 11. Additional Security Measures

### Request Size Limiting
- Global JSON body limit: `1mb`
- Global URL-encoded body limit: `1mb`

### Error Message Suppression
- In production (`NODE_ENV=production`), validation error messages are disabled to prevent information leakage.

### WebSocket Security
- `WsJwtGuard` validates JWT tokens on WebSocket connections.
- Token extraction from auth header, query param, or handshake auth.
- User data attached to `client.data.user` for authorization in handlers.

---

## 12. Recommendations for Future Hardening

1. **nodemailer upgrade:** Upgrade from 6.x to 8.x to fix HIGH vulnerability (requires API migration).
2. **Expo SDK upgrade:** Upgrade to fix 14 moderate vulnerabilities in Expo toolchain.
3. **Virus scanning:** Integrate ClamAV or cloud service for file upload scanning.
4. **CSP nonce:** Implement nonce-based CSP for inline scripts if needed.
5. **Audit logging:** Add security audit log for auth events (login, logout, failed attempts, token revocation).
6. **2FA/MFA:** Consider adding two-factor authentication for therapist and admin accounts.
7. **Session management:** Add endpoint to list active sessions per user.
8. **Password policy:** Enforce stronger password requirements (uppercase, lowercase, number, special char).
9. **Security.txt:** Add `/.well-known/security.txt` for responsible disclosure.
10. **Dependency scanning:** Set up automated dependency scanning in CI/CD pipeline.

---

## Test Results

- **TypeScript compilation:** PASS (no new errors introduced)
- **Unit tests:** 113 passed, 8 failed (all 8 failures are pre-existing pagination type mismatches)
- **Auth service tests:** 13/13 passed (including 1 new test for refresh token theft detection)
- **New tests added:** 1 (refresh token reuse detection)

---

## Files Changed

1. `packages/backend/src/main.ts` — Helmet, CORS hardening, request size limits, sanitize interceptor
2. `packages/backend/src/app.module.ts` — ThrottlerModule for rate limiting
3. `packages/backend/src/auth/auth.service.ts` — JWT revocation, brute-force protection, token rotation with theft detection
4. `packages/backend/src/auth/auth.controller.ts` — Rate limiting decorators, logout-all endpoint
5. `packages/backend/src/auth/jwt.strategy.ts` — Token blacklist check
6. `packages/backend/src/auth/auth.service.spec.ts` — Updated mocks for Redis, added theft detection test
7. `packages/backend/src/common/redis.service.ts` — Token blacklist, brute-force tracking, refresh token fingerprinting
8. `packages/backend/src/common/interceptors/sanitize.interceptor.ts` — NEW: XSS sanitization
9. `packages/backend/src/common/index.ts` — Export new modules
10. `packages/backend/src/uploads/uploads.controller.ts` — Path traversal prevention
11. `packages/backend/src/therapists/therapists.controller.ts` — RBAC hardening
12. `packages/backend/src/clients/clients.controller.ts` — RBAC hardening
13. `packages/backend/src/sessions/sessions.controller.ts` — RBAC hardening
14. `packages/backend/src/bookings/bookings.controller.ts` — RBAC hardening
