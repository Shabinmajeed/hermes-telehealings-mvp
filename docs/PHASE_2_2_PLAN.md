# Phase 2.2: Main App Screens (Home, Discovery, Booking, Sessions)

**Status:** In Progress  
**Target:** 6 production-ready screens + 2 component systems  
**Timeline:** June 6, 2026  
**Lines of Code Target:** 3,000+  

---

## Phase 2.2 Overview

After Phase 2.1 (soft onboarding), users move into the main app. This phase builds:

1. **Home/Dashboard** - Main app entry point, appointments overview
2. **Therapist Discovery** - Search, filter, browse available therapists
3. **Therapist Detail** - Individual therapist profile, bio, availability
4. **Booking Flow** - Multi-step: date → time → review → payment
5. **Sessions List** - Upcoming/past sessions management
6. **Session Detail** - Join call, session notes, feedback

Plus two critical component systems:
- **AppointmentCard** - Reusable component for all appointment displays
- **TherapistCard** - Reusable component for therapist listings

---

## Screen Specifications

### Screen 1: Home/Dashboard
**File:** `packages/mobile/app/screens/HomeScreen.tsx`

**Purpose:** First screen after login, shows appointment overview and quick actions

**Key Features:**
- Appointment summary card (next appointment)
- Quick stats (total sessions, therapist name, next date)
- "Browse Therapists" button (CTA)
- "My Sessions" button (navigation)
- Recent appointments list (last 3)
- Empty state if no appointments
- Pull-to-refresh for appointments
- Professional header with gradient

**API Calls:**
- GET `/appointments/upcoming` - Fetch next appointment
- GET `/appointments/recent?limit=3` - Fetch recent appointments
- GET `/user/profile` - Get current user info

**Design Tokens:**
- Header: Gradient primary → accent
- Cards: White with subtle shadow
- CTA button: Primary color
- Empty state: Icon + text

**Animations:**
- Fade-in on mount
- Slide-up for appointment cards
- Smooth refresh rotation

---

### Screen 2: Therapist Discovery
**File:** `packages/mobile/app/screens/TherapistDiscoveryScreen.tsx`

**Purpose:** Browse and discover available therapists

**Key Features:**
- Search bar with real-time filtering
- Filter chips: Specialization, Availability, Rating
- Flat list of therapist cards
- Load more pagination
- Filtering state persistence
- Empty state for no results
- Pull-to-refresh
- Error state with retry

**Components Used:**
- `TherapistCard` component (reusable)
- Search input with debounce
- Filter chipbar

**API Calls:**
- GET `/therapists/available?search=&specialization=&page=` - Fetch therapists
- GET `/specializations` - Fetch filter options
- GET `/availability/therapists` - Fetch availability data

**Design Tokens:**
- Search bar: Secondary background, accent text
- Chips: Outline style (inactive) → filled (active)
- Cards: TherapistCard component (reusable)
- Loading: Skeleton screens or spinner

**Interactions:**
- Real-time search (debounced 500ms)
- Multi-select filters
- Pagination with "Load More" button
- Pull-to-refresh

---

### Screen 3: Therapist Detail
**File:** `packages/mobile/app/screens/TherapistDetailScreen.tsx`

**Purpose:** View detailed therapist profile and book appointment

**Key Features:**
- Therapist hero section: Photo, name, specialization
- Bio section with expand/collapse
- Credentials and certifications
- Reviews/ratings section (average + recent)
- Availability calendar
- "Book Now" CTA button
- Navigation back button
- Bookmark/favorite toggle

**Components Used:**
- Hero image with overlay
- Rating stars component
- Review card (reusable)
- Availability slots display

**API Calls:**
- GET `/therapists/:id` - Fetch therapist details
- GET `/therapists/:id/reviews` - Fetch therapist reviews
- GET `/therapists/:id/availability` - Fetch availability slots
- POST `/bookmarks/:therapistId` - Toggle bookmark

**Design Tokens:**
- Hero: Photo with gradient overlay
- Stats: Icon + value pairs
- Button: Primary CTA, secondary bookmark
- Reviews: Star rating + comment preview

