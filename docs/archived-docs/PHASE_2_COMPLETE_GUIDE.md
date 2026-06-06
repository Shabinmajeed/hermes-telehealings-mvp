# TeleHealings - Phase 2: Next 5 Features
## Complete Setup Guide & Architecture

**Date:** June 5, 2026
**Status:** Ready for Implementation
**Phase:** 2 - Authentication & User Discovery

---

## 🎯 5 Features Overview

| # | Feature | Backend | Mobile | Web | Status |
|---|---------|---------|--------|-----|--------|
| 1 | Auth System | ✅ NestJS API | - | - | Ready |
| 2 | User Profile | ✅ API | ✅ React Native | - | Ready |
| 3 | Therapist Discovery | ✅ API | ✅ React Native | - | Ready |
| 4 | Therapist Registration | ✅ API | - | ✅ React (Therapist) | Ready |
| 5 | Availability Mgmt | ✅ API | - | ✅ React (Therapist) | Ready |

---

## 📁 Project Structure

```
/home/azureuser/
├── telehealings-mobile/          (Existing - Update)
│   ├── src/store/               (Zustand for auth)
│   ├── src/screens/             (Add new screens)
│   └── app/                     (Expo Router)
│
├── telehealings-backend/         (Existing - Extend)
│   ├── src/modules/
│   │   ├── auth/                (NEW - Create)
│   │   ├── users/               (NEW - Create)
│   │   ├── therapists/          (NEW - Create)
│   │   └── onboarding/          (Existing)
│   └── prisma/schema.prisma     (UPDATE)
│
├── telehealings-therapist/       (NEW - React web app)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── profile.tsx
│   │   │   └── availability.tsx
│   │   ├── components/
│   │   ├── services/api.ts
│   │   ├── store/auth.ts
│   │   └── App.tsx
│   └── package.json
│
└── telehealings-admin/           (NEW - React web app)
    ├── src/
    │   ├── pages/
    │   │   ├── login.tsx
    │   │   ├── users.tsx
    │   │   ├── therapists.tsx
    │   │   └── analytics.tsx
    │   ├── components/
    │   ├── services/api.ts
    │   ├── store/auth.ts
    │   └── App.tsx
    └── package.json
```

---

## 🔐 Feature 1: Complete Authentication System

### Scope
Phone OTP, Email/Password, JWT Tokens, OAuth prep, Password Reset

### Backend Implementation

**1. Create Auth Module**
```bash
npx nest generate module modules/auth
npx nest generate service modules/auth
npx nest generate controller modules/auth
```

**2. Prisma Schema Updates**
```prisma
model User {
  // ... existing fields
  phone: String @unique
  email: String @unique
  phoneVerified: Boolean @default(false)
  emailVerified: Boolean @default(false)
  passwordHash: String
  
  authTokens: AuthToken[]
  otps: OTP[]
}

model AuthToken {
  id: String @id @default(cuid())
  userId: String
  user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshToken: String @unique
  expiresAt: DateTime
  createdAt: DateTime @default(now())
}

model OTP {
  id: String @id @default(cuid())
  phone: String?
  email: String?
  code: String
  expiresAt: DateTime
  attempts: Int @default(0)
  createdAt: DateTime @default(now())
}
```

**3. Auth Endpoints**
```typescript
// DTOs
CreateOtpDto { phone: string }
VerifyOtpDto { phone: string; code: string }
SignupDto { email: string; password: string; name: string }
LoginDto { email: string; password: string }
RefreshTokenDto { refreshToken: string }

// Endpoints
POST   /auth/phone/send-otp       (public)
POST   /auth/phone/verify-otp     (public)
POST   /auth/signup               (public)
POST   /auth/login                (public)
POST   /auth/refresh-token        (public)
POST   /auth/logout               (auth required)
POST   /auth/password-reset       (public)
PATCH  /auth/password-reset/:token (public)
```

**4. Dependencies Needed**
```
@nestjs/jwt
passport-jwt
bcrypt
dotenv
class-validator
```

### Environment Variables
```
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=refresh-secret
JWT_REFRESH_EXPIRATION=7d

TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key
```

### Testing Strategy
- ✅ Unit tests for auth service
- ✅ Integration tests for endpoints
- ✅ OTP generation/validation
- ✅ JWT token lifecycle
- ✅ Password reset flow

---

## 👤 Feature 2: User Profile Management

### Backend Implementation

**1. Create Users Module**
```bash
npx nest generate module modules/users
npx nest generate service modules/users
npx nest generate controller modules/users
```

**2. Prisma Schema Updates**
```prisma
model User {
  // ... auth fields
  bio: String?
  avatar: String? // URL to Supabase storage
  theme: String @default("light")
  
  // Relations
  sessions: TherapySession[]
  favorites: UserFavorite[]
  reviews: TherapistReview[]
}

model UserFavorite {
  id: String @id @default(cuid())
  userId: String
  user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  createdAt: DateTime @default(now())
  
  @@unique([userId, therapistId])
}
```

**3. Endpoints**
```typescript
GET    /users/:id              (auth required)
PATCH  /users/:id              (auth required)
POST   /users/:id/avatar       (auth required) - upload
GET    /users/:id/sessions     (auth required)
GET    /users/:id/recommendations (auth required)
```

