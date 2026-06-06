# TeleHealings MVP - Architecture

## System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                        │
│                 (NestJS + JWT + Rate Limit)                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                         │
│    ┌──────────────┬──────────────┬──────────────────────┐  │
│    │   Auth Svc   │  Users Svc   │  Therapists Svc     │  │
│    │ (7 endpoints)│ (5 endpoints)│   (13 endpoints)    │  │
│    └──────────────┴──────────────┴──────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│                  DATA PERSISTENCE TIER                       │
│         Prisma ORM → PostgreSQL (Supabase)                   │
│  (User, Therapist, Session, Availability, etc. Models)      │
└──────────────────────────────────────────────────────────────┘
```

## Frontend Applications

### Mobile App (React Native + Expo)
- **Screens:** Login, Profile, Therapist Discovery, Booking
- **State:** Zustand with AsyncStorage persistence
- **Communication:** Axios HTTP client
- **Navigation:** Expo Router file-based routing
- **Deployment:** Expo EAS to App Store & Play Store

### Therapist Web (React + Vite)
- **Pages:** Login, Registration, Profile, Availability
- **Features:** Document upload, Schedule management, Verification status
- **Styling:** Tailwind CSS
- **Communication:** Axios with interceptors
- **Deployment:** Vercel or AWS

### Admin Web (React + Vite)
- **Pages:** Login, Users, Therapists, Verification, Analytics
- **Features:** User management, Therapist approval, Dashboard
- **Styling:** Tailwind CSS
- **Communication:** Axios with interceptors
- **Deployment:** Vercel or AWS

## Backend Architecture

### Module Structure (NestJS)

```
backend/src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── send-otp.dto.ts
│   │       ├── verify-otp.dto.ts
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── therapists/
│   │   ├── therapists.controller.ts
│   │   ├── therapists.service.ts
│   │   ├── entities/
│   │   │   └── therapist.entity.ts
│   │   └── dto/
│   │       ├── create-therapist.dto.ts
│   │       ├── therapist-filter.dto.ts
│   │       └── availability.dto.ts
│   └── onboarding/
│       ├── onboarding.controller.ts
│       ├── onboarding.service.ts
│       ├── entities/
│       │   └── onboarding.entity.ts
│       └── dto/
│           └── complete-onboarding.dto.ts
│
├── guards/
├── pipes/
├── interceptors/
│   └── transform.interceptor.ts
├── filters/
│   └── http-exception.filter.ts
├── middlewares/
├── decorators/
├── utils/
└── app.module.ts
```

### Database Schema (Prisma)

#### User Management
```prisma
model User {
  id              String    @id @default(cuid())
  phone           String?   @unique
  email           String    @unique
  passwordHash    String
  phoneVerified   Boolean   @default(false)
  emailVerified   Boolean   @default(false)
  
  profile         UserProfile?
  sessions        TherapySession[]
  favorites       UserFavorite[]
  reviews         TherapistReview[]
  onboarding      Onboarding?
  authTokens      AuthToken[]
}

model UserProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name            String
  bio             String?
  avatar          String?   // URL to Supabase Storage
  theme           String    @default("light")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

#### Therapist Management
```prisma
model Therapist {
  id              String    @id @default(cuid())
  userId          String?   @unique
  
  name            String
  bio             String?
  avatar          String?
  specializations String[]  // JSON array
  languages       String[]  // JSON array
  hourlyRate      Float
  rating          Float     @default(0)
  reviewCount     Int       @default(0)
  
  availability    TherapistAvailability[]
  blockedDates    TherapistBlockedDate[]
  appointments    AppointmentSlot[]
  sessions        TherapySession[]
  reviews         TherapistReview[]
  documents       TherapistDocument[]
}

model TherapistAvailability {
  id              String    @id @default(cuid())
  therapistId     String
  therapist       Therapist @relation(fields: [therapistId], references: [id], onDelete: Cascade)
  
  dayOfWeek       Int       // 0-6 (Mon-Sun)
  startTime       String    // HH:mm format
  endTime         String
  slotDuration    Int       // minutes
  bufferTime      Int       // minutes
  
  @@unique([therapistId, dayOfWeek])
}
```

