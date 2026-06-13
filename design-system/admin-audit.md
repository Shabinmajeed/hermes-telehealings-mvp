# TeleHealings Admin Design Audit

**Date:** 2026-06-08
**Scope:** 11 page mockups + 1 sidebar component + global CSS
**Source:** `~/.hermes/kanban/workspaces/t_ee2c620e/Design/TeleHealings-Admin/`

---

## Global Design Tokens (from `css/global.css`)

### Colors (CSS Variables)
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#387bd5` | Brand primary |
| `--color-primary-600` | `#3b82f6` | Primary alt / focus states |
| `--color-primary-hover` | `#3169b8` | Hover state |
| `--color-surface` | `#ffffff` | Card backgrounds |
| `--color-page-bg` | `#f0f2f5` | Page background |
| `--color-text` | `#111827` | Body text |
| `--color-text-heading` | `#0f172a` | Headings |
| `--color-muted` | `#6b7280` | Muted text |
| `--color-muted-light` | `#94a3b8` | Light muted / sub-text |
| `--color-border` | `#d1d5db` | Borders |
| `--color-border-light` | `#e2e8f0` | Light borders |
| `--color-border-extra-light` | `#f1f5f9` | Extra light / row borders |
| `--color-accent-blue-light` | `#e2effb` | Blue accent bg |
| `--color-accent-green` | `#22c55e` | Success text |
| `--color-accent-green-bg` | `#d1fae5` | Success bg (legacy) |
| `--color-accent-amber` | `#f59e0b` | Warning text |
| `--color-accent-amber-bg` | `#fef3c7` | Warning bg (legacy) |
| `--color-accent-red` | `#ef4444` | Danger text |
| `--color-accent-red-bg` | `#fff1f2` | Danger bg (legacy) |

### Typography
| Token | Value |
|---|---|
| `--font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `--h1-tablet-size` | `26px` |
| `--h1-size` | `24px` |
| `--h2-size` | `20px` |
| `--h3-size` | `16px` |
| `--h4-size` | `14px` |
| `--p-size` | `15px` |
| `--small-size` | `13px` |
| `--caption-size` | `12px` |
| `--tiny-size` | `11px` |
| `--micro-size` | `10px` |

### Spacing
| Token | Value |
|---|---|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `12px` |
| `--space-lg` | `16px` |
| `--space-xl` | `20px` |
| `--space-xxl` | `24px` |
| `--space-xxxl` | `32px` |
| `--page-padding` | `24px` |
| `--card-padding` | `24px` |
| `--card-padding-md` | `20px` |

### Radii
| Token | Value |
|---|---|
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `20px` |
| `--radius-xxl` | `24px` |
| `--radius-pill` | `999px` |
| `--radius-button` | `30px` |
| `--radius-circle` | `50%` |

### Shadows
| Token | Value |
|---|---|
| `--shadow-1` | `0 6px 16px rgba(0,0,0,0.04)` |
| `--shadow-2` | `0 10px 25px rgba(0,0,0,0.08)` |
| `--shadow-3` | `0 4px 20px rgba(0,0,0,0.03)` |
| `--shadow-4` | `0 12px 35px rgba(0,0,0,0.03)` |
| `--shadow-5` | `0 10px 30px rgba(0,0,0,0.05)` |
| `--shadow-6` | `0 15px 35px rgba(0,0,0,0.08)` |

---

## Page-by-Page Analysis

---

## Page: `index.html` (Login)

**Colors:**
- Background: `#e5e5e5` (html element)
- Card bg: `#ffffff`
- Card shadow: `0 15px 35px rgba(0,0,0,0.08)`
- Input bg: `#e8e8e8`
- Input border: `#999999`
- Input text: `#000000`
- Input placeholder: `#a8a8a8`
- Input focus border: `#2b74d4`
- Button bg: `#2a73d4`
- Button hover: `#2361b5`
- Button text: `#ffffff`
- Link color: `#2a73d4`
- Footer bg: `#e5e4df`
- Footer text: `#000000`
- Brand title: uses `var(--color-primary-900)` (NOT defined in global.css)
- Brand subtitle: uses `var(--color-primary-700)` (NOT defined in global.css)
- Page title: `#4b4b4b`
- Icon color: `#000` / `#a8a8a8`

**Fonts:**
- Font family: `'Inter', sans-serif` (Google Fonts: 400, 500, 600, 700)
- Brand title: `var(--font-size-6xl)` (NOT defined in global.css)
- Brand subtitle: `var(--font-size-base)` (NOT defined in global.css)
- Page title: `26px / 700`
- Input: `15px / 500`
- Button: `16px / 600`
- Links: `13px / 600`
- Footer: `13px / 600`

**Spacing:**
- Header margin-top: `60px`
- Logo margin-bottom: `12px`
- Brand title margin-bottom: `var(--space-2)`
- Brand subtitle margin-bottom: `var(--space-9)` (NOT defined)
- Page title margin-bottom: `25px`
- Login wrapper max-width: `420px`
- Card body padding: `35px 35px 25px 35px`
- Input padding: `16px 16px 16px 48px`
- Input margin-bottom: `18px`
- Button padding: `16px`
- Button margin-top: `10px`, margin-bottom: `25px`
- Footer padding: `22px`

**Radii:**
- Card: `16px`
- Input: `8px`
- Button: `8px`