### Mobile Implementation (React Native)

**1. Screens to Create**
- `src/screens/ProfileScreen.tsx`
- `src/screens/EditProfileScreen.tsx`
- `src/screens/AvatarUploadScreen.tsx`

**2. Components**
- `src/components/ProfileHeader.tsx`
- `src/components/EditForm.tsx`
- `src/components/ImagePicker.tsx`

**3. Store Update**
- Extend `onboardingStore.ts` → rename to `userStore.ts`
- Add profile state (name, bio, avatar)
- Add profile actions (updateProfile, uploadAvatar)

---

## 🔍 Feature 3: Therapist Discovery

### Backend Implementation

**1. Create Therapists Module**
```bash
npx nest generate module modules/therapists
npx nest generate service modules/therapists
npx nest generate controller modules/therapists
```

**2. Prisma Schema**
```prisma
model Therapist {
  id: String @id @default(cuid())
  userId: String?
  user: User?
  
  name: String
  bio: String?
  avatar: String?
  specializations: String[]
  languages: String[]
  hourlyRate: Float
  rating: Float @default(0)
  reviewCount: Int @default(0)
  
  onboarding: Onboarding?
  availability: TherapistAvailability[]
  sessions: TherapySession[]
  reviews: TherapistReview[]
}

model TherapistReview {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  userId: String
  user: User @relation(fields: [userId], references: [id])
  
  rating: Int // 1-5
  comment: String?
  createdAt: DateTime @default(now())
}
```

**3. Endpoints**
```typescript
GET    /therapists                  (public) - list with filters
GET    /therapists/:id              (public) - detail
GET    /therapists/:id/availability (public)
GET    /therapists/:id/reviews      (public)
POST   /users/:id/favorites/:therapistId (auth required)
GET    /users/:id/favorites         (auth required)
DELETE /users/:id/favorites/:therapistId (auth required)
```

**4. Query Filters**
```typescript
// GET /therapists?specialization=anxiety&language=english&minRate=50&maxRate=200&page=1&limit=20
```

### Mobile Implementation

**1. Screens**
- `src/screens/TherapistListScreen.tsx`
- `src/screens/TherapistDetailScreen.tsx`
- `src/screens/FavoritesScreen.tsx`

**2. Components**
- `src/components/TherapistCard.tsx`
- `src/components/FilterBar.tsx`
- `src/components/RatingStars.tsx`
- `src/components/FavoriteButton.tsx`

---

## 💼 Feature 4: Therapist Registration & Profile

### Backend Implementation

**1. Therapist Registration**
```typescript
POST /therapists/register {
  email: string;
  password: string;
  name: string;
  specializations: string[];
  languages: string[];
  hourlyRate: number;
  licenseNumber: string;
}
```

**2. Prisma Schema**
```prisma
model TherapistSpecialization {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  name: String
  yearsOfExperience: Int?
}

model TherapistDocument {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  type: String // "license", "certification", "degree"
  url: String // Supabase storage URL
  uploadedAt: DateTime @default(now())
}

model TherapistVerification {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  status: String @default("pending") // pending, verified, rejected
  documents: String[] // required document types
  verifiedAt: DateTime?
  verifiedBy: String? // admin ID
}
```

**3. Endpoints**
```typescript
POST   /therapists/register      (public)
GET    /therapists/:id           (auth required - own profile)
PATCH  /therapists/:id           (auth required - own profile)
POST   /therapists/:id/documents (auth required) - upload
GET    /therapists/:id/documents (auth required) - list
GET    /therapists/:id/verification-status (auth required)
```

### Web Implementation (React - Therapist App)

**1. Pages**
- `src/pages/RegisterPage.tsx` - Multi-step form
- `src/pages/ProfilePage.tsx` - Edit profile
- `src/pages/DocumentsPage.tsx` - Upload credentials
- `src/pages/VerificationPage.tsx` - Check status

**2. Components**
- `src/components/RegistrationForm.tsx`
- `src/components/DocumentUpload.tsx`
- `src/components/SpecializationSelect.tsx`
- `src/components/VerificationStatus.tsx`

---

## 📅 Feature 5: Therapist Availability Management

### Backend Implementation

**1. Prisma Schema**
```prisma
model TherapistAvailability {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  
  dayOfWeek: Int // 0-6 (Mon-Sun)
  startTime: String // HH:mm (24h)
  endTime: String
  slotDuration: Int // minutes
  bufferTime: Int // minutes between sessions
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  @@unique([therapistId, dayOfWeek])
}

model TherapistBlockedDate {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  
  date: DateTime
  reason: String?
  
  createdAt: DateTime @default(now())
}

model AppointmentSlot {
  id: String @id @default(cuid())
  therapistId: String
  therapist: Therapist @relation(fields: [therapistId], references: [id])
  
  startTime: DateTime
  endTime: DateTime
  isAvailable: Boolean @default(true)
  
  createdAt: DateTime @default(now())
}
```