**Animations:**
- Parallax on hero image scroll
- Fade-in ratings section
- Smooth availability transition

---

### Screen 4: Booking Flow
**File:** `packages/mobile/app/screens/BookingFlowScreen.tsx`

**Purpose:** Multi-step booking wizard (date → time → review → payment)

**Key Features:**
- Step indicator (1 of 4 / 2 of 4 / etc.)
- Step 1: Date picker with availability
- Step 2: Time slot selection (available slots only)
- Step 3: Review appointment details + price
- Step 4: Payment method selection
- Next/Back buttons
- Form validation per step
- Loading state during booking
- Success/error handling

**State Management:**
- `selectedTherapistId: string`
- `selectedDate: Date`
- `selectedTimeSlot: string`
- `bookingStep: 1 | 2 | 3 | 4`
- `bookingData: BookingData`

**API Calls:**
- GET `/appointments/availability/:therapistId?date=` - Fetch available slots
- POST `/appointments/create` - Create appointment
- GET `/appointments/:id/payment-methods` - Fetch payment options

**Components Used:**
- DatePicker (native)
- TimeSlotGrid component (custom)
- ReviewCard component
- PaymentMethodSelector component

**Design Tokens:**
- Steps: Progress bar or step dots
- Date/Time: Calendar and grid layouts
- Review: Summary card with pricing
- Payment: Option cards with radio select

**Validations:**
- Date must be in future
- Date must have availability
- Time slot must be available
- Payment method required before booking

---

### Screen 5: Sessions List
**File:** `packages/mobile/app/screens/SessionsListScreen.tsx`

**Purpose:** View all user's upcoming and past sessions

**Key Features:**
- Tab view: Upcoming / Past
- Session cards with status
- Session date, time, therapist name
- Quick action buttons: Join, Reschedule, Cancel (upcoming)
- Quick action buttons: Feedback, Reopen (past)
- Pull-to-refresh
- Empty states
- Loading state
- Pagination or infinite scroll

**Components Used:**
- `AppointmentCard` component (reusable)
- Tab navigation
- Status badge

**API Calls:**
- GET `/appointments?status=upcoming&limit=10&offset=0` - Fetch upcoming
- GET `/appointments?status=completed&limit=10&offset=0` - Fetch past
- POST `/appointments/:id/cancel` - Cancel appointment
- GET `/appointments/:id/join-call` - Get call link

**Design Tokens:**
- Tabs: Active underline, inactive muted
- Cards: AppointmentCard (reusable)
- Status badges: Color-coded by status
- Action buttons: Contextual colors

**Interactions:**
- Swipe between tabs
- Pull-to-refresh
- Tap card to view details
- Quick actions in card footer

---

### Screen 6: Session Detail
**File:** `packages/mobile/app/screens/SessionDetailScreen.tsx`

**Purpose:** View complete session details and join call

**Key Features:**
- Session header: Date, time, status, therapist name + photo
- Countdown timer (if upcoming, show when starts)
- "Join Call" button (if session started)
- Session notes (therapist notes, patient notes)
- Notes editor (if session ended, allow notes)
- Feedback form (if session completed)
  - Rating (1-5 stars)
  - Comment field
  - Submit button
- Reschedule / Cancel buttons
- Call quality / connection status (if in call)

**Components Used:**
- Video player placeholder (for call)
- Countdown timer component
- Feedback form component
- Status badge

**API Calls:**
- GET `/appointments/:id` - Fetch session details
- GET `/appointments/:id/notes` - Fetch session notes
- POST `/appointments/:id/join` - Join video call
- POST `/appointments/:id/feedback` - Submit feedback
- POST `/appointments/:id/notes` - Save notes
- POST `/appointments/:id/reschedule` - Reschedule session
- POST `/appointments/:id/cancel` - Cancel session

**Design Tokens:**
- Header: Gradient with session info
- Timer: Large countdown display
- Call button: Primary CTA
- Feedback form: Input fields with validation
- Notes: Scrollable text area

