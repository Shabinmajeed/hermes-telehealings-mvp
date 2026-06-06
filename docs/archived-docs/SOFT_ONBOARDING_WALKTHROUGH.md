# Soft Onboarding Feature - Live Walkthrough

## Pages Successfully Loaded & Tested

### 1. Marketing Page (`marketing.html`)
✅ **Status: Working**
- Displays Telehealings branding
- Shows subtitle: "Continuity-first wellness care platform"
- Features list with 3 items (star bullets):
  - Ai-powered conversational partner
  - Therapist handover continuity
  - Self-help library
- Stats boxes (3 columns):
  - 200+ Verified therapists
  - 8+ Languages
  - 1,000+ Hours of therapy
- Heali mascot image (floating animation intended)
- CTA Button: "Your wellness journey is one click away" with arrow icon

**Missing Assets:**
- `src/logo.png` - returns 404
- `src/Heali.png` - returns 404

---

### 2. Soft Onboarding Welcome Page (`soft-onboarding.html`)
✅ **Status: Working**
- Header: "Hi, I'm Heali"
- Subtitle: "AI-Powered Healing Partner"
- Gradient blue/white background curve at top
- User name input field (placeholder: "Your name")
- Terms & Privacy consent checkbox
- Continue button with arrow icon
- "Existing User? Login" footer link
- Terms & Conditions modal (slides up from bottom)

**Modal Features Working:**
- Contains 5 sections:
  1. Acceptance of Terms
  2. Privacy Policy
  3. User Conduct
  4. Medical Disclaimer
  5. Modifications to Service
- Reject / Accept buttons
- Checkbox state updates on Accept/Reject

---

### 3. Personalisation Page (`personalisation.html`)
✅ **Status: Working (partially)**
- Header: "What brings you here?"
- Subtitle: "Choose what you'd like to focus on first..."
- 2x3 grid layout of 6 option cards:
  1. **Stress** - "Managing daily pressure"
  2. **Anxiety** - "Calming your mind"
  3. **Sleep** - "Better rest"
  4. **Relationships** - "Building connections"
  5. **Self-esteem** - "Building confidence"
  6. **Focus** - "Improving concentration"

**Card Features:**
- Each has icon, title, subtitle
- Selection state shows blue highlight + scaled icon
- Max 3 selections enforced
- Selected cards: Stress, Anxiety, Sleep ✓
- Continue button enabled when ≥1 selection
- Button text: "Select at least 1 option to continue" appears before first selection

**Navigation Issue:**
- ❌ Continue button tries to link to `../../home.html` (404)
- Relative path broken - needs correction to actual home page location

---

## Design System Observations

### Colors Used
- Primary Blue: `#1e5ab8`, `#387bd5`, `#3b82f6`
- Gradient: White → Light Blue (`#e2effb`)
- Text: `#1a293b` (dark), `#64748b` (light)
- Backgrounds: `#ffffff`, `#f1f5f9`

### Animations
- **slideFadeUp**: Opacity + vertical slide with staggered delays (0.1s, 0.2s, 0.3s, etc.)
- **floatBob**: Gentle vertical floating animation (±8px)
- **shake**: Used for validation errors

### Typography
- Headers: Bold (700-800), 22-34px
- Body: Medium (500-600), 12-16px
- Uses letter-spacing for visual refinement

### Layout Features
- Mobile-first responsive design
- Rounded buttons (border-radius: 30px)
- Soft shadows: `0 10px 25px rgba(0, 0, 0, 0.03)`
- Glassmorphism on stat boxes (backdrop-filter blur)

---

## Issues Identified

### Critical
1. **Missing Image Assets**
   - `src/logo.png` → 404
   - `src/Heali.png` → 404
   - Need to source/create these images

2. **Broken Navigation**
   - Personalisation Continue button → `../../home.html` (404)
   - Need to establish correct path to home page

### Minor
3. **Layout/Spacing**
   - Some CSS references missing (`../../css/global.css`, `buttons.css`, `layout.css`)
   - Need to verify these stylesheets exist and are properly linked

---

## Kanban Status

Completed Tasks:
- ✅ Set up project structure for soft onboarding feature
- ✅ Implement personalisation.html for soft onboarding

Next Tasks (Ready):
- Implement soft-onboarding.html (already done, needs refinement)
- Implement marketing.html (already done, needs image assets)
- Integrate terms-and-conditions.js (already working)
- Add global CSS and styling components
- Test and validate HTML/CSS/JS for layout/spacing
- Connect soft onboarding to user profile/home workflow
- Add image assets (logo, Heali mascot)

---

## User Flow Verified

1. ✅ Marketing page loads
2. ✅ Click CTA → Soft onboarding page
3. ✅ Enter name "Alex" → textbox captures input
4. ✅ Click consent checkbox → Opens Terms modal
5. ✅ Accept Terms → Checkbox checked, modal closes
6. ✅ Click Continue → Personalisation page loads
7. ✅ Select 3 options (Stress, Anxiety, Sleep) → All selectable
8. ✅ Click Continue → Should navigate to home (broken path)

**Overall Assessment:** Core workflow is functional; just needs asset integration and path corrections.
