# TeleHealings - Next 5 Features (Phase 2)
## Authentication & User Discovery

**Date:** June 5, 2026
**Status:** Planning & Setup
**Priority:** Phase 2 - Core Platform

---

## Architecture Confirmed

✅ **Backend:** One shared NestJS backend (serves all 3 platforms)
✅ **User App:** React Native/Expo (Mobile-only)
✅ **Therapist Web:** Separate React web app (to be created)
✅ **Admin Web:** Separate React web app (to be created)

---

## Next 5 Features to Build

### Feature 1: Complete Authentication System (Backend)
**Scope:** Phone OTP + Email/Password + OAuth prep
**Includes:**
- Phone OTP send/verify (Supabase Auth + Twilio)
- Email/password signup & login
- JWT token generation & refresh
- OAuth setup (Google, Apple) - config only
- Auth guards & middleware
- Password reset flow

**Endpoints:**
- POST /auth/phone/send-otp
- POST /auth/phone/verify-otp
- POST /auth/signup (email/password)
- POST /auth/login (email/password)
- POST /auth/refresh-token
- POST /auth/logout
- POST /auth/password-reset

**Database Changes:**
- Update User model (phone, email, passwordHash)
- Create AuthToken model (refresh tokens)
- Create OTP model (temporary OTP storage)

---

### Feature 2: User Profile Management (Backend + Mobile UI)
**Scope:** User profile creation, retrieval, updates
**Includes:**
- Create user profile on signup
- Get user profile
- Update profile (name, bio, avatar)
- Update focus areas
- Upload profile picture (to Supabase storage)
- Get therapy session history
- View therapy recommendations

**Endpoints:**
- GET /users/:id
- PATCH /users/:id
- POST /users/:id/avatar (upload)
- GET /users/:id/sessions
- GET /users/:id/recommendations

**Mobile Screens:**
- Profile screen (view & edit)
- Avatar selection/upload
- Edit preferences

---

### Feature 3: Therapist Discovery (Backend + Mobile UI)
**Scope:** Browse and search therapists
**Includes:**
- Get list of therapists (paginated)
- Search by name, specialization, language
- Filter by availability, rating, price
- Therapist detail page (bio, credentials, rates, reviews)
- Favorite/save therapist
- View therapist calendar availability

**Endpoints:**
- GET /therapists (with filters & pagination)
- GET /therapists/:id
- GET /therapists/:id/availability
- POST /users/:id/favorites/:therapistId
- GET /users/:id/favorites

**Mobile Screens:**
- Therapist list (with filters)
- Therapist detail page
- Favorites list

**Database Models:**
- Therapist model (if not already in Onboarding)
- Specialization model
- Therapist review model
- Favorite model

---

### Feature 4: Therapist Profile Setup (Backend + Web UI)
**Scope:** Therapist registration & profile management
**Includes:**
- Therapist signup flow
- Credential verification (documents upload)
- Bio and specializations
- Hourly rate setting
- Languages spoken
- License/certification info
- Profile picture upload
- Account status tracking

**Endpoints:**
- POST /therapists/register
- GET /therapists/:id (own profile)
- PATCH /therapists/:id (edit profile)
- POST /therapists/:id/documents (upload credentials)
- GET /therapists/:id/documents
- GET /therapists/:id/verification-status

**Therapist Web Screens:**
- Registration form (multi-step)
- Profile editor
- Document upload
- Verification status

**Database Models:**
- Therapist model (full details)
- TherapistSpecialization model
- TherapistDocument model (credentials)
- TherapistVerification model

---

### Feature 5: Therapist Availability Management (Backend + Web UI)
**Scope:** Set working hours and appointment slots
**Includes:**
- Set weekly working schedule (recurring)
- Add/remove specific time slots
- Block dates (time off)
- Manage appointment duration defaults
- Set buffer time between appointments
- Availability calendar view

**Endpoints:**
- POST /therapists/:id/availability (set schedule)
- GET /therapists/:id/availability
- PATCH /therapists/:id/availability/:slotId
- DELETE /therapists/:id/availability/:slotId
- POST /therapists/:id/blocked-dates
- GET /therapists/:id/blocked-dates

**Therapist Web Screens:**
- Availability calendar
- Time slot editor (weekly schedule)
- Blocked dates manager
- Quick availability toggle

**Database Models:**
- TherapistAvailability model (recurring slots)
- TherapistBlockedDate model (time off)
- AppointmentSlot model (available slots for booking)

---

## Development Order

```
Week 1: Backend Setup
  ✅ Day 1-2: Auth system (OTP, Email/Pass, JWT)
  ✅ Day 3: User profile endpoints
  ✅ Day 4: Therapist models & basic endpoints
  ✅ Day 5: Deployment & testing

Week 2: Mobile & Web UI
  ✅ Day 1-2: Mobile - Profile screens + Therapist discovery
  ✅ Day 3-4: Web - Therapist registration & profile
  ✅ Day 5: Web - Availability management

Week 3: Integration & Testing
  ✅ End-to-end testing
  ✅ Mobile device testing
  ✅ Web browser testing
  ✅ Production deployment
```

---

## Tech Stack Decision

### Frontend Web (Therapist + Admin)
Since we need 2 separate web apps quickly:

**Option A: React** (Recommended)
- ✅ Familiar with team
- ✅ Fast development
- ✅ Share components between therapist & admin
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ React Query for API calls
- ✅ TypeScript for type safety

**Option B: Next.js**
- ✅ Server-side rendering
- ✅ Built-in optimization
- ✅ File-based routing
- ⚠️ Slightly slower setup

**Recommendation:** Start with **React + Vite** (fast setup) + Tailwind CSS

---

## Kanban Board Plan

Will create tasks for:
1. ✅ Backend Auth System (1 epic, 7 subtasks)
2. ✅ Backend User Profiles (1 epic, 5 subtasks)
3. ✅ Backend Therapist Discovery (1 epic, 4 subtasks)
4. ✅ Therapist Web App - Registration (1 epic, 5 subtasks)
5. ✅ Therapist Web App - Availability (1 epic, 4 subtasks)

+ Mobile UI tasks (to be created after)

---

## Database Schema Changes

### New Models
- OTP
- AuthToken
- Therapist (expanded)
- TherapistSpecialization
- TherapistDocument
- TherapistVerification
- TherapistAvailability
- TherapistBlockedDate
- AppointmentSlot
- UserFavorite
- TherapistReview

### Schema Changes
- User: Add phone, passwordHash, verified status
- Onboarding: Link to User profile

---

## API Documentation Structure

Will create Swagger documentation for:
- Auth endpoints (public)
- User endpoints (user auth required)
- Therapist endpoints (therapist auth required)
- Admin endpoints (admin auth required)
- Public endpoints (therapist discovery - no auth)

---

## Success Criteria

✅ All backend endpoints tested
✅ Mobile screens functional
✅ Web apps responsive
✅ Data persistence working
✅ Auth flows secured
✅ API docs complete
✅ Zero console errors
✅ Cross-platform compatibility

---

## Next Actions

1. Confirm React vs Next.js for web apps
2. Create kanban tasks
3. Begin backend API development
4. Initialize Therapist web app (React + Vite)
5. Initialize Admin web app (React + Vite)