**Animations:**
- Timer countdown animation
- Feedback success animation
- Smooth tab transitions

---

## Reusable Component Systems

### AppointmentCard Component
**File:** `packages/mobile/src/components/AppointmentCard.tsx`

**Props:**
```typescript
interface AppointmentCardProps {
  id: string;
  date: Date;
  time: string;
  therapistName: string;
  therapistPhoto?: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  duration?: number;
  onPress?: () => void;
  onJoin?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}
```

**Features:**
- Displays appointment info in card format
- Status-colored border/background
- Quick action buttons
- Time countdown for upcoming
- Responsive layout

**Used in:** HomeScreen, SessionsListScreen

---

### TherapistCard Component
**File:** `packages/mobile/src/components/TherapistCard.tsx`

**Props:**
```typescript
interface TherapistCardProps {
  id: string;
  name: string;
  photo: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  availableSlots: number;
  hourlyRate: number;
  onPress?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}
```

**Features:**
- Photo with fallback avatar
- Rating stars with count
- Specialization tag
- Available slots indicator
- Pricing info
- Bookmark button

**Used in:** TherapistDiscoveryScreen, TherapistDetailScreen (header)

---

## Implementation Order

1. **Components First** (Reusable)
   - AppointmentCard
   - TherapistCard
   - Helper components (Rating, ReviewCard, etc.)

2. **Screens - Easy First**
   - SessionsListScreen (uses AppointmentCard)
   - HomeScreen (uses AppointmentCard)
   - TherapistDiscoveryScreen (uses TherapistCard)

3. **Screens - Complex Next**
   - TherapistDetailScreen (uses TherapistCard + reviews)
   - SessionDetailScreen (uses AppointmentCard + new components)

4. **Screens - Most Complex Last**
   - BookingFlowScreen (multi-step, complex state)

---

## Testing Checklist

For each screen:
- [ ] TypeScript compiles without errors
- [ ] All API calls implemented
- [ ] All validations working
- [ ] Loading states visible
- [ ] Error states handled
- [ ] Empty states show correctly
- [ ] Design system tokens used throughout
- [ ] Animations smooth (60fps)
- [ ] No console warnings
- [ ] Responsive on all device widths
- [ ] Tested on device/simulator

---

## GitHub Commits

- Commit 1: Add AppointmentCard + TherapistCard components
- Commit 2: Add HomeScreen + SessionsListScreen
- Commit 3: Add TherapistDiscoveryScreen
- Commit 4: Add TherapistDetailScreen + SessionDetailScreen
- Commit 5: Add BookingFlowScreen (multi-step)
- Commit 6: Wire screens into App.tsx navigation
- Commit 7: Update DEMO.html with new screens (preview)

---

## Success Criteria

✅ All 6 screens built with 3,000+ lines of TypeScript  
✅ Full API integration (12+ endpoints)  
✅ Comprehensive form validation  
✅ Smooth animations throughout  
✅ Design system consistency  
✅ Error handling on all API calls  
✅ Loading states for all async operations  
✅ Reusable components (AppointmentCard, TherapistCard)  
✅ All committed to GitHub  
✅ Demo updated with new screens  

---

## Timeline Estimate

- Components: 30 mins (AppointmentCard, TherapistCard)
- HomeScreen: 20 mins
- SessionsListScreen: 20 mins
- TherapistDiscoveryScreen: 30 mins
- TherapistDetailScreen: 30 mins
- SessionDetailScreen: 30 mins
- BookingFlowScreen: 40 mins (most complex)
- Integration + Testing: 30 mins
- Total: ~3.5 hours

---

## Notes

- All screens follow Phase 2.1 patterns (validation, animations, API integration)
- Heavy use of design system tokens (COLORS, SPACING, TYPOGRAPHY)
- Native date/time pickers for all datetime selection
- Real API integration (not mocked)
- Progressive loading states for lists (FlatList with pagination)
- Comprehensive error handling and user feedback

---

**Start Time:** Now  
**Target Completion:** 3.5 hours  
**Status:** Ready to build
