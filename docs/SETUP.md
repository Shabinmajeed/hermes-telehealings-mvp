# TeleHealings MVP — Setup Guide

## Prerequisites

- **Node.js** 18.x or 20.x
- **npm** 9+
- **Git** 2.40+
- **Prisma CLI** (installed via npm)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Shabinmajeed/hermes-telehealings-mvp.git
cd hermes-telehealings-mvp
```

### 2. Install Dependencies

The monorepo uses **npm workspaces**. Install all packages at once:

```bash
npm install
```

This installs dependencies for:
- `packages/backend` (NestJS API)
- `packages/mobile` (Expo React Native)
- `packages/admin-web` (React web)
- `packages/therapist-web` (React web)

### 3. Set Up Environment Variables

Copy the template and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your configuration (database URL, OAuth credentials, etc.).

**Note:** Each package may have its own `.env` file for package-specific settings. See the package's README for details.

### 4. Database Setup (Backend Only)

```bash
npm run db:setup --workspace=packages/backend
```

This runs Prisma migrations and seeds the database.

### 5. Start Development Servers

**Backend (NestJS):**
```bash
npm run dev --workspace=packages/backend
```

**Mobile (Expo):**
```bash
npm run dev --workspace=packages/mobile
```

**Admin Web:**
```bash
npm run dev --workspace=packages/admin-web
```

**Therapist Web:**
```bash
npm run dev --workspace=packages/therapist-web
```

Or start all at once:
```bash
npm run dev
```

## Project Structure

```
hermes-telehealings-mvp/
├── docs/               # Documentation
├── packages/
│   ├── backend/        # NestJS REST API
│   ├── mobile/         # Expo React Native app
│   ├── admin-web/      # Admin dashboard
│   └── therapist-web/  # Therapist web app
└── scripts/            # Utility scripts
```

## Available Scripts

At the **root** level:

```bash
npm run dev              # Start all packages
npm run build            # Build all packages
npm run lint             # Lint all packages
npm test                 # Test all packages
npm run format           # Format code (Prettier)
```

At the **package** level:

```bash
npm run dev --workspace=packages/backend
npm run build --workspace=packages/backend
npm run test --workspace=packages/backend
```

## Troubleshooting

### Port Already in Use

If port 3000 (backend), 8081 (mobile), or 5173 (web) is in use:

```bash
# Find and kill the process (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma Errors

Reset the database:

```bash
npm run db:reset --workspace=packages/backend
```

## Next Steps

- See [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflows
- See [API_DOCS.md](./API_DOCS.md) for backend endpoints
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
