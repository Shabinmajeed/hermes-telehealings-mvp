# TeleHealings Soft Onboarding - Tech Stack Migration Plan

## Current Stack (TO REMOVE)
- HTML5 + Vanilla CSS3 + Vanilla JavaScript
- Python http.server (local dev)
- No TypeScript
- No state management
- No backend

## Target Stack (FROM PROJECT_DETAILS.md)

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform & build tools
- **React** - UI library
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **Zustand** - State management
- **AsyncStorage** - Local data persistence
- **React Native SVG** - Custom SVG icons
- **Reanimated** - Smooth animations
- **expo-linear-gradient** - Gradient backgrounds

### Backend
- **NestJS** - Server framework
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Prisma** - ORM for PostgreSQL
- **Supabase** - PostgreSQL database + Auth + Storage
- **@nestjs/jwt** - JWT handling
- **passport-jwt** - JWT strategy
- **Stripe** - Payment processing (for future)

### Development
- **TypeScript** - Everywhere
- **ESLint + Prettier** - Code quality & formatting
- **Jest** - Testing framework
- **git** - Version control

---

## Migration Strategy

### Phase 1: Project Structure Setup
1. Initialize React Native + Expo project
2. Set up TypeScript configuration
3. Configure Zustand for state management
4. Set up NestJS backend
5. Configure Prisma with Supabase

### Phase 2: Backend API
1. Create NestJS controllers for onboarding
2. Set up Prisma models for User data
3. Implement authentication endpoints
4. Set up Supabase PostgreSQL connection

### Phase 3: Frontend Migration
1. Recreate pages as React Native screens
2. Integrate Zustand store for onboarding state
3. Wire up API calls to backend
4. Implement animations with Reanimated
5. Set up Expo Router navigation

### Phase 4: Integration & Testing
1. Test complete onboarding flow
2. Verify data persistence
3. Test on iOS/Android simulators
4. Performance optimization

---

## File Structure (New)

```
telehealings/
├── frontend/                      # React Native + Expo
│   ├── app.json                   # Expo config
│   ├── package.json
│   ├── tsconfig.json
│   ├── app/                       # Expo Router (file-based routing)
│   │   ├── _layout.tsx            # Root layout
│   │   ├── index.tsx              # Home/splash
│   │   └── (onboarding)/
│   │       ├── _layout.tsx
│   │       ├── marketing.tsx       # Marketing page
│   │       ├── soft-onboarding.tsx # Welcome & consent
│   │       ├── personalisation.tsx # Focus area selection
│   │       └── success.tsx         # Confirmation
│   ├── src/
│   │   ├── components/
│   │   │   ├── HealiMascot.tsx
│   │   │   ├── OptionCard.tsx
│   │   │   ├── TermsModal.tsx
│   │   │   └── ...
│   │   ├── screens/
│   │   │   ├── MarketingScreen.tsx
│   │   │   ├── SoftOnboardingScreen.tsx
│   │   │   ├── PersonalisationScreen.tsx
│   │   │   └── ...
│   │   ├── store/
│   │   │   └── onboardingStore.ts  # Zustand store
│   │   ├── services/
│   │   │   └── api.ts              # API client
│   │   ├── types/
│   │   │   └── onboarding.ts       # TypeScript interfaces
│   │   ├── styles/
│   │   │   ├── colors.ts           # Color tokens
│   │   │   ├── spacing.ts          # Spacing scale
│   │   │   └── typography.ts       # Font styles
│   │   └── utils/
│   │       └── animations.ts       # Reanimated animations
│   └── .env.example
│
├── backend/                        # NestJS
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── auth.guard.ts
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── user.entity.ts
│   │   │   ├── onboarding/
│   │   │   │   ├── onboarding.module.ts
│   │   │   │   ├── onboarding.controller.ts
│   │   │   │   ├── onboarding.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-onboarding.dto.ts
│   │   │   │       └── update-onboarding.dto.ts
│   │   │   └── health/
│   │   │       ├── health.module.ts
│   │   │       └── health.controller.ts
│   │   ├── prisma/
│   │   │   └── prisma.service.ts
│   │   └── config/
│   │       └── env.config.ts
│   ├── prisma/
│   │   ├── schema.prisma           # Data models
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── docker-compose.yml          # Supabase local dev (optional)
│
└── docs/
    ├── API_SPEC.md
    ├── DATABASE.md
    └── SETUP.md
```

---

## Key Dependencies to Install

### Frontend (React Native + Expo)
```bash
npm install react react-native expo expo-router
npm install typescript @types/react-native
npm install zustand @react-native-async-storage/async-storage
npm install react-native-reanimated expo-linear-gradient
npm install react-native-svg expo-constants
npm install axios                  # HTTP client
npm install react-native-toast-notifications  # Toast UI
```

### Backend (NestJS)
```bash
npm install @nestjs/common @nestjs/core @nestjs/jwt
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/swagger swagger-ui-express
npm install @nestjs/terminus
npm install @prisma/client prisma
npm install bcrypt class-validator class-transformer
npm install stripe dotenv
npm install helmet
npm install uuid
npm install socket.io            # Real-time communication
```

---

## Next Steps

1. **Initialize Backend** (NestJS + Prisma + Supabase)
   - Set up NestJS project
   - Configure Prisma schema
   - Create API endpoints for onboarding

2. **Initialize Frontend** (React Native + Expo)
   - Create Expo project with TypeScript
   - Set up Zustand store
   - Create Expo Router structure

3. **Migrate UI Components**
   - Convert HTML pages to React Native screens
   - Implement Reanimated animations
   - Connect to Zustand store

4. **API Integration**
   - Wire frontend to backend API
   - Implement error handling
   - Set up authentication flow

5. **Testing & Deployment**
   - Run on iOS/Android simulators
   - Deploy backend to Railway
   - Build and publish app

---

## Benefits of This Stack

| Feature | Benefit |
|---------|---------|
| **React Native + Expo** | Write once, run on iOS/Android + Web |
| **TypeScript** | Type safety, better IDE support, fewer runtime errors |
| **Zustand** | Lightweight state management, easy to learn |
| **NestJS** | Scalable, well-structured, enterprise-ready backend |
| **Prisma** | Type-safe database ORM, easy migrations |
| **Supabase** | PostgreSQL + Auth + Storage, fully managed |
| **Reanimated** | 60 FPS smooth animations on native platforms |

This aligns with the project's vision of building a professional, scalable telehealth platform.
