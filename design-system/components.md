# TeleHealings Component Specification

## Button

### Primary Button
- **Usage**: Main call-to-action on a page/screen
- **Background**: `primary-600` (#2563eb)
- **Text**: white, `fontWeight: 600`, `fontSize: 16px` (web) / `15px` (mobile)
- **Padding**: `16px` vertical, `24px` horizontal (web) / `14px` vertical, `20px` horizontal (mobile)
- **Border Radius**: `8px`
- **Height**: `48px` (web) / `44px` (mobile)
- **States**:
  - Hover: `primary-700` (#1d4ed8)
  - Disabled: `neutral-300` background, `neutral-400` text
  - Loading: show spinner, text remains

### Secondary Button
- **Usage**: Secondary actions, paired with primary
- **Background**: white
- **Border**: `1px solid neutral-300`
- **Text**: `neutral-700`, `fontWeight: 600`
- **Border Radius**: `8px`
- **States**:
  - Hover: `neutral-50` background
  - Active: `neutral-100` background

### Outline Button (Small)
- **Usage**: Toolbar actions, table row actions
- **Background**: transparent
- **Border**: `1px solid neutral-300`
- **Text**: `neutral-700`, `fontSize: 12px`, `fontWeight: 600`
- **Padding**: `6px 12px`
- **Border Radius**: `6px`
- **Icon**: 14px SVG, `neutral-500`

### Ghost Button
- **Usage**: Low-priority actions, navigation items
- **Background**: transparent
- **Text**: `neutral-600`
- **Border Radius**: `8px`
- **States**:
  - Hover: `neutral-50` background
  - Active: `primary-50` background, `primary-600` text

### Icon Button (Circle)
- **Usage**: Quick actions, floating action buttons
- **Size**: `48x48px` (standard), `32x32px` (compact)
- **Background**: `primary-600`
- **Icon**: white, `20px`
- **Border Radius**: `50%`
- **Shadow**: `lg`

---

## Card

### Default Card
- **Background**: white
- **Border Radius**: `16px`
- **Padding**: `24px`
- **Shadow**: `card` (0 4px 15px rgba(0,0,0,0.02))
- **Border**: none

### Interactive Card
- **Usage**: Clickable cards, list items
- **States**:
  - Hover: shadow `lg`, border `primary-200`
  - Active: `primary-50` background

### Stat Card (KPI)
- **Layout**: icon top-right, value large, label bottom-left, trend top-right
- **Border**: `1px solid neutral-200`
- **Border Radius**: `12px`
- **Padding**: `16px`
- **Value**: `fontSize: 20px`, `fontWeight: 700`, `text-primary`
- **Label**: `fontSize: 12px`, `neutral-600`
- **Trend**: `fontSize: 10px`, `primary-500`

---

## Input

### Text Input
- **Height**: `48px`
- **Background**: `neutral-100` (#f1f5f9)
- **Border**: `1px solid neutral-300`
- **Border Radius**: `8px`
- **Padding**: `12px 16px`
- **Font Size**: `15px`
- **Placeholder**: `neutral-400`
- **States**:
  - Focus: border `primary-500`, shadow `0 0 0 3px primary-100`
  - Error: border `error`, error message below in `error` color, `fontSize: 12px`
  - Disabled: `neutral-200` background, `neutral-400` text

### Input with Icon
- **Icon Position**: left, `16px` from edge
- **Icon Size**: `20px`
- **Icon Color**: `neutral-400` (default), `neutral-600` (focus)
- **Input Padding Left**: `48px`

### Search Input
- **Icon**: magnifying glass, left
- **Background**: white
- **Border**: `1px solid neutral-200`
- **Border Radius**: `8px`

---

## Modal / Dialog

### Standard Modal
- **Overlay**: `surface.overlay` (rgba(0,0,0,0.5))
- **Background**: white
- **Border Radius**: `16px`
- **Max Width**: `480px` (small), `640px` (medium), `960px` (large)
- **Padding**: `24px`
- **Shadow**: `modal`
- **Close Button**: top-right, `32x32px` icon button

### Bottom Sheet (Mobile)
- **Max Height**: `65vh` (as per project standard)
- **Border Radius**: `20px 20px 0 0`
- **Handle**: `40x4px`, `neutral-300`, centered top `8px`
- **Animation**: slide up `300ms` spring easing

---

## Sidebar Navigation

### Admin Sidebar
- **Width**: `260px`
- **Background**: white
- **Border Right**: `1px solid neutral-200`
- **Logo Section**: top, `padding: 24px`
- **Nav Item Height**: `44px`
- **Nav Item Padding**: `12px 24px`
- **Active Nav**: `primary-50` background, `primary-600` text, left `3px` accent bar
- **Icon Size**: `20px`
- **Font Size**: `14px`, `fontWeight: 500`

### Therapist Sidebar
- **Width**: `240px`
- Same structure as admin sidebar
- **Active Nav**: `primary-50` background, `primary-600` text

---

## Bottom Tab Bar (Mobile)

- **Height**: `64px`
- **Background**: white
- **Border Top**: `1px solid neutral-200`
- **Tab Count**: 4-5
- **Icon Size**: `24px`
- **Label Size**: `10px`
- **Active Color**: `primary-600`
- **Inactive Color**: `neutral-400`
- **Safe Area**: respect `env(safe-area-inset-bottom)`

---

## Table

### Data Table
- **Header Background**: `neutral-50`
- **Header Font**: `fontSize: 12px`, `fontWeight: 600`, `neutral-600`, uppercase
- **Row Height**: `56px`
- **Row Border Bottom**: `1px solid neutral-100`
- **Cell Padding**: `12px 16px`
- **Font Size**: `14px`
- **Hover**: `neutral-50` background
- **Pagination**: bottom, `fontSize: 13px`

---

## Avatar

- **Sizes**: `24px` (xs), `32px` (sm), `40px` (md), `48px` (lg), `64px` (xl)
- **Border Radius**: `50%`
- **Fallback**: `neutral-200` background with initials in `neutral-600`

---

## Badge / Tag

### Status Badge
- **Padding**: `4px 10px`
- **Border Radius**: `99px` (pill)
- **Font Size**: `11px`, `fontWeight: 600`
- **Variants**:
  - Success: `successLight` bg, `successDark` text
  - Warning: `warningLight` bg, `warningDark` text
  - Error: `errorLight` bg, `errorDark` text
  - Info: `infoLight` bg, `primary-700` text
  - Neutral: `neutral-100` bg, `neutral-600` text

### Filter Tag
- **Padding**: `6px 12px`
- **Border Radius**: `6px`
- **Background**: `primary-50`
- **Text**: `primary-700`
- **Close Icon**: `12px`, right side

---

## Toggle Switch

- **Width**: `44px`, **Height**: `24px`
- **Track**: `neutral-300` (off), `primary-500` (on)
- **Thumb**: white, `20px`, shadow `sm`
- **Border Radius**: `99px`
- **Transition**: `200ms` ease

---

## Form Layout

### Form Group
- **Label**: `fontSize: 13px`, `fontWeight: 600`, `neutral-700`, margin-bottom `6px`
- **Input**: full width
- **Helper Text**: `fontSize: 12px`, `neutral-500`, margin-top `4px`
- **Error Text**: `fontSize: 12px`, `error`, margin-top `4px`
- **Spacing Between Groups**: `20px`

### Form Row
- **Layout**: flex, gap `16px`
- **Children**: equal width

---

## Page Header (Web)

- **Layout**: flex, space-between, align-end
- **Title**: `fontSize: 20px`, `fontWeight: 700`, `text-primary`
- **Accent Bar**: `3px` bottom border, `text-primary`, `borderRadius: 2px 2px 0 0`
- **Mascot**: right side, `48px` height
- **Border Bottom**: `2px solid neutral-200`
- **Margin Bottom**: `12px`

---

## Loading States

### Skeleton
- **Background**: `neutral-200`
- **Border Radius**: `4px` (text), `50%` (avatar), `8px` (card)
- **Animation**: pulse `2s` infinite

### Spinner
- **Size**: `24px` (inline), `48px` (page)
- **Color**: `primary-500`
- **Animation**: rotate `1s` linear infinite

---

## Empty State

- **Icon**: `64px`, `neutral-300`
- **Title**: `fontSize: 18px`, `fontWeight: 600`, `neutral-700`
- **Description**: `fontSize: 14px`, `neutral-500`
- **Action**: primary button below
- **Max Width**: `320px`, centered