**Issues:**
1. Uses `var(--color-primary-900)` and `var(--color-primary-700)` which are NOT defined in global.css — these will silently fail.
2. Uses `var(--font-size-6xl)` and `var(--font-size-base)` which are NOT defined in global.css.
3. Uses `var(--space-9)` which is NOT defined in global.css.
4. Hardcoded `#2a73d4` for button instead of `var(--color-primary)` (`#387bd5`) — mismatch with design system primary.
5. Hardcoded `#2b74d4` for input focus instead of `var(--color-primary-600)` (`#3b82f6`).
6. Hardcoded `#4b4b4b` for page title — no matching token.
7. Hardcoded `#e5e4df` for footer bg — no matching token.
8. Hardcoded `#e5e5e5` for html background — no matching token.
9. Hardcoded `#e8e8e8` for input bg — no matching token.
10. Hardcoded `#999999` for input border — no matching token.
11. Hardcoded `#a8a8a8` for placeholder — close to `--color-muted-light` (`#94a3b8`) but not the same.
12. Login card padding (`35px`) differs from standard `--card-padding` (`24px`).
13. Penguin mascot positioned with `top: -170px; right: -150px` — layout-dependent, fragile.

---

## Page: `dashboard.html`

**Colors:**
- Card bg: `#ffffff`
- Card shadow: `0 4px 15px rgba(0,0,0,0.02)`
- KPI icon bg: `#3b82f6` (solid fill, white icon)
- KPI trend text: `#3b82f6`
- KPI value: `#0f172a`
- KPI label: `#475569`
- KPI arrow up: `#22c55e`
- KPI arrow down: `#ef4444`
- Bar chart this-week: `#2563eb`
- Bar chart last-week: `#94a3b8` at `opacity: 0.5`
- Legend line blue: `#2563eb`
- Legend line gray: `#94a3b8`
- Legend value: `#0f172a`
- Legend label: `#94a3b8`
- Grid lines: `#f1f5f9`
- Chart text: `#94a3b8`
- Insight bullet: `#475569`
- Insight text: `#334155`
- Quick action trigger: `#2563eb` bg, white icon
- Quick action shadow: `0 4px 15px rgba(37,99,235,0.4)`
- Quick action hover: `#1d4ed8`
- QA menu border: `#e2e8f0`
- QA menu header: `#94a3b8`
- QA menu item: `#334155`
- QA menu item hover: `#f8fafc` bg, `#0f172a` text
- QA menu icon: `#64748b`
- Info panel text: `#334155` italic
- Row gaps: `15px`

**Fonts:**
- Card title: `16px / 700`
- Card subtitle: `13px / 400`
- KPI value: `20px / 700`
- KPI label: `12px / 400`
- KPI trend: `10px / 400`
- Legend value: `14px / 700`
- Legend label: `11px / 400`
- Chart axis: `10px / 400`
- Insight list: `13px / 400`
- QA menu header: `12px / 700`
- QA menu item: `13px / 600`
- Info text: `14px / italic`

**Spacing:**
- Page padding: `24px 32px`
- Content gap: `20px`
- Card padding: `24px`
- KPI grid gap: `16px`
- KPI card padding: `16px`
- KPI top margin-bottom: `12px`
- KPI value margin-bottom: `4px`
- Chart height: `180px`
- Bar chart height: `160px`
- Row gaps: `15px`
- QA trigger: `56x56px`
- QA menu width: `240px`
- QA menu bottom offset: `70px`

**Radii:**
- Card: `16px`
- KPI card: `12px`
- KPI icon: `50%`
- Bar: `2px 2px 0 0`
- QA trigger: `50%`
- QA menu: `12px`

**Issues:**
1. KPI icon uses solid `#3b82f6` bg — other pages use `#eff6ff` bg with `#2563eb` icon (inconsistent).
2. KPI value is `20px` — analytics page uses `24px` for same element type.
3. KPI trend is `#3b82f6` — analytics page uses `#16a34a` (green) for up and `#dc2626` for down.
4. KPI label is `#475569` — analytics page uses `#64748b`.
5. Row gap is `15px` — all other pages use `20px`.
6. Quick action widget is `position: absolute; bottom: 40px; right: 40px` — unique to this page, no token.
7. Dashboard does NOT use the standard `.table-card` / `.clients-table` pattern — unique layout.
8. KPI arrow uses `#22c55e` / `#ef4444` — these match `--color-accent-green` and `--color-accent-red` but are hardcoded.

---

## Page: `analytics.html`

**Colors:**
- Card bg: `#ffffff`
- Card shadow: `0 4px 15px rgba(0,0,0,0.02)`
- Card border: `1px solid rgba(148, 163, 184, 0.1)`
- KPI icon bg: `#eff6ff`, icon color: `#2563eb`
- KPI trend up: `#16a34a`
- KPI trend down: `#dc2626`
- KPI value: `24px / #0f172a`
- KPI label: `#64748b`
- Bar fill: `#3b82f6`
- Table header: `#64748b`
- Table text: `#334155`
- Event name: `#0f172a`
- Chart grid: `#f1f5f9`
- Chart axis: `#94a3b8`
- Legend text: `#475569`
- Legend color box: `12x12px, 2px radius`
- Event link: `#2563eb`
- Modal width: `650px`

**Fonts:**
- Card title: `16px / 700`
- Card subtitle: `13px`
- KPI value: `24px / 700`
- KPI label: `13px`
- KPI trend: `11px / 600`
- Table header: `12px / 600` uppercase
- Table text: `14px`
- Event name: `14px / 600`
- Bar label: `11px`
- Legend: `12px`

