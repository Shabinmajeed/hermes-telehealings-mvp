# Telehealings - Telehealth Platform

A comprehensive telehealth platform connecting users with licensed therapists for mental health services.

## Project Structure

```
telehealings/
├── backend/               # NestJS backend API
├── frontend/              # React Native mobile app
├── Design/                # UI/UX design files
├── docs/                  # Documentation
└── package.json           # Monorepo root
```

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v13 or higher (for database)
- **Git**: For version control

## Development Environment Setup

### Step 1: Install Node.js & npm

```bash
# Check versions
node --version  # Should be v18+
npm --version   # Should be v9+
```

### Step 2: Install Dependencies

From the root directory:

```bash
# Install all dependencies (backend + frontend)
npm install

# Or install specific workspace:
npm install -w backend
npm install -w frontend
```

### Step 3: Database Setup

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/telehealings

# Run migrations
npm run db:migrate

# (Optional) Seed database with admin user
npm run db:seed

# (Optional) Open Prisma Studio for database visualization
npm run db:studio
```

### Step 4: Configure Environment Variables

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Required variables:
- `NODE_ENV=development`
- `PORT=3000`
- `DATABASE_URL=postgresql://...`
- `JWT_SECRET=your-secret-key`
- `STRIPE_SECRET_KEY=sk_test_...`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=password`

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
```

Required variables:
- `EXPO_PUBLIC_API_URL=http://localhost:3000`
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`

### Step 5: Start Development Servers

#### Option A: Start Both (from root)
```bash
npm run dev
```

#### Option B: Start Backend Only
```bash
npm run dev:backend
# Runs on http://localhost:3000
# Swagger docs: http://localhost:3000/api
```

#### Option C: Start Frontend Only
```bash
npm run dev:frontend
# Choose platform: iOS (i), Android (a), or Web (w)
```

## Available Scripts

### Root Level
```bash
npm run dev              # Start both backend and frontend
npm run build            # Build both projects
npm run lint             # Lint both projects
npm run format           # Format code with Prettier
npm run test             # Run tests
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio
```

### Backend
```bash
npm run start:dev        # Start with hot reload
npm run build            # Build for production
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm test                 # Run Jest tests
```

### Frontend
```bash
npm start                # Start Expo dev server
npm run android          # Build for Android
npm run ios              # Build for iOS
npm run web              # Build for web
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
```

## Project Phases

### Phase 1: Core Infrastructure ✅ (Current)
- [x] Soft onboarding
- [x] Admin login
- [x] User CRUD APIs
- [x] Database schema

### Phase 2: Authentication & User Management
- [ ] Phone OTP verification
- [ ] Email/Password login
- [ ] OAuth (Google, Apple)
- [ ] Password reset flow

### Phase 3: Therapist Features
- [ ] Therapist registration
- [ ] Credential verification
- [ ] Profile management
- [ ] Availability scheduling

### Phase 4: Appointments & Scheduling
- [ ] Appointment booking
- [ ] Calendar integration
- [ ] Rescheduling/cancellation

### Phase 5: Video/Audio Sessions
- [ ] WebRTC video calling
- [ ] Audio-only sessions
- [ ] Chat-based sessions

### Phase 6: Real-time Messaging
- [ ] Socket.io implementation
- [ ] Message history
- [ ] File sharing

### Phase 7: Payments
- [ ] Stripe integration
- [ ] Payment processing
- [ ] Refunds & subscriptions

### Phase 8: AI Chatbot (Heali)
- [ ] Conversational AI
- [ ] Mood tracking
- [ ] Journaling

### Phase 9: Admin Features
- [ ] Analytics dashboard
- [ ] Financial reports
- [ ] Platform settings

### Phase 10: Deployment & DevOps
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring

## Database

### Tech Stack
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Prisma Migrate

### Key Models
- Users (patients, therapists, admins)
- Therapist profiles & verification
- Appointments & sessions
- Conversations & messages
- Payments & subscriptions
- Reviews & ratings

### Create New Migration
```bash
# After schema changes
npm run -w backend prisma migrate dev --name migration_name
```

## API Documentation

Once the backend is running, access Swagger UI:
- **URL**: http://localhost:3000/api
- **Interactive testing**: Try endpoints directly in Swagger

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov
```

## Code Quality

### Linting
```bash
npm run lint    # Check code style
npm run format  # Auto-fix formatting
```

### Type Checking
```bash
npm run type-check  # Check TypeScript types
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -d telehealings

# Verify connection string in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/telehealings
```

### Port Already in Use
```bash
# Change port in backend/.env
PORT=3001

# Or kill existing process (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Backend (Railway/Heroku)
1. Push to main branch
2. CI/CD pipeline builds and tests
3. Deploy to staging/production

### Frontend (EAS Build)
```bash
# Build for iOS/Android
eas build --platform ios
eas build --platform android
```

## Documentation

- **[PROJECT_DETAILS.md](./PROJECT_DETAILS.md)** - Complete product & project specification
- **[Design Files](./Design)** - UI/UX design mockups
- **API Docs** - http://localhost:3000/api (when running)

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push branch: `git push origin feature/feature-name`
4. Create Pull Request

## Tech Stack Summary

### Frontend
- React Native + Expo
- TypeScript
- Zustand (state management)
- Reanimated (animations)

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe Payments
- Socket.io (real-time)

### Infrastructure
- Supabase (Database & Auth)
- Stripe (Payments)
- Twilio (SMS)
- Firebase/FCM (Push notifications)
- Vercel (Frontend hosting)
- Railway (Backend hosting)

## License

MIT

## Support

For issues, questions, or suggestions, please create an issue or contact the team.

---

**Last Updated**: June 2026  
**Version**: 0.1.0 (Phase 1 - Core Infrastructure)
