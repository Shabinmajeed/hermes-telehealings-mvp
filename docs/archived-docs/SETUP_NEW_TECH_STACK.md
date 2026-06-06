# TeleHealings Soft Onboarding - Setup Guide (New Tech Stack)

## ✅ What We've Set Up

### Frontend (React Native + Expo)
**Location:** `/home/azureuser/telehealings-mobile`

Installed packages:
- ✓ React Native + Expo (v56)
- ✓ TypeScript configuration
- ✓ Zustand (state management store)
- ✓ AsyncStorage (local persistence)
- ✓ Reanimated (smooth animations)
- ✓ expo-linear-gradient (gradient backgrounds)
- ✓ React Native SVG (icons)
- ✓ Axios (HTTP client)
- ✓ Expo Router (file-based navigation)

Created files:
- ✓ `src/store/onboardingStore.ts` - Zustand store with persistence
- ✓ `src/types/onboarding.ts` - TypeScript interfaces & constants
- ✓ `src/styles/theme.ts` - Design tokens (colors, spacing, typography)
- ✓ `src/services/api.ts` - API client with interceptors
- ✓ `tsconfig.json` - Path aliases for clean imports

### Backend (NestJS)
**Location:** `/home/azureuser/telehealings-backend`

Installed packages:
- ✓ NestJS framework + decorators
- ✓ TypeScript
- ✓ Prisma ORM
- ✓ @nestjs/jwt (JWT authentication)
- ✓ @nestjs/passport (passport integration)
- ✓ @nestjs/swagger (API documentation)
- ✓ bcrypt (password hashing)
- ✓ class-validator & class-transformer (DTO validation)
- ✓ helmet (security headers)

Created files:
- ✓ `prisma/schema.prisma` - Database models (User, Onboarding, Admin, AuditLog)
- ✓ `.env.example` - Environment variables template

---

## 🚀 Next Steps

### Phase 1: Database Setup

1. **Set up Supabase PostgreSQL (Recommended)**
   ```bash
   # Create a project at https://supabase.com
   # Copy the DATABASE_URL from project settings
   ```

   Or **use local PostgreSQL**
   ```bash
   # Install PostgreSQL (if not already installed)
   # Create a database: createdb telehealings
   # Update DATABASE_URL in .env
   ```

2. **Configure Backend Environment**
   ```bash
   cd /home/azureuser/telehealings-backend
   cp .env.example .env
   
   # Edit .env and set:
   # DATABASE_URL=postgresql://user:password@localhost:5432/telehealings
   # JWT_SECRET=your-super-secret-key
   # STRIPE_SECRET_KEY=sk_test_...
   ```

3. **Run Prisma Migrations**
   ```bash
   cd /home/azureuser/telehealings-backend
   npx prisma migrate dev --name init
   ```

   This will:
   - Create the database tables
   - Generate Prisma client
   - Create a migration file

4. **Verify Database**
   ```bash
   npx prisma studio  # Opens GUI at http://localhost:5555
   ```

---

### Phase 2: Backend Development

1. **Create Onboarding Module**
   ```bash
   cd /home/azureuser/telehealings-backend
   npx nest generate module modules/onboarding
   npx nest generate controller modules/onboarding
   npx nest generate service modules/onboarding
   ```

2. **Create User Module**
   ```bash
   npx nest generate module modules/users
   npx nest generate controller modules/users
   npx nest generate service modules/users
   ```

3. **Create Auth Module**
   ```bash
   npx nest generate module modules/auth
   npx nest generate service modules/auth
   ```

4. **Implement Endpoints**
   - `POST /api/onboarding/submit` - Submit onboarding data
   - `GET /api/onboarding/:userId` - Fetch onboarding progress
   - `POST /api/users` - Create user
   - `GET /api/users/:id` - Get user details
   - `GET /api/health` - Health check

5. **Start Backend**
   ```bash
   cd /home/azureuser/telehealings-backend
   npm run start
   # Runs on http://localhost:3000
   ```

---

### Phase 3: Frontend Development

1. **Set up Expo Router Structure**
   ```
   app/
   ├── _layout.tsx              # Root navigation
   ├── index.tsx                # Splash/home
   └── (onboarding)/
       ├── _layout.tsx          # Onboarding stack
       ├── marketing.tsx         # Page 1
       ├── soft-onboarding.tsx  # Page 2
       ├── personalisation.tsx   # Page 3
       └── success.tsx           # Success screen
   ```

2. **Create Component Files**
   ```bash
   cd /home/azureuser/telehealings-mobile/src/components
   
   # Create components:
   # - HealiMascot.tsx
   # - OptionCard.tsx
   # - TermsModal.tsx
   # - InputField.tsx
   # - Button.tsx
   # - GradientHeader.tsx
   ```