**Spacing:**
- KPI grid: `repeat(4, 1fr)`, gap `16px`
- KPI card padding: `16px`
- KPI top margin-bottom: `12px`
- Chart height: `220px`
- Chart margin-left: `30px`
- Y-axis left: `-35px`
- X-axis padding-left: `30px`
- Table padding: `14px 0`
- Table header padding-bottom: `12px`
- Bar height: `6px`

**Radii:**
- Card: `16px`
- KPI card: `12px`
- KPI icon: `50%`
- Bar bg: `99px`
- Legend color: `2px`

**Issues:**
1. Card border `rgba(148,163,184,0.1)` — not used on other pages' cards.
2. KPI value `24px` vs dashboard `20px` — same component, different sizes.
3. KPI trend colors (`#16a34a`/`#dc2626`) vs dashboard (`#3b82f6` only) — inconsistent.
4. KPI label `#64748b` vs dashboard `#475569` — same element, different colors.
5. Chart height `220px` vs dashboard `180px` — inconsistent.
6. Bar fill `#3b82f6` vs dashboard bar `#2563eb` — same concept, different blues.
7. Table header `12px uppercase` vs other pages `13px` — inconsistent.

---

## Page: `clients.html`

**Colors:**
- Table card bg: `#ffffff`
- Table card shadow: `0 4px 15px rgba(0,0,0,0.02)`
- Table header: `#64748b`
- Table text: `#334155`
- User name: `#0f172a`
- User email: `#64748b`
- Sub text: `#94a3b8`
- Row border: `#f1f5f9`
- Advanced filters bg: `#f8fafc`
- Advanced filters border: `#e2e8f0`
- Filter label: `#64748b`
- Filter select bg: `#ffffff`
- Filter select border: `#cbd5e1`
- Filter tag bg: `#eff6ff`, text: `#2563eb`, border: `#bfdbfe`
- Filter tag hover: `#dbeafe`
- Filter tag add bg: `#ffffff`, border: `dashed #cbd5e1`, text: `#64748b`
- Data transfer check bg: `#f0fdf4`, border: `#bbf7d0`, text: `#475569`
- Data transfer check strong: `#166534`
- Modal overlay: `rgba(15,23,42,0.4)`, blur `4px`
- Modal card shadow: `0 20px 40px rgba(0,0,0,0.1)`
- Modal header bg: `#f8fafc`
- Modal footer bg: `#fafafa`
- Status select danger: `#dc2626`

**Fonts:**
- User count: `16px / 400`, strong: `700`
- Search input: `14px`
- Button: `14px / 600`
- Table header: `13px / 500`
- Table text: `14px`
- User name: `14px / 600`
- User email: `12px`
- Sub text: `11px`
- Filter label: `12px / 700` uppercase
- Filter select: `13px`
- Filter tag: `13px / 600`
- Form label: `12px / 600`
- Form input: `14px`
- Data transfer: `13px`

**Spacing:**
- Page padding: `24px 32px`
- Content gap: `20px`
- Toolbar margin-bottom: `10px`
- Toolbar gap: `16px`
- Search width: `240px`
- Search input padding: `10px 16px 10px 38px`
- Button padding: `10px 20px`
- Table card padding: `24px 32px`
- Table card gap: `20px`
- Table header padding-bottom: `16px`
- Table row padding: `16px 0`
- Pagination padding-top: `16px`
- Advanced filters padding: `16px 24px`
- Advanced filters margin-bottom: `20px`
- Filter group gap: `8px`
- Avatar: `36x36px`
- User cell gap: `12px`
- Modal header padding: `20px 24px`
- Modal body padding: `24px`
- Modal body gap: `16px`
- Modal footer padding: `16px 24px`
- Form group gap: `6px`
- Form input padding: `10px 12px`
- Form row gap: `16px`

**Radii:**
- Button: `99px`
- Search input: `99px`
- Table card: `16px`
- Avatar: `50%`
- Action button: `50%`
- Page button: `8px`
- Advanced filters: `12px`
- Filter select: `8px`
- Filter tag: `99px`
- Modal card: `16px`
- Form input: `8px`
- Data transfer check: `8px`

**Issues:**
1. No significant inconsistencies — this page is the most well-aligned with global tokens.
2. `#f0fdf4` / `#bbf7d0` / `#166534` for data transfer check are hardcoded — no matching tokens in global.css.

---

## Page: `therapist.html`

**Colors:** Identical to `clients.html` for all shared components.

**Additional unique colors:**
- Status text in table: plain text (no colored badge) — differs from schedule page which uses badges.

**Fonts:** Identical to `clients.html`.

**Spacing:** Identical to `clients.html`.

**Radii:** Identical to `clients.html`.

**Issues:**
1. Therapist status is displayed as plain text (`Available`, `Full Capacity`, etc.) — schedule page uses colored badges for session statuses. Inconsistent status representation.
2. Table last column width: `4%` vs clients `7%` — minor inconsistency.
3. No status badge styling defined for therapist operational statuses.

---

## Page: `schedule.html`

**Colors:**
- Status badges:
  - `.status-upcoming`: `#e0f2fe` bg, `#1e40af` text
  - `.status-ongoing`: `#fef08a` bg, `#854d0e` text
  - `.status-completed`: `#dcfce7` bg, `#166534` text
  - `.status-cancelled`: `#fee2e2` bg, `#991b1b` text
- Calendar events:
  - `.high-demand`: `#fee2e2` bg, `#fecaca` border, `#991b1b` text
  - `.med-demand`: `#fef9c3` bg, `#fef08a` border, `#854d0e` text
  - `.low-demand`: `#dcfce7` bg, `#bbf7d0` border, `#166534` text
