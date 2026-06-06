# Mobile App - Phase 2 Screen Development Plan

## Onboarding Flow (Workflow 1: Soft Onboarding)

### Current Status
✅ **Completed:**
- Marketing Screen (app intro, features, stats)
- Soft Onboarding Screen (name, terms acceptance)
- Personalisation Screen (focus areas selection)
- Terms Modal
- Theme system (colors, spacing, typography)
- Zustand store (onboarding state management)

⏳ **Next Steps:**
1. **Phone Auth Screen** - OTP verification (1️⃣ NEXT)
2. **Medical Profile Screen** - Health history intake
3. **Personal Profile Screen** - Complete user info
4. Enhance UI/animations where needed

---

## Core App Screens (Workflow 2-7: Main App)

### After Onboarding Complete:
1. **Home/Dashboard** - Upcoming appointments, quick actions
2. **Therapist Discovery** - Search & browse therapists
3. **Therapist Detail** - Full profile, ratings, book button
4. **Booking Flow** - Date/time selection, confirmation
5. **Sessions Management** - View appointments
6. **Chat/Messages** - Real-time messaging with therapist
7. **User Profile** - Settings, account, logout

---

## Screens to Build

### 1. Phone Auth Screen (PhoneAuthScreen.tsx) ✅ EXISTS - NEEDS COMPLETION
**Purpose:** User phone verification with OTP

**Elements:**
- Phone number input field
- Send OTP button
- OTP input field (6 digits)
- Resend OTP link
- Error messaging
- Loading states

**State Management:**
- Phone number
- OTP code
- Sending state
- Verification state
- Error messages
- Remaining resend time

**API Calls:**
- POST /auth/send-otp (phone)
- POST /auth/verify-otp (phone, otp)

---

### 2. Medical Profile Screen (NEW)
**Purpose:** Collect health history

**Elements:**
- Conditions list (checkboxes)
- Medications input
- Allergies input
- Emergency contact
- Health insurance (optional)
- Previous therapy experience

**State Management:**
- Selected conditions
- Medications list
- Allergies
- Contact info

**API Calls:**
- POST /users/medical-profile

---

### 3. Personal Profile Screen (NEW)
**Purpose:** Complete user information

**Elements:**
- Date of birth
- Gender selection
- Location/City
- Occupation
- Emergency contact
- Profile completion

**State Management:**
- Profile data

**API Calls:**
- POST /users/profile
- Complete onboarding flow

---

## Design System

### Colors
- Primary: #4A90E2 (Blue)
- Secondary: #7B68EE (Purple)
- Success: #2ECC71 (Green)
- Error: #E74C3C (Red)
- Background: #F8F9FA
- Text: #2C3E50

### Typography
- Header: 32px (Bold)
- SubHeader: 20px (SemiBold)
- Body: 16px (Regular)
- Caption: 14px (Regular)

### Spacing
- XS: 8px
- S: 12px
- M: 16px
- L: 24px
- XL: 32px

---

## Component Structure

```
packages/mobile/
├── App.js                           (Main app navigation)
├── app/
│   ├── onboarding/
│   │   ├── MarketingScreen.tsx      ✅ Done
│   │   ├── SoftOnboardingScreen.tsx ✅ Done
│   │   ├── PersonalisationScreen.tsx ✅ Done
│   │   ├── PhoneAuthScreen.tsx      ⏳ Complete
│   │   ├── MedicalProfileScreen.tsx ❌ TODO
│   │   ├── PersonalProfileScreen.tsx ❌ TODO
│   │   └── TermsModal.tsx           ✅ Done
│   ├── screens/
│   │   ├── TherapistDiscoveryScreen.tsx
│   │   ├── TherapistDetailScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── SessionsScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── UserProfileScreen.tsx
│   └── components/
│       ├── Button.tsx
│       ├── InputField.tsx
│       ├── TherapistCard.tsx
│       └── SessionCard.tsx
├── src/
│   ├── services/
│   │   ├── api.ts                  (API client)
│   │   ├── auth.ts                 (Auth logic)
│   │   └── therapist.ts            (Therapist API)
│   ├── store/
│   │   ├── onboardingStore.ts      ✅ Done
│   │   ├── authStore.ts            ❌ TODO
│   │   └── appStore.ts             ❌ TODO
│   ├── types/
│   │   ├── onboarding.ts           ✅ Done
│   │   ├── user.ts                 ❌ TODO
│   │   └── therapist.ts            ❌ TODO
│   └── styles/
│       └── theme.ts                ✅ Done
```

---

## Implementation Strategy

### Phase 2.1: Complete Onboarding (THIS SPRINT)
1. ✅ Marketing + Soft Onboarding + Personalisation screens
2. ⏳ Build Phone Auth Screen (OTP verification)
3. ❌ Build Medical Profile Screen
4. ❌ Build Personal Profile Screen
5. Connect to backend API

### Phase 2.2: Main App (NEXT SPRINT)
6. Build Home/Dashboard screen
7. Build Therapist Discovery screen
8. Build Therapist Detail screen
9. Build Booking flow
10. Implement Sessions management

### Phase 2.3: Chat & Messaging (SPRINT 3)
11. Build Chat screen
12. Implement real-time messaging
13. Build User Profile screen
14. Add settings & logout

---

## Testing Strategy

- Unit tests for store/services
- Integration tests for API calls
- Component screenshots for UI regression
- Manual testing on iOS/Android
- Load testing with multiple therapists

---

## Notes

- All screens use `react-native` core components
- Animations with `react-native-reanimated`
- State management with Zustand
- API communication with axios
- Linear gradients via `expo-linear-gradient`
- SVG icons via `react-native-svg`