#### Authentication
```prisma
model AuthToken {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  refreshToken    String    @unique
  expiresAt       DateTime
  createdAt       DateTime  @default(now())
}

model OTP {
  id              String    @id @default(cuid())
  phone           String?
  email           String?
  code            String
  attempts        Int       @default(0)
  expiresAt       DateTime
  createdAt       DateTime  @default(now())
}
```

## Authentication Flow

### Phone OTP Flow
1. User initiates signup → POST `/auth/phone/send-otp`
2. Backend generates OTP, sends via SMS/email
3. User receives OTP in app → POST `/auth/phone/verify-otp`
4. Backend validates OTP, creates user account
5. Backend returns JWT token + refresh token
6. Client stores tokens in AsyncStorage (mobile) or localStorage (web)

### JWT + Refresh Token Flow
1. Access token (1 hour expiry) used for API requests
2. Refresh token (7 day expiry) used to get new access token
3. When access token expires, POST `/auth/refresh-token` with refresh token
4. Backend validates refresh token, issues new access + refresh tokens
5. If refresh token expired, user must login again

### Role-Based Access Control (RBAC)
```typescript
@UseGuards(JwtAuthGuard)
@SetMetadata('roles', ['user'])
getUserProfile() {
  // Only JWT-authenticated users with 'user' role can access
}

@UseGuards(JwtAuthGuard)
@SetMetadata('roles', ['therapist', 'admin'])
manageTherapist() {
  // Only therapists and admins can access
}
```

## API Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    // Response payload
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Deployment Architecture

### Development
```
Local Machine
├── Backend: localhost:3000
├── Mobile: localhost:8081 (Expo)
├── Therapist Web: localhost:5173
└── Admin Web: localhost:5174
```

### Production
```
┌─────────────────────┐
│  GitHub Repository  │ (source of truth)
└──────────┬──────────┘
           │
      (Git Push)
           ↓
┌─────────────────────┐      ┌──────────────────┐
│  GitHub Actions     │─────→│ Build & Test CI  │
│ (Automated Workflow)│      └──────────────────┘
└──────────┬──────────┘
           │ (if tests pass)
           ↓
      ┌────────────────────────────────┐
      │ Deploy to Production           │
      ├────────────────────────────────┤
      │ Backend: Railway/AWS           │
      │ Mobile: App Store & Play Store │
      │ Web: Vercel/AWS S3 + CloudFront│
      └────────────────────────────────┘
```

## Security Considerations

### Backend
- ✅ JWT tokens with short expiry (1 hour)
- ✅ Refresh token rotation
- ✅ HTTPS only (enforce in production)
- ✅ Rate limiting on auth endpoints
- ✅ Password hashing (bcrypt)
- ✅ Input validation (class-validator)
- ✅ CORS configuration

### Mobile
- ✅ Store tokens in secure storage (not localStorage)
- ✅ API key rotation
- ✅ SSL certificate pinning (optional)
- ✅ App signing & security

### Web Apps
- ✅ HTTPS only
- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options headers
- ✅ Token refresh on tab focus

## Performance Optimization

### Backend
- Database connection pooling
- Query optimization with Prisma select
- Caching (Redis optional)
- CDN for static assets
- Compression (gzip)

### Mobile
- Code splitting
- Lazy loading screens
- Image optimization
- Battery optimization

### Web Apps
- Code splitting
- Lazy loading routes
- Image optimization
- Minification & compression

## Monitoring & Logging

### Backend
- Application logging (Winston/Pino)
- Error tracking (Sentry)
- Performance monitoring (DataDog)
- Database query logging

### Frontend
- Error tracking (Sentry)
- Analytics (Google Analytics)
- User session tracking
- Performance monitoring

## Database Backup & Recovery

- Daily automated backups (Supabase)
- Point-in-time recovery enabled
- Quarterly full dump exports
- Disaster recovery plan documented