- Calendar header: `#f8fafc` bg
- Calendar header text: `#475569`
- Calendar border: `#e2e8f0`
- Calendar slot dashed border: `#e2e8f0`
- Calendar time text: `#94a3b8`
- View toggle active: `#ffffff` bg, `#0f172a` text, `0 1px 3px rgba(0,0,0,0.1)` shadow
- View toggle inactive: `transparent` bg, `#64748b` text
- Ongoing badge in tab: `#ef4444` bg, white text

**Fonts:**
- Status badge: `12px / 600`
- Calendar header: `13px / 600`
- Calendar time: `11px / 500`
- Event title: `12px / 700`
- Event text: `11px / 500`
- Tab count badge: `11px`
- View toggle: `13px / 600`

**Spacing:**
- Calendar grid: `80px` time col + `repeat(7, 1fr)`
- Calendar slot height: `60px`
- Calendar event: `left: 4px; right: 4px`, padding `8px`, gap `4px`
- View toggle padding: `4px`
- View toggle button padding: `6px 12px`

**Radii:**
- Status badge: `99px`
- Calendar event: `6px`
- Calendar grid: `12px`
- View toggle: `8px`
- View toggle button: `6px`

**Issues:**
1. Session status badge colors are unique to this page — no other page uses `#e0f2fe`/`#1e40af` for upcoming or `#fef08a`/`#854d0e` for ongoing.
2. Calendar demand colors reuse the same hex values as status badges but for a different semantic purpose.
3. View toggle active shadow `0 1px 3px rgba(0,0,0,0.1)` is not in the shadow tokens.
4. Tab count badge `#ef4444` matches `--color-accent-red` but is hardcoded.

---

## Page: `financials.html`

**Colors:**
- Transaction ID: `#475569` text, `#f8fafc` bg, `#e2e8f0` border, `monospace` font
- Amount positive: `#16a34a`
- Amount negative: `#0f172a`
- Amount value: `15px / 700`
- Status badges:
  - `.status-completed`: `#dcfce7` bg, `#166534` text
  - `.status-pending`: `#fef9c3` bg, `#854d0e` text
  - `.status-failed`: `#fee2e2` bg, `#991b1b` text
  - `.status-refunded`: `#f1f5f9` bg, `#475569` text
- Tier table header: `#64748b`, `12px uppercase`
- Tier input border: `#cbd5e1`
- Tier input focus: `#2563eb`
- Tier add button: `dashed` border, `#64748b` text
- Filter active: `#eff6ff` bg, `#2563eb` text, `#bfdbfe` border
- Payout modal commission: `#dc2626`
- Payout modal bonus: `#16a34a`
- Payout modal net amount: `#2563eb`
- Approve button: `#16a34a` bg/border
- Reject button: `#dc2626` text, `#fecaca` border

**Fonts:**
- Transaction ID: `13px / monospace`
- Amount: `15px / 700`
- Tier table header: `12px / 600`
- Tier input: `14px`
- Filter button: `12px / 600`
- Payout label: `13px`
- Payout value: `14px`
- Payout net label: `14px / 700`
- Payout net amount: `20px / 700`

**Spacing:**
- Tier table margin-bottom: `16px`
- Tier table header padding-bottom: `12px`
- Tier table cell padding: `12px 0`
- Tier input padding: `8px 12px`
- Tier input group left: `10px`
- Tier add button: `width: 100%`
- Payout summary gap: `8px`
- Payout summary margin-bottom: `16px`
- Payout net padding-top: `16px`

**Radii:**
- Transaction ID: `4px`
- Tier input: `6px`
- Filter button: `99px`

**Issues:**
1. Amount negative is `#0f172a` (dark) — should probably be a muted/gray color for better visual hierarchy.
2. Status badge `.status-refunded` uses `#f1f5f9`/`#475569` — unique to this page.
3. Approve button `#16a34a` is hardcoded — no token for success action buttons.
4. Reject button `#dc2626`/`#fecaca` — hardcoded, no token.
5. Amount `15px` — larger than standard `14px` table text, inconsistent with other table data.
6. Payout net amount `20px` — larger than card title `16px`, creates visual competition.

---

## Page: `content-management.html`

**Colors:**
- Content thumb bg: `#eff6ff`, icon: `#3b82f6`
- Content title: `#0f172a`
- Content tag: `#eff6ff` bg, `#2563eb` text, `#bfdbfe` border, `11px`
- User cell avatar: `28x28px` (smaller than standard `36x36px`)
- User name: `#334155`, `13px / 500`
- Metric text: `#64748b`, `11px / 500`
- Metric strong: `#0f172a`
- Metric star: `#f59e0b` fill + stroke
- Status badges:
  - `.status-published`: `#dcfce7` bg, `#166534` text
  - `.status-draft`: `#fef9c3` bg, `#854d0e` text
  - `.status-archived`: `#f1f5f9` bg, `#475569` text

**Fonts:**
- Content title: `14px / 600`
- Sub text: `11px`
- Content tag: `11px / 600`
- User name: `13px / 500`
- Metric: `11px / 500`
- Status badge: `12px / 600`

**Spacing:**
- Content thumb: `42x42px`
- Content cell gap: `12px`
- User cell gap: `10px` (vs standard `12px`)
- Content tags gap: `4px`
- Content tag padding: `2px 6px`
- Metrics gap: `4px`
- Metric item gap: `6px`

