# TeleHealings — Style Guide

This document defines the design system for TeleHealings: colors, typography, spacing, radii, and components. Apply these rules across all pages by using the shared CSS in `css/global.css` and `css/buttons.css`.

## Design Tokens
- **Primary Color:** #387bd5 (accent / primary actions)
- **Primary Accent:** #3b82f6 (used for active states)
- **Background (app):** #ffffff
- **Page Background:** #f0f2f5
- **Text (primary):** #111827
- **Text (muted):** #6b7280
- **Border / Divider:** #d1d5db

## Typography
- **Font stack:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
- **Base font-size:** 16px
- **Scale:**
  - h1: 24px / 700
  - h2: 20px / 600
  - h3: 16px / 600
  - body / p: 15px / 400
  - small: 13px / 400

## Spacing (8px scale)
- XS: 4px
- S: 8px
- M: 12px
- L: 16px
- XL: 20px
- XXL: 24px

Use consistent spacing for margins, paddings and gaps. Prefer semantic utility classes (e.g. `.gap-m`, `.p-l`) where necessary.

## Radii & Elevation
- **Border radius (components):** 12px
- **Pill radius (buttons):** 30px
- **Shadow (card):** 0 10px 25px rgba(0,0,0,0.1)

## Buttons
- **Primary (pill):** background primary, white text, 56px height, 30px radius, font-weight 600.
- **Circle action:** 64px × 64px, primary background, circular, subtle shadow.

## Layout
- App container max-width: 380px; max-height: 760px. Center on large screens.
- Use an internal content padding of 20px (L) as default.

## Implementation Notes
- All pages should include `css/global.css` and `css/buttons.css`.
- Prefer tokens (CSS variables) declared in `:root` inside `global.css`.
- When making local overrides, keep them minimal and prefer utility classes.

If you'd like, I can now update all HTML pages to match the new tokens (spacing/typography) and run a pass to normalize common elements (headers, paragraphs, buttons). Reply if you want me to proceed with applying these tokens to every page.
