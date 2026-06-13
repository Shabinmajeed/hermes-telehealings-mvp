# 🏥 TeleHealings MVP - Monorepo

**Complete Telehealth Platform** | React Native Mobile + NestJS Backend + React Web Apps

> *Connecting users with therapists for accessible mental health care*

---

## 📋 Project Overview

**TeleHealings** is a multi-platform telehealth application enabling users to discover, book, and conduct therapy sessions with licensed therapists.

### Platform Support

| Platform | Technology | User Type | Status |
|----------|-----------|-----------|--------|
| **Mobile** | React Native + Expo | Patients/Users | ✅ Ready |
| **Backend** | NestJS + Prisma | API | ✅ Ready |
| **Therapist Web** | React + Vite | Therapists | ✅ Ready |
| **Admin Web** | React + Vite | Administrators | ✅ Ready |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js:** v22.22.3 or higher
- **npm:** v10.9.8 or higher
- **Git:** Configured with GitHub credentials
- **Supabase Account:** For PostgreSQL database (free tier)

### Installation

```bash
# Clone the monorepo
git clone https://github.com/Shabinmajeed/hermes-telehealings-mvp.git
cd hermes-telehealings-mvp

# Install all dependencies for all packages
npm install

# Or use the convenience script
npm run install-all
```

### Running Each Application

#### Backend (NestJS API)
```bash
npm run start:backend
# Runs on: http://localhost:3000
# Swagger Docs: http://localhost:3000/api/docs
```

#### Mobile (React Native)
```bash
npm run start:mobile
# Press 'w' for web preview
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

#### Therapist Web
```bash
npm run start:therapist
# Runs on: http://localhost:5173
```

#### Admin Web
```bash
npm run start:admin
# Runs on: http://localhost:5174
```

### Running All Applications (Development)
```bash
npm run dev
# Starts all packages in parallel
```

---

## 📁 Monorepo Structure

```
hermes-telehealings-mvp/
│
├── packages/
│   ├── backend/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── users/         # User profiles
│   │   │   │   ├── therapists/    # Therapist management
│   │   │   │   └── onboarding/    # User onboarding
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma       # Database schema
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   ├── mobile/                     # React Native Mobile App
│   │   ├── src/
│   │   │   ├── screens/           # User screens
│   │   │   ├── components/        # Reusable components
│   │   │   ├── store/             # Zustand stores
│   │   │   ├── services/          # API client
│   │   │   └── types/             # TypeScript types
│   │   ├── app/                    # Expo Router
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── app.json
│   │
│   ├── web-therapist/             # React Therapist App (port 5173)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tailwind.config.js
│   │
│   └── web-admin/                 # React Admin Dashboard (port 5174)
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── services/
│       │   ├── store/
│       │   └── App.tsx
│       ├── package.json
│       ├── tsconfig.json
│       └── tailwind.config.js
│
├── docs/                            # Documentation
│   ├── ARCHITECTURE.md             # System architecture
│   ├── API_SPECIFICATION.md        # API endpoints
│   ├── SETUP.md                    # Detailed setup guide
│   ├── DEPLOYMENT.md               # Production deployment
│   └── CONTRIBUTING.md             # Contribution guidelines
│
├── scripts/                         # Utility scripts
│   ├── setup.sh                    # Initial setup
│   ├── install-all.sh              # Install all packages
│   └── start-all.sh                # Start all services
│
├── .github/
│   └── workflows/                  # GitHub Actions CI/CD
│       ├── backend-ci.yml
│       ├── mobile-ci.yml
│       └── web-ci.yml
│
├── package.json                     # Root monorepo config
├── .gitignore
├── .env.example
└── README.md                        # This file
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   BACKEND TIER                          │
│         NestJS + Prisma + PostgreSQL                    │
│              (32 API Endpoints)                         │
└─────────────────────────────────────────────────────────┘
            ↙              ↓              ↘
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  MOBILE (Expo)   │ │THERAPIST(Web)│ │  ADMIN (Web)     │
│ React Native     │ │  React+Vite  │ │   React+Vite     │
│ TypeScript       │ │  Tailwind    │ │    Tailwind      │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

### Role-Based Architecture

- **Users (Mobile):** Browse therapists, book sessions, manage profile
- **Therapists (Web):** Manage availability, profile, credentials
- **Admins (Web):** Verify therapists, manage platform, analytics

---

## 🔐 Technology Stack

### Backend
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT + Refresh Tokens
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

### Mobile
- **Framework:** React Native
- **Build:** Expo
- **State:** Zustand
- **HTTP:** Axios
- **Navigation:** Expo Router
- **Language:** TypeScript

### Web Apps (Therapist & Admin)
- **Framework:** React
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP:** Axios
- **Forms:** React Hook Form
- **Language:** TypeScript

---

## 📊 Features (MVP Phase 2)

### Feature 1: Authentication (Backend)
- ✅ Phone OTP verification
- ✅ Email/password signup & login
- ✅ JWT token generation
- ✅ Refresh token rotation
- ✅ Password reset flow
- [ ] OAuth (Google, Apple)