**Radii:**
- Content thumb: `8px`
- Content tag: `4px`
- Avatar: `50%`

**Issues:**
1. Avatar size `28x28px` — all other pages use `36x36px`. Inconsistent.
2. User cell gap `10px` — all other pages use `12px`. Inconsistent.
3. User name `13px / 500` — other pages use `14px / 600`. Inconsistent.
4. Content tag `11px` — smaller than filter tag `13px` on clients/therapist pages.
5. Status badge colors for `.status-archived` (`#f1f5f9`/`#475569`) are unique.
6. Star color `#f59e0b` matches `--color-accent-amber` but is hardcoded.

---

## Page: `communications.html`

**Colors:**
- Chat sidebar bg: `#f8fafc`
- Chat sidebar width: `340px`
- Chat item hover: `#f1f5f9`
- Chat item active: `#eff6ff` bg, `3px solid #2563eb` left border
- Chat item border-bottom: `#f1f5f9`
- Chat item name: `#0f172a`
- Chat item time: `#64748b`
- Chat item preview: `#64748b`
- Unread badge: `#ef4444` bg, white text
- Chat header bg: `#ffffff`
- Chat header name: `#0f172a`, `16px / 700`
- Chat header role: `#64748b`
- Escalation tag: `#fee2e2` bg, `#991b1b` text
- Received message bg: `#ffffff`, border `#e2e8f0`, text `#334155`
- Sent message bg: `#2563eb`, text `#ffffff`
- Message time: `#94a3b8`
- Message bubble radius: `12px`, top corner `4px`
- Chat input bg: `#f8fafc`
- Chat input border: `#cbd5e1`
- Chat input focus bg: `#ffffff`, border `#3b82f6`
- Chat send btn: `#2563eb`, hover `#1d4ed8`
- Chat messages bg: `#fafafa`
- Thread action btn: `#ffffff` bg, `#cbd5e1` border, `#334155` text
- Thread action danger: `#dc2626` text, `#fca5a5` border
- Ticket status badges:
  - `.status-open`: `#fee2e2` bg, `#991b1b` text
  - `.status-pending`: `#fef9c3` bg, `#854d0e` text
  - `.status-resolved`: `#dcfce7` bg, `#166534` text
- Link btn: `#eff6ff` bg, `#2563eb` text, `#bfdbfe` border
- Link btn hover: `#dbeafe` bg, `#93c5fd` border
- Link btn disabled: `#f1f5f9` bg, `#94a3b8` text, `#e2e8f0` border
- Ticket ID: `monospace`, `#64748b`, `#f8fafc` bg, `#e2e8f0` border
- Ticket subject: `600`, `#0f172a`
- Ticket preview: `12px`, `#64748b`
- Refund button: `#dc2626` bg/border

**Fonts:**
- Chat search: `14px`
- Chat filter: `11px / 600`
- Chat item name: `14px / 600`
- Chat item time: `11px`
- Chat item preview: `13px`
- Unread badge: `10px / 700`
- Chat header name: `16px / 700`
- Chat header role: `12px`
- Escalation tag: `12px / 600`
- Message bubble: `14px`, line-height `1.5`
- Message time: `11px`
- Chat input: `14px`
- Thread action: `12px / 600`
- Ticket ID: `13px / monospace`
- Ticket subject: `600`
- Ticket preview: `12px`
- Status badge: `12px / 600`
- Link btn: `12px / 600`

**Spacing:**
- Chat sidebar width: `340px`
- Chat search header padding: `20px`
- Chat filter gap: `8px`
- Chat filter margin-top: `14px`
- Chat item padding: `16px 20px`
- Chat item gap: `12px`
- Chat avatar: `44x44px`
- Chat header padding: `16px 24px`
- Chat header gap: `14px`
- Escalation tag padding: `6px 12px`
- Escalation tag gap: `6px`
- Thread actions padding: `12px 24px`
- Thread actions gap: `12px`
- Chat messages padding: `24px`
- Chat messages gap: `16px`
- Message max-width: `75%`
- Message bubble padding: `14px 18px`
- Message time margin-top: `6px`
- Chat input area padding: `16px 24px`
- Chat input area gap: `12px`
- Chat input padding: `14px 20px`
- Chat send btn: `44x44px`
- Ticket table padding: `16px 0`
- Status badge min-width: `90px`, padding `4px 10px`
- Link btn padding: `6px 12px`

**Radii:**
- Chat sidebar search: `8px`
- Chat filter: `99px`
- Chat avatar: `50%`
- Escalation tag: `6px`
- Message bubble: `12px` (top corner `4px`)
- Chat input: `24px`
- Chat send btn: `50%`
- Thread action: `6px`
- Status badge: `6px` (vs `99px` on other pages)
- Link btn: `6px`
- Ticket ID: `4px`

**Issues:**
1. Status badge radius is `6px` — ALL other pages use `99px` (pill). Major inconsistency.
2. Chat sidebar search input radius is `8px` — other pages use `99px` for search. Inconsistent.
3. Chat sidebar width `340px` — no matching token.
4. Chat messages bg `#fafafa` — unique, no token.
5. Message bubble radius `12px` with `4px` top corner — unique pattern.
6. Escalation tag colors `#fee2e2`/`#991b1b` match cancelled status but are hardcoded.
7. Unread badge `#ef4444` hardcoded — matches `--color-accent-red` but not using token.
8. Ticket status badge border-radius differs from all other status badges.

---

## Page: `compliance.html`

