# TeleHealings - Soft Onboarding Feature Preview

## 🎯 Live Demo Access

All pages are now running locally and accessible at:

```
http://localhost:8888/index.html
```

**Preview pages individually:**
- Marketing Landing: http://localhost:8888/marketing.html
- Soft Onboarding: http://localhost:8888/soft-onboarding.html
- Personalisation: http://localhost:8888/personalisation.html

---

## 📊 Three-Page Onboarding Flow

### Page 1: Marketing Landing (`marketing.html`)

**Visual Elements:**
- Telehealings Logo (top)
- Title: "Telehealings" (Large, blue, bold)
- Subtitle: "Continuity-first wellness care platform"
- 3 Feature List with star bullets:
  ✦ Ai-powered conversational partner
  ✦ Therapist handover continuity
  ✦ Self-help library

- 3-column Stats Section:
  - 200+ Verified therapists
  - 8+ Languages
  - 1,000+ Hours of therapy

- Heali Mascot (Penguin character, floating animation)
- CTA Text: "Your wellness journey is one click away."
- Blue circular button with arrow (navigates to soft-onboarding.html)

**Design System:**
- Blue gradient background at top (#cbe0f9 → #e2effa)
- White bottom section
- Smooth slideFadeUp animations (0.1s-0.5s staggered delays)
- Glassmorphism stat boxes with backdrop blur
- Soft shadows: 0 10px 30px rgba(0,0,0,0.04)

---

### Page 2: Soft Onboarding Welcome (`soft-onboarding.html`)

**Visual Elements:**
- Top gradient curved section (white → blue, border-radius rounded bottom)
- Heading: "Hi, I'm Heali"
- Subtitle: "AI-Powered Healing Partner"
- Heali Mascot with floating animation (8px vertical bob)
- User Name Input Field:
  - Placeholder: "Your name"
  - Height: 56px, border-radius: 30px
  - Focus state: Blue border + glow shadow
- Terms & Privacy Consent Checkbox (custom styled):
  - Unchecked: Gray border
  - Checked: Blue background with checkmark
- Checkbox Label: "I agree to the Terms and Privacy Policy"
  - "Terms" and "Privacy Policy" are clickable links (blue)
- Blue Primary Button: "Continue ➜"
- Footer Link: "Existing User? Login"

**Terms & Conditions Modal:**
- Slides up from bottom (100% → 0% translateY)
- Overlay with dark blur (15px backdrop-filter)
- Header with title and close button (X icon)
- Scrollable content body (80% of viewport height):
  1. Acceptance of Terms
  2. Privacy Policy
  3. User Conduct
  4. Medical Disclaimer
  5. Modifications to Service
- Two buttons at bottom:
  - Reject (light gray background)
  - Accept (blue background)
- Smooth cubic-bezier animations (0.4s)

**Interactions:**
- Click "Terms" link → Modal opens
- Click "Privacy Policy" link → Modal opens
- Click checkbox → Modal opens (instead of immediately checking)
- Click "Accept" → Checkbox checked, modal closes
- Click "Reject" → Checkbox unchecked, modal closes
- Click X close button → Modal closes

---

### Page 3: Personalisation (`personalisation.html`)

**Visual Elements:**
- Back button (top-left, navigates to soft-onboarding.html)
- Title: "What brings you here?" (centered, blue)
- Subtitle: "Choose what you'd like to focus on first. We'll personalize your journey based on your needs."
- Heali Mascot (top-right corner)
- 2×3 Grid Layout with 6 Interactive Cards:

**Card Options:**
1. **Stress** - "Managing daily pressure"
2. **Anxiety** - "Calming your mind"
3. **Sleep** - "Better rest"
4. **Relationships** - "Building connections"
5. **Self-esteem** - "Building confidence"
6. **Focus** - "Improving concentration"

**Card Features:**
- Each card has an SVG icon (36×36px)
- Title (bold, dark)
- Subtitle (light gray, smaller)
- Unselected state:
  - White background with subtle shadow
  - Transparent border
  - Hover scale effect (0.96)
- Selected state:
  - Light blue background (rgba(59, 130, 246, 0.06))
  - Blue border (#387bd5)
  - Icon scales up (1.1x) and turns blue
  - Title turns blue
  - Glow shadow effect

**Validation:**
- Message below cards: "Select at least 1 option to continue"
- Max 3 selections enforced
- On 4th selection attempt: Error animation (shake)
- Error message changes to: "You can only choose a maximum of 3 cards."
- Blue "Continue" button:
  - Disabled when 0 selections
  - Enabled when ≥1 selection
  - Navigates to home.html (currently broken path, returns 404)

---

## 🎨 Design System Details

### Color Palette
- **Primary Blue:** #1e5ab8, #387bd5, #3b82f6
- **Light Blue Gradient:** #cbe0f9 → #e2effa
- **Dark Text:** #1a293b
- **Medium Text:** #334155, #475569
- **Light Text:** #64748b, #94a3b8
- **Backgrounds:** #ffffff, #f1f5f9
- **Borders:** rgba(56, 123, 213, 0.15)
- **Status (Success):** #10b981
- **Status (Error):** #d93838

### Typography
- **Font Stack:** -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif
- **Titles:** 22-34px, weight 700-800, letter-spacing -0.3 to -0.5px
- **Body:** 14-16px, weight 500-600
- **Small Text:** 11-13px, weight 400-500

### Spacing & Layout
- **8px spacing scale** (6px, 8px, 12px, 16px, 20px, 24px, 30px, etc.)
- **Mobile-first:** max-width: 380px on desktop
- **Padding:** 15-30px on sides, 4-25px vertical
- **Gap (Grid):** 12px between cards
- **Border-radius:** 6px (small), 16-30px (buttons), 50% (circles)

### Shadows
- Subtle: 0 2px 8px rgba(0,0,0,0.02-0.03)
- Medium: 0 10px 25px rgba(0,0,0,0.03)
- Large: 0 10px 40px rgba(0,0,0,0.1)
- Glow: 0 0 0 4px rgba(56, 123, 213, 0.15)
- Modal: 0 -10px 40px rgba(0,0,0,0.2)

### Animations
- **slideFadeUp:** 
  ```css
  @keyframes slideFadeUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  /* Duration: 0.6s, Timing: ease-out */
  /* Staggered delays: 0.1s, 0.2s, 0.3s, 0.4s, 0.5s */
  ```

- **floatBob:**
  ```css
  @keyframes floatBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  /* Duration: 4s, Timing: ease-in-out, Delay: 0.9s */
  ```

- **shake (for validation errors):**
  ```css
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-4px); }
  }
  /* Duration: 0.4s, Timing: ease-in-out */
  ```

- **Modal slide up:**
  ```css
  transform: translateY(100%) → translateY(0)
  /* Duration: 0.4s, Timing: cubic-bezier(0.25, 0.8, 0.25, 1) */
  ```

---

## ✅ Current Status

**Completed:**
- ✓ All 3 HTML pages structured and styled
- ✓ Terms & Conditions modal with smooth animations
- ✓ Image assets (Logo.png, Heali.png) integrated and loading
- ✓ Custom form validation (checkbox, multi-select cards)
- ✓ Responsive mobile-first layout
- ✓ CSS animations and transitions (slideFadeUp, floatBob, shake)
- ✓ localStorage integration for storing selections
- ✓ Accessibility attributes (role, aria-checked, tabindex)

**In Progress:**
- Spacing/sizing refinement for exact design match
- Responsive breakpoint testing
- Browser compatibility verification

**To Do:**
- Connect personalisation to home.html (fix relative path)
- Backend API integration for persisting user preferences
- Authentication flow
- User profile initialization

---

## 🔗 File Structure

```
frontend/
├── src/
│   ├── Logo.png
│   ├── Heali.png
│   ├── css/
│   │   ├── global.css (design tokens, colors, typography)
│   │   ├── buttons.css (button styles)
│   │   └── layout.css (responsive layout)
│   └── workflows/
│       └── soft-onboarding/
│           ├── index.html (preview dashboard)
│           ├── marketing.html (page 1)
│           ├── soft-onboarding.html (page 2)
│           ├── personalisation.html (page 3)
│           └── terms-and-conditions.js (modal logic)
```

---

## 📝 Browser Access

**Local Server Running:**
```bash
cd frontend/src/workflows/soft-onboarding
python3 -m http.server 8888
```

**Visit in your browser:**
http://localhost:8888/index.html

This displays all three pages in an interactive dashboard with "Open in New Tab" links for each page to see them in full-screen view.