### Feature 2: User Profiles
- ✅ Profile CRUD operations
- ✅ Avatar upload
- ✅ Therapy history
- [ ] AI recommendations

### Feature 3: Therapist Discovery
- ✅ Search & filter by specialty, language, price
- ✅ Therapist profiles & ratings
- ✅ Availability viewing
- ✅ Favorites system

### Feature 4: Therapist Registration
- ✅ Multi-step registration
- ✅ Credential uploads
- ✅ Verification status tracking
- [ ] Background checks

### Feature 5: Availability Management
- ✅ Weekly schedule setup
- ✅ Time slot management
- ✅ Blocked dates (time off)
- ✅ Calendar view

---

## 🔗 API Endpoints (32 Total)

### Authentication (7)
```
POST   /auth/phone/send-otp
POST   /auth/phone/verify-otp
POST   /auth/signup
POST   /auth/login
POST   /auth/refresh-token
POST   /auth/logout
POST   /auth/password-reset
```

### Users (5)
```
GET    /users/:id
PATCH  /users/:id
POST   /users/:id/avatar
GET    /users/:id/sessions
GET    /users/:id/recommendations
```

### Therapists (6)
```
GET    /therapists (with filters)
GET    /therapists/:id
GET    /therapists/:id/availability
GET    /therapists/:id/reviews
POST   /users/:id/favorites/:therapistId
GET    /users/:id/favorites
```

### Therapist Management (7)
```
POST   /therapists/register
GET    /therapists/:id
PATCH  /therapists/:id
POST   /therapists/:id/documents
GET    /therapists/:id/documents
GET    /therapists/:id/verification-status
```

### Availability (7)
```
POST   /therapists/:id/availability
GET    /therapists/:id/availability
PATCH  /therapists/:id/availability/:slotId
DELETE /therapists/:id/availability/:slotId
POST   /therapists/:id/blocked-dates
GET    /therapists/:id/blocked-dates
DELETE /therapists/:id/blocked-dates/:dateId
```

See [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) for detailed documentation.

---

## 🗄️ Database Schema

### Core Models
- **User** - App users (patients)
- **Therapist** - Healthcare providers
- **Onboarding** - User preference tracking
- **AuthToken** - JWT token lifecycle
- **OTP** - One-time passwords for verification

### Relations
- **UserFavorite** - Saved therapists
- **TherapistReview** - Ratings & feedback
- **TherapistAvailability** - Working hours
- **AppointmentSlot** - Bookable time slots
- **TherapySession** - Completed sessions

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for full schema.

---

## 🚀 Deployment

### Backend (NestJS)
Deploy to: Railway, Heroku, or AWS

```bash
npm run build --workspace=packages/backend
npm run start --workspace=packages/backend
```

### Mobile (Expo)
Publish to: App Store & Play Store

```bash
npm run build --workspace=packages/mobile
```

### Web Apps (React)
Deploy to: Vercel, Netlify, or AWS

```bash
npm run build --workspace=packages/web-therapist
npm run build --workspace=packages/web-admin
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & data flow |
| [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) | Endpoint documentation |
| [SETUP.md](docs/SETUP.md) | Detailed setup guide |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Development guidelines |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=packages/backend

# Coverage report
npm test -- --coverage
```

---

## 📦 Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=packages/backend
```

---

## 🔄 Development Workflow

1. **Create branch from `main`:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes across packages:**
   ```bash
   # Changes auto-compile due to TypeScript watch mode
   ```

3. **Test locally:**
   ```bash
   npm test
   npm run dev
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request on GitHub**

6. **Merge after review:**
   ```bash
   git checkout main
   git pull
   git merge feature/your-feature-name
   ```

---

## 🆘 Troubleshooting

### "Module not found" error
```bash
# Reinstall all dependencies
npm install
# Or for a specific package
npm install --workspace=packages/backend
```

### Port already in use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9
# Kill process on port 5173 (web)
lsof -ti:5173 | xargs kill -9
```

### Database connection errors
- Verify `DATABASE_URL` in `.env`
- Check Supabase connection
- Run migrations: `npx prisma migrate dev`

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/Shabinmajeed/hermes-telehealings-mvp/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Shabinmajeed/hermes-telehealings-mvp/discussions)
- **Email:** shabin@telehealings.com

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- Hermes Agent - AI-powered development automation
- Expo - React Native framework
- NestJS - Backend framework
- Tailwind CSS - Styling
- Prisma - ORM & Database tools

---

## 📈 Roadmap

- [x] Phase 1: Soft onboarding feature
- [x] Phase 2: Authentication & user discovery (Current)
- [ ] Phase 3: Appointment scheduling
- [ ] Phase 4: Video/audio sessions
- [ ] Phase 5: Payment integration
- [ ] Phase 6: Analytics dashboard
- [ ] Phase 7: AI chatbot (Heali)
- [ ] Phase 8: Production scaling

---

**Repository:** https://github.com/Shabinmajeed/hermes-telehealings-mvp

**Status:** 🚀 **Phase 2 - Ready for Development**

---

*Built with ❤️ for accessible mental healthcare*