**Colors:**
- Status badges:
  - `.status-verified`: `#dcfce7` bg, `#166534` text, `#bbf7d0` border
  - `.status-pending`: `#fef9c3` bg, `#854d0e` text, `#fef08a` border
  - `.status-expired`: `#fee2e2` bg, `#991b1b` text, `#fecaca` border
  - `.status-missing`: `#f1f5f9` bg, `#475569` text, `#e2e8f0` border
- Action btn: `transparent` bg, `#cbd5e1` border, `#334155` text
- Action btn hover: `#f1f5f9` bg, `#94a3b8` border
- Doc preview area: `#f1f5f9` bg, `dashed #cbd5e1` border
- Doc preview icon: `#94a3b8`
- Doc preview text: `#475569`
- Meta label: `#64748b / 500`
- Meta value: `#0f172a / 600`
- Meta value highlight: `#2563eb`
- Meta row border: `#f1f5f9`
- Modal footer: `space-between` (unique — other pages use `flex-end`)
- Reject btn: `#dc2626` text, `#fecaca` border
- Approve btn: `#16a34a` bg/border
- Tab count badge: `#ef4444` bg, white text
- Empty state text: `#64748b`

**Fonts:**
- Status badge: `12px / 600`
- Action btn: `12px / 600`
- Meta text: `13px`
- Tab count: `11px`
- Empty state: `14px`

**Spacing:**
- Status badge: `4px 10px`, `min-width: 90px`
- Action btn: `6px 12px`
- Doc preview: `height: 200px`, padding implied
- Meta row: `padding-bottom: 8px`
- Meta gap: `8px`
- Modal body gap: `20px` (vs standard `16px`)

**Radii:**
- Status badge: `6px` (vs `99px` on most other pages)
- Action btn: `6px`
- Doc preview: `12px`

**Issues:**
1. Status badge radius `6px` — same issue as communications page. Most pages use `99px`.
2. Status badges have `border` property — other pages' status badges do NOT have borders. Inconsistent.
3. Action btn style (`border` + `background`) differs from other pages' action buttons (which are `transparent` + `no border`).
4. Modal footer uses `justify-content: space-between` — all other pages use `flex-end`.
5. Modal body gap `20px` — other pages use `16px`.
6. Approve button `#16a34a` hardcoded — same as financials.
7. Reject button `#dc2626`/`#fecaca` hardcoded — same as financials.
8. Tab count badge `#ef4444` hardcoded.

---

## Page: `Promotion.html`

**Colors:**
- Card border: `1px solid rgba(148, 163, 184, 0.1)` (same as analytics)
- Promo code: `#3b82f6` text, `#eff6ff` bg
- Target audience: `#475569`
- Status badges:
  - `.status-active`: `#dcfce7` bg, `#166534` text
  - `.status-scheduled`: `#e0f2fe` bg, `#1e40af` text
  - `.status-expired`: `#f1f5f9` bg, `#475569` text
- Broadcast banner: `#eff6ff` bg, `4px solid #3b82f6` left border, `#1e40af` text
- Broadcast strong: `#1e40af`
- Broadcast timestamp: `#3b82f6`, `11.5px`
- Textarea/select: `#cbd5e1` border, `8px` radius
- Publish button: `.btn-primary` style, `8px` radius

**Fonts:**
- Promo name: `14px / 600`
- Promo code: `13px / monospace`
- Target audience: `13px`
- Status badge: `12px / 600`
- Broadcast text: `13px`
- Broadcast timestamp: `11.5px`
- Form elements: `14px`

**Spacing:**
- Table card gap: `20px`
- Table row padding: `16px 0`
- Promo code margin-top: `4px`
- Target audience gap: `6px`
- Broadcast banner padding: `12px 16px`
- Broadcast margin-top: `16px`
- Editor gap: `16px`
- Editor textarea: `rows="3"`
- Editor sidebar width: `220px`

**Radii:**
- Card: `16px`
- Table card: `16px`
- Promo code: `4px`
- Status badge: `99px`
- Textarea/select: `8px`
- Publish button: `8px`
- Broadcast banner: `4px`

**Issues:**
1. `.status-scheduled` badge (`#e0f2fe`/`#1e40af`) is unique — not used on any other page.
2. `.status-expired` badge (`#f1f5f9`/`#475569`) differs from compliance's `.status-expired` (`#fee2e2`/`#991b1b`) — same name, different semantics.
3. Broadcast banner `#eff6ff`/`#3b82f6`/`#1e40af` colors are hardcoded — no matching tokens.
4. Editor sidebar width `220px` — no matching token.
5. Publish button uses `8px` radius — inconsistent with pill buttons (`99px`) on other pages.

---

## Page: `components/side-bar.html`

**Colors:**
- Sidebar bg: `#ffffff`
- Sidebar border-right: `1px solid rgba(0,0,0,0.05)`
- Sidebar width: `260px` (matches `--sidebar-width`)
- Brand text: `#000000`
- Search input bg: `#f8fafc`
- Search input border: `#e2e8f0`
- Nav item text: `#475569`
- Nav item hover bg: `#f1f5f9`, hover text: `#0f172a`
- Nav item active bg: `#1c52b8`, active text: `#fff`
- Nav item icon: `#64748b`
- Nav item active icon: `#fff`
- Badge bg: `#f04438`, text: white
- Nav separator: `#e2e8f0`
- User profile bg: `#fff`
- User profile border: `#f1f5f9`
- User profile shadow: `0 4px 15px rgba(0,0,0,0.05)`
- User profile img border: `4px solid #ffffff`
- User profile img shadow: `0 4px 10px rgba(0,0,0,0.08)`
- User name: `#0f172a`
- User role: `#64748b`
- Dropdown bg: `#ffffff`
- Dropdown border: `#e2e8f0`
- Dropdown shadow: `0 10px 30px rgba(0,0,0,0.1)`
- Dropdown item: `#475569`
- Dropdown item hover: `#f8fafc` bg, `#0f172a` text
- Dropdown divider: `#f1f5f9`
- Logout item: `#e11d48`
- Logout hover bg: `#fff1f2`, hover text: `#be123c`
- Toggle btn: `#64748b`
- Toggle hover bg: `#f1f5f9`, hover text: `#0f172a`
- Collapsed width: `88px` (matches `--sidebar-width-collapsed`)

