# Installation & Development Setup Guide

## 📋 Overview

This guide will walk you through setting up the **Telehealings** development environment from scratch. Follow each step carefully.

**Estimated Setup Time**: 30-45 minutes

## 🔧 Step 1: System Requirements

### Minimum Requirements
- Node.js: v18.0.0+
- npm: v9.0.0+
- PostgreSQL: v13+ (or Docker)
- RAM: 4GB
- Disk Space: 2GB free

### Check Your Versions
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

### Not Installed?
- **Node.js**: Download from https://nodejs.org (LTS version recommended)
- **PostgreSQL**: Download from https://www.postgresql.org/download
- **Docker** (Alternative): Download from https://www.docker.com/products/docker-desktop

---

## 📦 Step 2: Clone/Navigate to Project

```bash
# Navigate to project directory
cd /path/to/Telehealings

# Verify you're in the right place
ls -la
# Should show: backend/, frontend/, Design/, PROJECT_DETAILS.md, README.md, etc.
```

---

## 🗄️ Step 3: Database Setup

### Option A: PostgreSQL Locally

1. **Start PostgreSQL**
```bash
# macOS (Homebrew)
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Use PostgreSQL installer or start from Windows Services
```

2. **Create Database & User**
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE USER telehealings WITH PASSWORD 'telehealings123';
CREATE DATABASE telehealings OWNER telehealings;
GRANT ALL PRIVILEGES ON DATABASE telehealings TO telehealings;
\q
```

3. **Test Connection**
```bash
psql -h localhost -U telehealings -d telehealings
# Should connect successfully
```

### Option B: Docker (Recommended)

```bash
# Start PostgreSQL + Redis containers
docker-compose up -d

# Verify containers are running
docker ps

# Check PostgreSQL health
docker exec telehealings-postgres pg_isready -U telehealings
```

---

## 🚀 Step 4: Backend Setup

### 4.1 Install Dependencies
```bash
cd /path/to/Telehealings
npm install -w backend

# Or from backend directory:
cd backend
npm install
```

✅ Should complete without errors. You'll have `backend/node_modules/`

### 4.2 Create Environment File
```bash
cp backend/.env.example backend/.env
```

### 4.3 Configure Database URL

Edit `backend/.env`:

```bash
nano backend/.env
# or use your favorite editor (VSCode, Vim, etc.)
```

Update this line with your database credentials:
```env
DATABASE_URL="postgresql://telehealings:telehealings123@localhost:5432/telehealings"
```

**If using Docker, it's already correct.**

### 4.4 Generate Prisma Client
```bash
npm run db:generate -w backend
```

✅ Should create `backend/node_modules/.prisma/client/`

### 4.5 Run Database Migrations
```bash
npm run db:migrate -w backend
```

✅ Should create all tables in PostgreSQL

### 4.6 (Optional) Seed Admin User
```bash
npm run db:seed -w backend
```

Creates admin user:
- Username: `admin`
- Password: Check the seed script output

### 4.7 Verify Database

Open Prisma Studio:
```bash
npm run db:studio -w backend
```

✅ Opens http://localhost:5555 - you should see all tables

### 4.8 Complete Environment Configuration

Edit `backend/.env` and set all required variables:

```env
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database (already done above)
DATABASE_URL="postgresql://..."

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_here_min_32_chars

# Admin (from seeding)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=*** Stripe (optional, for payments)
STRIPE_SECRET_KEY=sk_test_your_test_key

# Frontend URL
FRONTEND_URL=http://localhost:8081
```

### 4.9 Start Backend
```bash
npm run start:dev -w backend
```

✅ You should see:
```
Application running on port 3000
Swagger API docs available at http://localhost:3000/api
```

**Keep this terminal open!**

---

## 📱 Step 5: Frontend Setup

### 5.1 Install Dependencies

In a **new terminal**:

```bash
cd /path/to/Telehealings
npm install -w frontend
```

✅ Should complete without errors

### 5.2 Create Environment File
```bash
cp frontend/.env.example frontend/.env
```

### 5.3 Configure Environment

Edit `frontend/.env`:

```env
# API Configuration - MUST match your backend
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_TIMEOUT=30000

# Feature Flags
EXPO_PUBLIC_ENABLE_DEBUG=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

**Important**: If backend is on a different port or IP, update `EXPO_PUBLIC_API_URL`

### 5.4 Start Frontend

```bash
npm start -w frontend
```

✅ You should see Expo CLI menu with options

### 5.5 Run on Device/Simulator

**Option A: Web Browser**
```
Press 'w' in Expo terminal
```
Opens http://localhost:8081

**Option B: iOS Simulator**
```
Press 'i' in Expo terminal
# Requires Xcode (macOS only)
```

**Option C: Android Emulator**
```
Press 'a' in Expo terminal
# Requires Android Studio
```

**Option D: Physical Device**
```
Download Expo Go app from App Store/Play Store
Scan QR code from Expo terminal
```

---

## ✅ Verification Checklist

### Backend Verification

1. **Server Running**
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

2. **API Docs**
Open browser: http://localhost:3000/api
Should see Swagger documentation

3. **Database**
```bash
npm run db:studio -w backend
# Should open Prisma Studio with tables
```

### Frontend Verification

1. **App Loads**
App should start without errors

