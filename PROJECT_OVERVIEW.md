# TeleHealings MVP — Project Overview

## 📁 Project Structure

```
Telehealings Project/
├── packages/                      # Main application packages
│   ├── backend/                   # NestJS REST API (port 3000)
│   ├── web-admin/                  # React Admin Dashboard (port 5174)
│   ├── web-therapist/              # React Therapist App (port 5173)
│   └── mobile/                     # Expo React Native App (port 3001)
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # System design & tech stack
│   ├── SETUP.md                   # Installation & quick start
│   ├── GITHUB_SETUP.md            # GitHub auth configuration
│   ├── DEVELOPMENT.md             # Development workflows
│   └── archived-docs/             # Legacy documentation
│
├── scripts/                       # Utility scripts
├── archive/                       # Old project versions (reference)
├── package.json                   # Root workspace config
├── package-lock.json              # Dependency lock file
└── README.md                      # Project README

```

---

## 📦 Four Applications (Monorepo)

### 1. **Backend (packages/backend/)**
- **Framework:** NestJS
- **Database:** Prisma + PostgreSQL
- **Port:** `http://localhost:3000`
- **API:** REST endpoints for all features
- **Key Modules:**
  - Auth (JWT + OTP + Google/Apple OAuth)
  - Users (Patient profiles)
  - Therapists (Therapist discovery & management)
  - Admin (Admin features)
  - Availability (Therapist scheduling)

### 2. **Admin Web (packages/web-admin/)**
- **Framework:** React 19 + Vite + TypeScript
- **UI:** Tailwind CSS
- **Port:** `http://localhost:5173`
- **Audience:** Platform administrators
- **Key Pages:**
  - Dashboard
  - Users Management
  - Therapists Management
  - Analytics

### 3. **Therapist Web (packages/web-therapist/)**
- **Framework:** React 19 + Vite + TypeScript
- **UI:** Tailwind CSS + Radix UI
- **Port:** `http://localhost:5173` (separate dev server)
- **Audience:** Therapists
- **Key Pages:**
  - Dashboard
  - Availability Management
  - Session History
  - Communications

### 4. **Mobile App (packages/mobile/)**
- **Framework:** Expo + React Native + TypeScript
- **Ports:** `http://localhost:8081` (Expo dev server)
- **Audience:** End users (patients)
- **Key Screens:**
  - Onboarding
  - Therapist Discovery
  - Booking
  - Session Management

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend (Web)** | React 19, Vite, TypeScript, Tailwind CSS |
| **Frontend (Mobile)** | Expo, React Native, TypeScript |
| **Backend** | NestJS, Express, TypeScript |
| **Database** | Prisma ORM, PostgreSQL |
| **Auth** | JWT, Passport, OAuth (Google/Apple) |
| **Package Manager** | npm workspaces |
| **Version Control** | Git |

---

## ⚡ Quick Start

### Install Dependencies
```bash
cd "Telehealings Project"
npm install
```

### Start All Services
```bash
npm run dev
```

Or start individually:
```bash
npm run dev --workspace=packages/backend   # Backend on :3000
npm run dev --workspace=packages/web-admin  # Admin on :5174
npm run dev --workspace=packages/web-therapist  # Therapist on :5173
npm run dev --workspace=packages/mobile   # Mobile on :8081
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 📋 Current Status

### ✅ Completed
- Backend structure (NestJS setup)
- Auth module (JWT + OTP + OAuth strategies)
- Admin module
- Prisma database setup
- Web app scaffolding (React + Tailwind)
- Mobile app scaffolding (Expo)
- Git integration

### 🔄 In Progress
- API endpoint implementation
- Frontend page development
- Database migrations
- Testing suite

### ⏳ Next Phase
- User authentication flow
- Therapist discovery UI
- Session booking system
- Payment integration
- Notifications system

---

## 📚 Documentation

- **[SETUP.md](./docs/SETUP.md)** — Installation guide & development environment setup
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System design, data models, API structure
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** — Development workflows, coding standards, debugging
- **[GITHUB_SETUP.md](./docs/GITHUB_SETUP.md)** — GitHub authentication & repository management

---

## 🌐 Local Development URLs

| Service | URL | Port |
|---------|-----|------|
| Backend API | `http://localhost:3000` | 3000 |
| Admin Web | `http://localhost:5173` | 5173 |
| Therapist Web | `http://localhost:5173` | 5173 (separate) |
| Mobile (Expo) | `http://localhost:8081` | 8081 |

---

## 📞 Support

For questions or issues:
1. Check the relevant documentation in `docs/`
2. Review archived projects in `archive/` for reference
3. Check git history for commit messages

---

## 🎯 Project Goals

TeleHealings MVP is designed to connect patients with therapists through:
- 📱 Mobile app for patient discovery & booking
- 💼 Web portal for therapist management
- 🛠️ Admin dashboard for platform operations
- 🔐 Secure authentication & authorization
- 📅 Real-time availability management
- 💳 Integrated payment system

---

**Last Updated:** June 6, 2026  
**Version:** Phase 2 MVP