**2. Endpoints**
```typescript
POST   /therapists/:id/availability        (auth required) - set weekly schedule
GET    /therapists/:id/availability        (auth required)
PATCH  /therapists/:id/availability/:slotId (auth required)
DELETE /therapists/:id/availability/:slotId (auth required)
POST   /therapists/:id/blocked-dates       (auth required)
GET    /therapists/:id/blocked-dates       (auth required)
DELETE /therapists/:id/blocked-dates/:dateId (auth required)
GET    /therapists/:id/slots               (public) - available slots for booking
```

### Web Implementation (React - Therapist App)

**1. Pages**
- `src/pages/AvailabilityPage.tsx` - Calendar view
- `src/pages/WeeklySchedulePage.tsx` - Set recurring slots
- `src/pages/BlockedDatesPage.tsx` - Time off management

**2. Components**
- `src/components/CalendarView.tsx`
- `src/components/TimeSlotEditor.tsx`
- `src/components/BlockedDateForm.tsx`
- `src/components/AvailabilityToggle.tsx`

---

## 🏗️ Development Timeline

### Week 1: Backend
```
Day 1-2: Auth System
  - Create auth module
  - Implement OTP endpoints
  - Implement email/password auth
  - Create JWT middleware

Day 3: User Profiles
  - Create users module
  - Implement profile endpoints
  - Avatar upload to Supabase

Day 4: Therapist Discovery
  - Create therapists module
  - Implement search/filter
  - Add ratings & reviews

Day 5: Therapist Registration & Availability
  - Implement registration endpoints
  - Add document upload
  - Implement availability endpoints
  - Swagger documentation
  - Deployment prep
```

### Week 2: Frontend - Mobile
```
Day 1: Auth UI
  - Login screens
  - OTP verification
  - Password reset

Day 2-3: Profile & Discovery
  - Profile screens
  - Therapist list & filters
  - Therapist detail page

Day 4-5: Integration
  - Connect to backend API
  - Data persistence
  - Error handling
  - Testing
```

### Week 3: Frontend - Web (Therapist)
```
Day 1-2: Registration & Profile
  - Multi-step registration
  - Profile editor
  - Document upload

Day 3-4: Availability
  - Calendar view
  - Time slot editor
  - Blocked dates

Day 5: Integration & Testing
  - Connect to backend
  - End-to-end testing
  - Responsive design
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd telehealings-backend

# Create modules
npx nest generate module modules/auth
npx nest generate service modules/auth
npx nest generate controller modules/auth

npx nest generate module modules/users
npx nest generate service modules/users
npx nest generate controller modules/users

npx nest generate module modules/therapists
npx nest generate service modules/therapists
npx nest generate controller modules/therapists

# Update database
npx prisma migrate dev --name add_auth_features

# Start
npm run start:dev
```

### 2. Web Apps Already Created
```bash
# Therapist web app
cd telehealings-therapist
npm run dev

# Admin web app
cd telehealings-admin
npm run dev
```

### 3. Mobile App (Existing)
```bash
cd telehealings-mobile
npm run start
```

---

## 📚 API Documentation

Once backend is ready, Swagger will be available at:
```
http://localhost:3000/api/docs
```

---

## ✅ Success Checklist

### Backend
- [ ] Auth system fully tested
- [ ] All 7 auth endpoints working
- [ ] User profile endpoints working
- [ ] Therapist discovery endpoints working
- [ ] Registration & availability endpoints working
- [ ] JWT tokens issued correctly
- [ ] Refresh token logic working
- [ ] Password reset flow working
- [ ] Swagger docs complete
- [ ] Error handling consistent

### Mobile
- [ ] Login/signup screens functional
- [ ] Profile screen functional
- [ ] Therapist discovery working
- [ ] Filters working
- [ ] Favorites system working
- [ ] API calls successful
- [ ] Data persisting to AsyncStorage
- [ ] No console errors

### Therapist Web
- [ ] Login screen working
- [ ] Registration form (multi-step) working
- [ ] Profile editor functional
- [ ] Document upload working
- [ ] Availability calendar functional
- [ ] Time slot editor working
- [ ] Responsive design
- [ ] No console errors

### Admin Web
- [ ] Login screen working
- [ ] User list & search
- [ ] Therapist approval workflow
- [ ] Analytics dashboard
- [ ] Responsive design

---

## 📖 Kanban Tasks Created

✅ Feature 1: Complete Authentication System (Backend)
✅ Feature 2: User Profile Management (Backend + Mobile)
✅ Feature 3: Therapist Discovery (Backend + Mobile)
✅ Feature 4: Therapist Registration & Profile (Backend + Web)
✅ Feature 5: Therapist Availability Management (Backend + Web)

View tasks: `hermes kanban list`

---

## Next Actions

1. ✅ Review this document
2. ✅ Start with backend auth module
3. ✅ Run Prisma migrations
4. ✅ Implement auth endpoints
5. ✅ Test with Swagger
6. ✅ Build mobile UI
7. ✅ Build web apps
8. ✅ Integration testing
9. ✅ Deployment

---

**Status:** Ready for implementation 🚀
**Estimate:** 3 weeks for all 5 features
**Next Meeting:** Backend auth module kickoff
