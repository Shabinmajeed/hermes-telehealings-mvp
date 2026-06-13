# Design Audit Report — TeleHealings All Platforms

**Date**: June 8, 2026
**Scope**: 60 HTML mockups across 3 platforms + production code review
**Designer**: ui-ux-designer

---

## Executive Summary

- **60 HTML mockups** analyzed across mobile (26), admin (12), therapist (22)
- **26 unique blue values** found — consolidated to 9-step primary palette
- **27 unique grey values** found — consolidated to 11-step neutral scale
- **27 unique status colors** found — consolidated to 4 status groups with light/dark variants
- **13 distinct border radius values** found — consolidated to 8-step scale
- **24 distinct font sizes** found — consolidated to 11-step type scale
- **Font family**: mostly Inter, but mobile uses System font in places

---

## Critical Issues (Must Fix)

### C1: Primary Blue Inconsistency
**Severity**: CRITICAL
**Issue**: 26 different blue values used across platforms with no clear hierarchy
**Details**:
- Admin uses: #387bd5, #3b82f6, #2563eb, #1d4ed8, #2b74d4, #3169b8, #1c52b8...
- Therapist uses: #387bd5, #3b82f6, #2a73d4, #0745b1, #144db9, #1c52b8...
- Mobile uses: #387bd5, #3b82f6, #1e5ab8, #2563eb, #5b96ea, #8db8f1...
- Some pages within the SAME platform use different blues for the same element