2. **API Connection**
Check browser console/Expo logs
Should not see connection errors

3. **Navigation**
Should be able to navigate between screens

---

## 🔍 Troubleshooting

### Problem: "Port 3000 already in use"

```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 <PID>

# Or change port in backend/.env
PORT=3001
```

### Problem: "Cannot connect to database"

```bash
# Test connection manually
psql -h localhost -U telehealings -d telehealings

# Check DATABASE_URL format
# Should be: postgresql://username:password@host:port/database

# Verify PostgreSQL is running
pg_isready -h localhost -U telehealings
```

### Problem: "Module not found" errors

```bash
# Clean install
rm -rf backend/node_modules frontend/node_modules
npm install

# Regenerate Prisma
npm run db:generate -w backend
```

### Problem: "API Connection Failed"

```bash
# Verify API URL in frontend/.env
EXPO_PUBLIC_API_URL=http://localhost:3000

# Check backend is running
curl http://localhost:3000/api

# Check CORS configuration
# Should allow frontend URL origin
```

### Problem: TypeScript Errors

```bash
# Reinstall dependencies
npm install

# Generate types
npm run db:generate -w backend

# Rebuild
npm run build -w backend
```

### Docker Issues

```bash
# View logs
docker logs telehealings-postgres

# Restart containers
docker-compose restart

# Clean restart (removes data)
docker-compose down
docker-compose up -d
```

---

## 📚 What Gets Installed?

### Backend Files
```
backend/
├── src/
│   ├── main.ts                  # Entry point
│   ├── app.module.ts            # Root module
│   ├── prisma/                  # Database
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── auth/                    # Feature modules
│   ├── users/
│   ├── therapists/
│   ├── appointments/
│   ├── sessions/
│   ├── messages/
│   ├── payments/
│   └── admin/
├── prisma/
│   └── schema.prisma            # Database schema
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.json
├── prettier.config.json
├── .env                         # (created after setup)
└── .env.example
```

### Frontend Files
```
frontend/
├── src/
│   └── (app structure TBD)
├── app.json                     # Expo configuration
├── package.json
├── tsconfig.json
├── .env                         # (created after setup)
└── .env.example
```

### Root Files
```
/
├── package.json                 # Monorepo root
├── docker-compose.yml           # Database services
├── .gitignore
├── README.md
├── INSTALLATION_GUIDE.md        # This file
├── SETUP_CHECKLIST.md
├── PROJECT_DETAILS.md
└── Design/                      # UI mockups
```

---

## 🚀 Next Steps

1. **Review Documentation**
   - Read [PROJECT_DETAILS.md](./PROJECT_DETAILS.md) for full specifications
   - Check [Design files](./Design) for UI mockups

2. **Explore API**
   - Open http://localhost:3000/api
   - Try test endpoints

3. **Explore Code**
   - Backend structure: `backend/src/`
   - Frontend structure: `frontend/src/` (TBD)
   - Database schema: `backend/prisma/schema.prisma`

4. **Start Development**
   - Create feature branch: `git checkout -b feature/your-feature`
   - Implement features following [PROJECT_DETAILS.md](./PROJECT_DETAILS.md)
   - Follow code standards (see linting/formatting section)

5. **Run Tests**
   ```bash
   npm run test -w backend
   npm run lint -w backend
   npm run format -w backend
   ```

---

## 📞 Support

### Common Commands

```bash
# Start development (from root)
npm run dev                         # Starts both backend & frontend

# Start individually
npm run start:dev -w backend        # Backend only
npm run start -w frontend           # Frontend only

# Build for production
npm run build -w backend
npm run build -w frontend

# Code quality
npm run lint -w backend
npm run format -w backend
npm run type-check -w frontend

# Database
npm run db:studio -w backend        # Open Prisma Studio
npm run db:migrate -w backend       # Run migrations
npm run db:seed -w backend          # Seed data

# Docker
docker-compose up -d                # Start services
docker-compose down                 # Stop services
docker ps                           # View running containers
```

### Getting Help

1. **Check error messages carefully** - often describe the issue
2. **Review Troubleshooting section** above
3. **Check PROJECT_DETAILS.md** for specs
4. **Review code comments** in source files
5. **Google the error** - common issues usually have solutions

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Example | Required | Purpose |
|----------|---------|----------|---------|
| `NODE_ENV` | `development` | Yes | Environment |
| `PORT` | `3000` | Yes | Server port |
| `DATABASE_URL` | `postgresql://...` | Yes | Database connection |
| `JWT_SECRET` | `your-secret-key` | Yes | JWT signing |
| `ADMIN_USERNAME` | `admin` | Yes | Admin login |
| `ADMIN_PASSWORD` | `password` | Yes | Admin login |
| `STRIPE_SECRET_KEY` | `sk_test_...` | No | Payments |
| `FRONTEND_URL` | `http://localhost:8081` | Yes | CORS origin |

### Frontend (.env)

| Variable | Example | Required | Purpose |
|----------|---------|----------|---------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000` | Yes | Backend URL |
| `EXPO_PUBLIC_API_TIMEOUT` | `30000` | No | Request timeout |
| `EXPO_PUBLIC_ENABLE_DEBUG` | `true` | No | Debug mode |

---

**Version**: 0.1.0  
**Last Updated**: June 2026  
**Status**: Phase 1 - Core Infrastructure
