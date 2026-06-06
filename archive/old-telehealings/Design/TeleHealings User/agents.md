# TeleHealings: AI Agent Development Blueprint

This document serves as a master blueprint for rebuilding or extending the TeleHealings mobile-first web application using a multi-agent AI system. It defines the required agent personas, the technology stack, and the step-by-step workflow required to construct the app.

---

## 🤖 AI Agent Personas

To build this app systematically, prompt your AI system using the following distinct roles:

### 1. The Architect Agent
- **Responsibility:** Establish the foundation, folder structure, and design system.
- **Primary Focus:** `global.css`, `buttons.css`, layout constraints, and the `:root` design tokens.
- **Rules:** Must strictly enforce an 8px spacing scale, CSS variables for all colors, and a mobile-first viewport container (`.mobile-app-container`).

### 2. The UI/UX Frontend Agent
- **Responsibility:** Build the static HTML and component-level CSS for all dashboard views.
- **Primary Focus:** `home.html`, `discover.html`, `care.html`, `profile.html`.
- **Rules:** Must write clean, semantic HTML. All custom CSS must be scoped appropriately. Must utilize keyframe animations (`slideFadeUp`) for smooth page loads.

### 3. The Logic & Workflow Agent
- **Responsibility:** Implement JavaScript functionality for global components and complex workflows.
- **Primary Focus:** `bottom-nav.js`, `heali-chat.js`, `book-appointment.js`, and multi-step forms.
- **Rules:** Use Vanilla JavaScript (ES6+). Avoid external libraries. Use DOM injection for global components to simulate a Single Page Application (SPA).

---

## 🛠 Technology Stack constraints
- **Markup:** HTML5 (Semantic, accessible)
- **Styling:** Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Media Queries)
- **Scripting:** Vanilla JavaScript (ES6+)
- **Architecture:** Pseudo-SPA (Separate HTML files that share injected JS components for navigation and overlays).

---

## 📋 Step-by-Step Construction Phases

### Phase 1: Foundation & Design System (Architect Agent)
**Task:** Create the core styling files that dictate how the app looks.
1. Create `/css/global.css`. Define the `:root` variables for colors (`#387bd5` primary), typography, and `vh`-based spacing.
2. Create the `.mobile-app-container` class to constrain the app on desktop but expand to 100% on mobile devices (`max-width: 380px`).
3. Create `/css/buttons.css` to define reusable `.btn-primary`, `.btn-secondary`, and `.btn-circle` classes.
4. Create `style-guide.html` as a living documentation of the UI components.

### Phase 2: Global Injected Components (Logic Agent)
**Task:** Build the reusable UI elements that exist on almost every page to keep HTML files DRY.
1. Create `/js/bottom-nav.js`. It should inject a glassmorphism floating nav bar into `<div id="bottom-nav-placeholder"></div>`. It must read the current URL to highlight the active tab.
2. Create the "More" fan-out menu logic inside the bottom nav to reveal secondary settings.
3. Create `/js/heali-chat.js`. It should inject a hidden bottom-sheet modal. Implement the auto-resizing textarea, user message injection, an animated typing indicator, and simulated AI response delays.

### Phase 3: Core Dashboards (Frontend Agent)
**Task:** Build the main user hubs.
1. **`index.html`:** Build the splash screen with a fade-in logo and timed redirect.
2. **`home.html`:** Implement the dynamic greeting, the horizontal Mood Tracker (with interactive SVG faces that expand a journal text area), and the upcoming appointments widget.
3. **`discover.html`:** Build the searchable content hub with horizontally scrolling categories and video cards featuring absolute-positioned play icons.
4. **`care.html`:** Implement the Therapist Discovery view. Use CSS `scroll-snap-type` for the horizontal carousel. Add an `IntersectionObserver` in JS to highlight the center card and blur adjacent cards.
5. **`profile.html` & `settings.html`:** Build list-group layouts for user preferences and CSS-only animated toggle switches.

### Phase 4: Complex Workflows (Frontend + Logic Agents)
**Task:** Build the specific linear tasks the user must complete.
1. **Session Booking:** Create `/workflows/session-booking/book-appointment.js`. Inject a dark overlay and a bottom-sheet modal. Implement mutually exclusive grid selections for Dates, Times, and Session Type (Video/Audio/Chat).
2. **Medical Profile Intake:** Create the `/workflows/medical-profile/` folder. Build `medical-profile-1.html` featuring a custom 4-step progress bar, custom styled radio buttons, and conditional logic (e.g., if a user selects "Yes" to hospitalisation, a hidden text area slides into view).
3. **Registration Success:** Create `profile-success.html` with celebration keyframe animations (`popIn` and `slideFadeUp`).

---

## 🎯 Prompting Strategy for the AI

When asking an AI agent to build a specific piece of this app, use the following prompt template:

> **System Prompt:** "You are the [Insert Agent Persona] for TeleHealings. Your task is to build [Insert File/Feature]."
> 
> **Context:** "We are using Vanilla HTML/CSS/JS. Our primary color is `--color-primary`. Elements must sit inside a `.mobile-app-container`."
> 
> **Acceptance Criteria:** 
> 1. [Requirement 1]
> 2. [Requirement 2]
> 3. [Requirement 3]
> 
> **Output format:** Provide only the raw, complete code blocks required.

---

## 🚀 Next Steps Post-Frontend
Once the AI has successfully generated the frontend layer according to this blueprint, create a new Epic focused on Backend Integration (Node.js/Python), WebRTC for video calling, and Database schemas.