**Recommendation**: Adopt unified primary-500 (#3b82f6) as the single primary brand blue. Use the 9-step palette for hover states (#2563eb = 600), active states (#1d4ed8 = 700), and tints (#dbeafe = 100). See tokens.json.

### C2: Grey Scale Proliferation
**Severity**: CRITICAL
**Issue**: 27 grey values with no naming convention or scale
**Details**: Colors like #4b4b4b, #64748b, #7aaaf6, #e5e4df, #e8e8e8, #eef5fc serve similar purposes but aren't named consistently

**Recommendation**: Adopt 11-step neutral scale (neutral-50 through neutral-1000). Map existing values to nearest step.

### C3: Missing Font Family on Mobile
**Severity**: CRITICAL
**Issue**: Mobile app uses `System` font family instead of Inter
**Details**: theme.ts uses `'System'` for all font families. Admin and therapist web both use Inter. This creates a visibly different typographic feel.

**Recommendation**: Load Inter font in mobile app. Change fontFamily to `'Inter'` or use `@expo-google-fonts/inter`.

### C4: Mobile Emoji Usage
**Severity**: CRITICAL  
**Issue**: marketing.tsx line 47 uses `✦` emoji character
**Details**: Violates project standard of "no emoji icons, use SVG/accent bars"

**Recommendation**: Replace with SVG icon or CSS accent bar. See components.md for specifications.

---

## Major Issues (Should Fix)

### M1: Border Radius Inconsistency
**Severity**: MAJOR
**Issue**: 13 different radius values with no scale
**Details**:
- Cards use 16px in admin, 16px in therapist, 12px in mobile
- Buttons use 8px in admin, 8px in therapist, 12px in mobile
- Some mockups use 99px for pills, others use 999px for full rounding

**Recommendation**: Adopt 8-step radius scale (none, sm=4, md=8, lg=12, xl=16, 2xl=20, 3xl=24, full=9999). Standardize cards to xl (16px), buttons to md (8px), pills to full.

### M2: Font Size Scale Gaps
**Severity**: MAJOR
**Issue**: Mobile uses 24 distinct sizes, admin 13, therapist 14 — no shared scale
**Details**: Sizes like 11.5px, 17px, 19px, 22px, 25px exist on some platforms but not others

**Recommendation**: Adopt 11-step type scale from tokens.json. Remove odd sizes (11.5px, 17px, 19px, 25px). Use nearest standard size.

### M3: Status Color Inconsistency
**Severity**: MAJOR
**Issue**: 27 different status colors, same semantic meaning mapped to different values
**Details**:
- Success: #10b981, #22c55e, #16a34a, #059669, #0d9488 — 5 different greens
- Error: #ef4444, #dc2626, #b91c1c, #d93838 — 4 different reds
- Warning: #f59e0b, #d97706, #b45309, #854d0e — 4 different ambers

**Recommendation**: Standardize to single value per status: success=#10b981, error=#ef4444, warning=#f59e0b, info=#3b82f6. Use light variants for backgrounds.

### M4: Hardcoded Values in Production Code
**Severity**: MAJOR
**Issue**: Production code (DashboardPage.tsx, LoginPage.tsx) uses hardcoded colors instead of CSS variables
**Details**:
- web-admin DashboardPage.tsx: kpi-icon background hardcoded to `#3b82f6`
- web-therapist TherapistLoginPage.tsx: text color hardcoded to `#0745b1`
- mobile settings.tsx: colors hardcoded to `#fbfcfd`, `#64748b`

**Recommendation**: Replace all hardcoded color values with:
- CSS variables for web (`var(--color-primary)`)
- Imported tokens for mobile (`COLORS.primary` from theme.ts)

### M5: Missing CSS Variables in HTML Mockups
**Severity**: MAJOR
**Issue**: Admin mockups inconsistently use CSS variables vs hardcoded values
**Details**:
- index.html (login): uses `var(--color-primary, #387bd5)` — good
- dashboard.html: hardcodes `#0f172a`, `#2563eb`, `#94a3b8` — bad
- Some pages use `--color-primary-600` which doesn't exist in global.css

**Recommendation**: All 12 admin mockups should use CSS variables from global.css. Same for all therapist and mobile mockups.

### M6: Therapist Sidebar Has Different Dimensions
**Severity**: MAJOR
**Issue**: Admin sidebar is 260px wide, therapist sidebar is 240px — should be consistent
**Details**: Web dashboards use sidebar navigation. Width difference is subtle but creates inconsistency in the platform family feel.

**Recommendation**: Standardize sidebar width to 260px for both admin and therapist.

---

## Minor Issues (Nice to Fix)

### m1: Card Padding Variation
**Details**: Admin cards use 24px padding, some therapist cards use 20px, mobile cards use 16px
**Recommendation**: Standardize to 24px for web, 16px for mobile (already logical — screen size difference)

### m2: Shadow Inconsistency
**Details**: Admin card shadow is `0 4px 15px rgba(0,0,0,0.02)`, login card shadow is `0 15px 35px rgba(0,0,0,0.08)`
**Recommendation**: Use standardized shadow scale from tokens.json. Card = `card` shadow, Login card/Modal = `lg` shadow.

### m3: Spacing in Grid Rows
**Details**: Admin dashboard uses `gap: 15px` for row grids — not a multiple of the 8px base
**Recommendation**: Change to `gap: 16px` (2 units of base 8px grid)

### m4: Button Padding Inconsistency
**Details**: Primary button padding varies: admin login = 16px all, dashboard outline = 6px 12px, mobile = 14px 20px
**Recommendation**: Standardize to 16px vertical, 24px horizontal for primary. 6px 12px for small outline.

### m5: Input Background Color
**Details**: Admin login inputs use `#e8e8e8`, some mockups use `neutral-100` (#f1f5f9)
**Recommendation**: Standardize to neutral-100 (#f1f5f9) for all input backgrounds

### m6: Therapist Login Gradient
**Details**: Therapist login uses multi-stop gradient `from-white via-[#eef5fc] to-[#7aaaf6]` — admin login uses single background
**Recommendation**: Decide on one approach. If gradient, use CSS variables. If solid, remove gradient.

### m7: Quick Action Widget Color
**Details**: Admin dashboard quick action button uses `#2563eb` (primary-600) — should use primary-500 for consistency
**Recommendation**: Use primary-600 for primary actions, primary-500 for secondary interactive elements

---

## Cross-Platform Inconsistencies

### Side-by-Side Comparison

| Element | Admin | Therapist | Mobile | Unified |
|---------|-------|-----------|--------|---------|
| Primary Blue | #387bd5 / #3b82f6 / #2563eb | #387bd5 / #2a73d4 | #387bd5 / #1e5ab8 | **#3b82f6** |
| Card Radius | 16px | 16px | 12px | **16px web, 12px mobile** |
| Button Radius | 8px | 8px | 12px | **8px** |
| Sidebar Width | 260px | 240px | N/A | **26px both** |
| Font Family | Inter | Inter | System | **Inter all** |
| Card Padding | 24px | 24px | 16px | **24px web, 16px mobile** |
| Base Font Size | 14px | 14px | 14px | **14px all** |
| Header Size | 20px | 22px | 20-26px | **20px web, mobile varies** |
| Input Radius | 8px | 8px | 12px | **8px web, mobile follows** |
| Shadow | 0 4px 15px rgba(0,0,0,0.02) | Similar | 0 2px 4px rgba(0,0,0,0.02) | **Standardized** |

---

## Design System Files Created

1. **tokens.json** — 4,312 bytes
   - Colors: primary (9-step), brand (3), neutral (11), text (6), border (3), surface (4), status (12)
   - Typography: fontFamily (2), fontSize (11), fontWeight (5), lineHeight (4), letterSpacing (5)
   - Spacing: 11-step 4px base scale
   - BorderRadius: 9-step scale
   - Shadows: 7 levels
   - Layout: admin/therapist/mobile specific values
   - Animation: durations and easings

2. **components.md** — 7,092 bytes
   - 13 component specs: Button, Card, Input, Modal, Sidebar, Bottom Tab, Table, Avatar, Badge, Toggle, Form, Page Header, Loading, Empty State
   - Each with variants, states, spacing rules

---

## Recommended Action Plan

### Immediate (This Week)
1. Apply tokens.json to web-admin global.css — replace all hardcoded values
2. Apply tokens.json to web-therapist global.css
3. Apply tokens.json to mobile theme.ts — replace hardcoded colors
4. Fix mobile emoji usage in marketing.tsx
5. Load Inter font in mobile app

### Short Term (Next 2 Weeks)
6. Fix all admin mockup HTML files to use CSS variables
7. Fix all therapist mockup HTML files to use CSS variables
8. Fix border radius inconsistencies across all platforms
9. Standardize sidebar width to 260px
10. Standardize font size scale

### Medium Term (Next Month)
11. Fix all remaining mockup inconsistencies (shadows, spacing, input styles)
12. Update production code to reference CSS variables instead of hardcoded values
13. Add empty/loading/error state designs to all mockups
14. Create dark mode tokens (if scope expands)