**Fonts:**
- Brand: `20px / 700`
- Search: `14px`
- Nav item: `15px / 600`
- Badge: `11px / 700`
- User name: `14px / 700`
- User role: `12px`
- Dropdown item: `14px / 500`

**Spacing:**
- Sidebar padding: `30px 20px`
- Brand margin-bottom: `30px`
- Brand padding: `0 10px`
- Brand img: `45x45px` (inline style overrides `36x36px`)
- Brand gap: `12px`
- Search margin-bottom: `20px`
- Search input padding: `12px 12px 12px 40px`
- Nav menu gap: `4px`
- Nav item padding: `12px 16px`
- Nav item gap: `14px`
- Nav icon: `20x20px`
- Nav separator margin: `8px 16px`
- User profile padding: `16px`
- User profile img: `75x75px`
- User profile img margin-top: `-45px`
- User profile img margin-bottom: `10px`
- User profile margin-bottom: `25px`
- Dropdown bottom offset: `calc(100% + 10px)`
- Dropdown width: `220px`
- Dropdown padding: `8px 0`
- Dropdown item padding: `10px 16px`
- Dropdown item gap: `12px`
- Dropdown divider margin: `4px 0`

**Radii:**
- Sidebar search: `20px`
- Nav item: `8px`
- Badge: `10px`
- User profile: `12px`
- User profile img: `50%`
- Dropdown: `12px`

**Issues:**
1. Nav item active bg `#1c52b8` — does NOT match `--color-primary` (`#387bd5`) or `--color-primary-600` (`#3b82f6`). This is a completely different blue.
2. Badge bg `#f04438` — does NOT match `--color-accent-red` (`#ef4444`). Close but different.
3. Brand text `#000000` — no matching token.
4. Sidebar border `rgba(0,0,0,0.05)` — no matching token.
5. User profile shadow `0 4px 15px rgba(0,0,0,0.05)` — not in shadow tokens.
6. Dropdown shadow `0 10px 30px rgba(0,0,0,0.1)` — not in shadow tokens.
7. Logout color `#e11d48` — does NOT match `--color-accent-red` (`#ef4444`). Different red entirely.
8. Search input radius `20px` — inconsistent with page search inputs (`99px`).
9. Nav item radius `8px` — no matching token (closest is `--radius-sm: 8px`).

---

## Cross-Page Inconsistencies

### CRITICAL: Color Token Non-Usage
Almost every page hardcodes color values instead of using the CSS variables defined in `global.css`. The following tokens are defined but rarely used:
- `--color-primary` (`#387bd5`) — pages use `#2563eb`, `#2a73d4`, `#3b82f6`, `#1c52b8` instead
- `--color-accent-red` (`#ef4444`) — pages use `#dc2626`, `#f04438`, `#e11d48`
- `--color-accent-green` (`#22c55e`) — pages use `#16a34a`
- `--color-accent-green-bg` (`#d1fae5`) — pages use `#dcfce7`
- `--color-accent-amber` (`#f59e0b`) — pages hardcode `#f59e0b` (match by coincidence)
- `--color-accent-amber-bg` (`#fef3c7`) — pages use `#fef9c3`
- `--color-accent-red-bg` (`#fff1f2`) — pages use `#fee2e2`
- `--color-page-bg` (`#f0f2f5`) — never used
- `--color-text` (`#111827`) — never used
- `--color-text-heading` (`#0f172a`) — never used (hardcoded instead)
- `--color-muted` (`#6b7280`) — never used
- `--shadow-1` through `--shadow-6` — never used (all shadows are hardcoded)

### CRITICAL: Primary Blue Inconsistency
There are at least **5 different blues** used for what should be the primary action color:
| Hex | Where Used |
|---|---|
| `#1c52b8` | Sidebar nav active |
| `#2563eb` | Buttons, active states (most pages) |
| `#2a73d4` | Login button |
| `#2b74d4` | Login input focus |
| `#387bd5` | `--color-primary` token (rarely used) |
| `#3b82f6` | `--color-primary-600` token, KPI icons, focus states |

### CRITICAL: Status Badge Radius Inconsistency
| Radius | Pages |
|---|---|
| `99px` (pill) | Clients, Therapist, Schedule, Content Management, Promotion |
| `6px` (rounded rect) | Communications, Compliance |

### HIGH: Status Badge Border Inconsistency
| Style | Pages |
|---|---|
| No border | Clients, Therapist, Schedule, Content Management, Promotion, Financials |
| With border | Compliance (all badges have `border: 1px solid ...`) |

