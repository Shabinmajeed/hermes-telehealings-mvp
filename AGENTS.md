# TeleHealings Project

## Architecture
- **Mobile**: Expo SDK 56, expo-router MPA — port 3001
- **Therapist Web**: React/Vite — port 5173
- **Admin Web**: React/Vite — port 5174
- **Backend**: NestJS + Prisma — port 5172
- **Monorepo**: All code in this directory

## UI Standards
- Clean/professional, no emoji icons
- Use SVG icons and accent bars
- Heali mascot uses heali.png asset
- Bottom sheet modals max 65% height
- Always-visible action buttons
- 2.5s error messages
- Full-screen layout (100vh, no blank spaces)

## Routing
- Mobile uses file-based routing (expo-router)
- Each screen = separate URL/page (MPA, not SPA)
- Routes: / → /marketing → /soft-onboarding → /personalisation → /phone-auth → /profile-completion → /(tabs)

## Key Files
- Theme: packages/mobile/src/styles/theme.ts
- API: packages/mobile/app/services/api.ts
- Components: packages/mobile/src/components/
- Store: packages/mobile/src/store/

## Before Starting Work
1. Check servers are running (see active ports above)
2. Read existing code patterns before making changes
3. Run tests after changes
4. Update kanban card status