3. **Create Screen Files**
   ```bash
   cd /home/azureuser/telehealings-mobile/src/screens
   
   # Create screens:
   # - MarketingScreen.tsx
   # - SoftOnboardingScreen.tsx
   # - PersonalisationScreen.tsx
   ```

4. **Wire Up Store & API**
   - Import `useOnboardingStore` from `@store/onboardingStore`
   - Import `apiService` from `@services/api`
   - Call store actions (setUserName, toggleFocusArea, etc.)
   - Submit to backend API via `apiService.submitOnboarding()`

5. **Add Animations with Reanimated**
   - Use `Animated.View` + `Animated.createAnimatedComponent`
   - Create `slideFadeUp` animation in `@utils/animations.ts`
   - Apply to components on mount

6. **Test on Simulator**
   ```bash
   cd /home/azureuser/telehealings-mobile
   npm run start
   
   # In Expo Go app:
   # - Press 'w' for web
   # - Press 'i' for iOS (macOS only)
   # - Press 'a' for Android
   ```

---

### Phase 4: Integration Testing

1. **Test Complete Flow**
   - Marketing page → Soft onboarding → Personalisation
   - Submit data to backend
   - Verify data in database
   - Check localStorage persistence

2. **Test Error Handling**
   - Network errors
   - Validation errors
   - API timeout

3. **Test on Physical Devices**
   - Build APK for Android testing
   - Build IPA for iOS testing (requires Mac)

---

## 📁 Project Structure Summary

```
/home/azureuser/
├── telehealings-mobile/          # React Native + Expo frontend
│   ├── app/                      # Expo Router (screens)
│   ├── src/
│   │   ├── components/           # Reusable React Native components
│   │   ├── screens/              # Screen components
│   │   ├── store/                # Zustand stores
│   │   ├── services/             # API client
│   │   ├── types/                # TypeScript interfaces
│   │   ├── styles/               # Design tokens
│   │   └── utils/                # Helper functions
│   ├── package.json
│   ├── app.json
│   └── tsconfig.json
│
├── telehealings-backend/         # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── onboarding/       # Onboarding feature
│   │   │   ├── users/            # User management
│   │   │   └── auth/             # Authentication
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma         # Database models
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── Telehealings/                 # Original design & docs
    ├── Design/
    ├── PROJECT_DETAILS.md
    └── images/
```

---

## 🔑 Key Technologies & Why

| Tech | Purpose | Why Chosen |
|------|---------|-----------|
| **React Native** | Cross-platform mobile | iOS + Android from single codebase |
| **Expo** | Development platform | Quick setup, no native build config |
| **TypeScript** | Type safety | Catch errors at compile time |
| **Zustand** | State management | Lightweight, easy to use, no boilerplate |
| **Reanimated** | Smooth animations | 60 FPS native animations |
| **NestJS** | Backend framework | Scalable, modular, enterprise-ready |
| **Prisma** | Database ORM | Type-safe, migrations, developer friendly |
| **Supabase** | Database + Auth | PostgreSQL + built-in auth + storage |
| **Passport/JWT** | Authentication | Industry standard token-based auth |
| **Swagger** | API documentation | Auto-generated from NestJS decorators |

---

## 🎯 Development Workflow

### Daily Workflow
```bash
# Terminal 1: Start backend
cd telehealings-backend
npm run start:dev

# Terminal 2: Start frontend
cd telehealings-mobile
npm run start

# Terminal 3: Prisma Studio (optional)
cd telehealings-backend
npx prisma studio
```

### Commit Message Format
```
feat: Add onboarding API endpoint
fix: Resolve animation jank on first load
docs: Update setup guide
refactor: Extract component logic
test: Add onboarding store tests
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Issue: "Cannot find module '@store/onboardingStore'"**
- Make sure path aliases are set in `tsconfig.json`
- Run `npm install` to regenerate node_modules

**Issue: "Reanimated worklets not found"**
- Clear cache: `npx expo prebuild --clean`
- Reinstall: `rm -rf node_modules && npm install`

### Backend Issues

**Issue: "DATABASE_URL not found"**
- Make sure `.env` file exists
- Copy from `.env.example` and fill in values

**Issue: "Prisma client not generated"**
- Run: `npx prisma generate`
- Then: `npx prisma migrate dev`

---

## 📚 Useful Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://react-native.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)

---

## ✨ What's Next After Setup?

1. ✅ Create NestJS modules and controllers
2. ✅ Implement onboarding API endpoints
3. ✅ Build React Native screens
4. ✅ Wire frontend to backend
5. ✅ Add Reanimated animations
6. ✅ Implement error handling & validation
7. ✅ Add unit & integration tests
8. ✅ Deploy backend (Railway)
9. ✅ Build & publish app (App Store, Play Store)

---

**Status:** Foundation setup complete ✓
**Next Action:** Follow Phase 1 (Database Setup) to continue