### HIGH: Heading Size Inconsistency
| Element | Size | Pages |
|---|---|---|
| Page header (`.header-tab`) | `20px / 700` | All app pages |
| Card title (`.card-title`) | `16px / 700` | Dashboard, Analytics, Promotion |
| KPI value | `20px / 700` | Dashboard |
| KPI value | `24px / 700` | Analytics |
| Section heading | `16px / 700` | Financials (Rates & Tiers) |
| Login page title | `26px / 700` | Login |

### HIGH: Avatar Size Inconsistency
| Size | Pages |
|---|---|
| `36x36px` | Clients, Therapist, Schedule, Financials, Compliance |
| `28x28px` | Content Management |
| `44x44px` | Communications (chat) |

### HIGH: Button Style Inconsistency
| Style | Pages |
|---|---|
| `border-radius: 99px` (pill) | Most pages |
| `border-radius: 8px` | Dashboard (btn-outline), Promotion (publish) |
| `border-radius: 6px` | Compliance (action-btn), Communications (thread-action, status badge) |
| `border: 1px solid #0f172a` | Financials (btn-outline), Compliance (btn-outline) |
| `border: 1px solid #cbd5e1` | Communications (btn-outline), Promotion (btn-outline) |
| No border | Clients, Therapist, Schedule, Content Management (btn-outline) |

### MEDIUM: Search Input Radius Inconsistency
| Radius | Pages |
|---|---|
| `99px` (pill) | All table pages |
| `8px` | Communications (chat search), Sidebar (nav search) |

### MEDIUM: Card Shadow Inconsistency
| Shadow | Pages |
|---|---|
| `0 4px 15px rgba(0,0,0,0.02)` | Table pages |
| `0 15px 35px rgba(0,0,0,0.08)` | Login card |
| `0 4px 15px rgba(0,0,0,0.02)` + border | Analytics, Promotion |
| `0 2px 10px rgba(0,0,0,0.01)` | Dashboard KPI cards |
| `0 10px 30px rgba(0,0,0,0.1)` | Sidebar dropdown |

### MEDIUM: Grid Gap Inconsistency
| Gap | Pages |
|---|---|
| `20px` | Most pages (content-wrapper) |
| `15px` | Dashboard (row gaps) |

### MEDIUM: Modal Width Inconsistency
| Width | Pages |
|---|---|
| `450px` | Communications (refund) |
| `500px` | Clients, Therapist, Content Management, Promotion |
| `650px` | Analytics, Compliance |

### MEDIUM: Modal Footer Justification
| Justify | Pages |
|---|---|
| `flex-end` | Most pages |
| `space-between` | Compliance (reject button on left) |

### LOW: Font Weight for User Names
| Weight | Pages |
|---|---|
| `600` | Most pages |
| `500` | Content Management |

### LOW: User Cell Gap
| Gap | Pages |
|---|---|
| `12px` | Most pages |
| `10px` | Content Management |

### LOW: Table Header Size
| Size | Pages |
|---|---|
| `13px / 500` | Most pages |
| `12px / 600 uppercase` | Analytics, Financials (tier table) |

### LOW: Pagination Info Style
All pages use `12px / 700 / #94a3b8 / uppercase / letter-spacing: 0.05em` — consistent.

### LOW: Tab Navigation Style
All pages use identical `.tabs-nav` / `.tab-btn` styling — consistent.

---

## Missing CSS Variables Referenced But Not Defined
The following `var()` references in `index.html` have no corresponding definition in `global.css`:
- `var(--color-primary-900)`
- `var(--color-primary-700)`
- `var(--font-size-6xl)`
- `var(--font-size-base)`
- `var(--space-9)`

---

## Recommendations

1. **Standardize primary blue**: Pick ONE primary action color. Recommend `#2563eb` (most common) or `#3b82f6` (already in tokens). Update sidebar nav active, login button, and all other blues to match.

2. **Standardize status badge radius**: Use `99px` (pill) everywhere. Update communications and compliance.

3. **Standardize status badge borders**: Either add borders to all or remove from compliance. Recommend no border for consistency with majority.

4. **Use CSS variables**: Replace all hardcoded hex values with the appropriate `var(--color-*)` tokens from global.css.

5. **Standardize avatar sizes**: Use `36x36px` for table avatars everywhere. Content Management should be updated.

6. **Standardize button borders**: `btn-outline` should have consistent border color. Recommend `1px solid #cbd5e1` (most common) or `1px solid #0f172a`.

7. **Standardize search input radius**: Use `99px` everywhere, including sidebar and chat.

8. **Standardize KPI value size**: Use `24px` (analytics) or `20px` (dashboard) consistently.

9. **Add missing token definitions**: Define `--color-primary-900`, `--color-primary-700`, `--font-size-6xl`, `--font-size-base`, `--space-9` in global.css.

10. **Standardize modal widths**: Use `500px` as default, `650px` for complex modals.

11. **Standardize approve/action button green**: Use `--color-accent-green` (`#22c55e`) or pick `#16a34a` and add as a token.

12. **Standardize danger/red button color**: Pick one red (`#dc2626` or `#ef4444`) and add as `--color-danger` token.

13. **Standardize card shadows**: Use `var(--shadow-1)` through `var(--shadow-6)` instead of hardcoding.

---

## Summary Statistics
- **Total HTML files audited**: 12 (11 pages + 1 component)
- **Unique hardcoded hex colors found**: 47+
- **CSS variables defined in global.css**: 60+
- **CSS variables actually used in pages**: ~5
- **Cross-page inconsistencies identified**: 20+
- **Missing token references**: 5
- **Pages with unique component patterns**: Dashboard (KPI grid), Communications (chat UI), Schedule (calendar), Compliance (document review)
