# Development Environment Setup Checklist

## Prerequisites
- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] PostgreSQL v13+ installed (or Docker)
- [ ] Git configured
- [ ] GitHub account (for version control)

## Backend Setup

### 1. Install Dependencies
```bash
npm install -w backend
```
- [ ] Backend dependencies installed
- [ ] node_modules/created under backend/

### 2. Database Configuration
```bash
# Create .env file
cp backend/.env.example backend/.env

# Edit backend/.env and set:
# DATABASE_URL=postgresql://telehealings:telehealings123@localhost:5432/telehealings
```
- [ ] .env file created
- [ ] DATABASE_URL configured
- [ ] PostgreSQL running and accessible

### 3. Database Initialization
```bash
npm run db:generate -w backend  # Generate Prisma client
npm run db:migrate -w backend   # Run migrations
npm run db:seed -w backend      # (Optional) Seed admin user
```
- [ ] Prisma client generated
- [ ] Migrations applied
- [ ] Database schema created
- [ ] Admin user seeded (optional)

### 4. Environment Variables
```bash
# Edit backend/.env with:
JWT_SECRET=your-super-secret-key
STRIPE_SECRET_KEY=sk_test_...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password
FRONTEND_URL=http://localhost:8081
```
- [ ] JWT_SECRET configured
- [ ] STRIPE_SECRET_KEY configured
- [ ] Admin credentials set
- [ ] FRONTEND_URL set

### 5. Start Backend
```bash
npm run start:dev -w backend
```
- [ ] Server running on http://localhost:3000
- [ ] Swagger API docs available at http://localhost:3000/api
- [ ] No errors in console

## Frontend Setup

### 1. Install Dependencies
```bash
npm install -w frontend
```
- [ ] Frontend dependencies installed
- [ ] Expo CLI available

### 2. Environment Configuration
```bash
# Create .env file
cp frontend/.env.example frontend/.env

# Edit frontend/.env with:
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
- [ ] .env file created
- [ ] EXPO_PUBLIC_API_URL points to backend
- [ ] EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY configured

### 3. Start Frontend
```bash
npm start -w frontend

# Or specific platform:
npm run ios -w frontend        # For iOS simulator
npm run android -w frontend    # For Android emulator
npm run web -w frontend        # For web browser
```
- [ ] App running in Expo Go or simulator
- [ ] Can connect to backend API
- [ ] No errors in console

## Services & External APIs

### Stripe (Payments)
- [ ] Create Stripe account at https://stripe.com
- [ ] Get test keys (publishable & secret)
- [ ] Configure in backend/.env & frontend/.env

### Supabase (Database & Auth)
- [ ] Create Supabase project
- [ ] Get connection string
- [ ] Configure DATABASE_URL in backend/.env

### Twilio (SMS OTP - Optional)
- [ ] Create Twilio account
- [ ] Get Account SID & Auth Token
- [ ] Configure in backend/.env

### Firebase/FCM (Push Notifications - Optional)
- [ ] Create Firebase project
- [ ] Generate service account key
- [ ] Configure in backend

## Database Management

### View Database (Prisma Studio)
```bash
npm run db:studio -w backend
# Opens http://localhost:5555
```
- [ ] Can view/edit database through Studio

### Run Migrations
```bash
npm run db:migrate -w backend
```
- [ ] Migrations applied without errors

### Seed Database
```bash
npm run db:seed -w backend
```
- [ ] Admin user created
- [ ] Sample data populated

## Code Quality & Testing

### Linting
```bash
npm run lint -w backend
npm run lint -w frontend
```
- [ ] No linting errors
- [ ] Code follows standards

### Formatting
```bash
npm run format -w backend
npm run format -w frontend
```
- [ ] Code formatted consistently

### Type Checking
```bash
npm run type-check -w frontend
```
- [ ] No TypeScript errors

### Testing (Backend)
```bash
npm run test -w backend
```
- [ ] All tests pass

## Verification

### Backend Health Check
```bash
curl http://localhost:3000/health
```
- [ ] Returns 200 OK

### API Documentation
```
http://localhost:3000/api
```
- [ ] Swagger docs accessible
- [ ] All endpoints documented

### Frontend Startup
- [ ] App loads without errors
- [ ] Can navigate through screens
- [ ] API calls work correctly

## Docker Setup (Alternative)

### Start Services
```bash
docker-compose up -d
```
- [ ] PostgreSQL container running
- [ ] Redis container running
- [ ] Both healthy

### Stop Services
```bash
docker-compose down
```

## Git Setup

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: Phase 1 - Core Infrastructure"
git branch -M main
git remote add origin https://github.com/yourusername/telehealings.git
git push -u origin main
```
- [ ] Repository initialized
- [ ] Remote configured
- [ ] Initial commit pushed

## Final Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 8081 (or configured port)
- [ ] Database connected and migrated
- [ ] API documentation accessible
- [ ] Environment variables configured
- [ ] All tests passing
- [ ] Code formatted and linted
- [ ] Git repository initialized

## Troubleshooting

### Dependencies Won't Install
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9  # Backend
lsof -ti:8081 | xargs kill -9  # Frontend
```

### Database Connection Failed
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials
- Check network connectivity

### Module Not Found Errors
```bash
npm install
npm run db:generate -w backend
```

## Next Steps

1. Review [PROJECT_DETAILS.md](./PROJECT_DETAILS.md) for full specifications
2. Check [Design files](./Design) for UI mockups
3. Read API documentation at http://localhost:3000/api
4. Start implementing Phase 2 features
5. Create feature branches for development

---

**Version**: 0.1.0  
**Last Updated**: June 2026
