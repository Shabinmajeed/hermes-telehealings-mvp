# Telehealings \-- Complete Product & Project Report

**Date:** June 2026 **Version:** 0.1.0 (Phase 1 \-- Core Infrastructure & User Registration) **Platform:** Mobile (iOS/Android) \+ Web (Admin)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)  
2. [Product Overview](#2-product-overview)  
3. [User Roles & Personas](#3-user-roles--personas)  
4. [Complete User Flows](#4-complete-user-flows)  
5. [Screen-by-Screen Specifications](#5-screen-by-screen-specifications)  
6. [Feature Specifications](#6-feature-specifications)  
7. [Tech Stack](#7-tech-stack)  
8. [System Architecture](#8-system-architecture)  
9. [Database Schema](#9-database-schema)  
10. [API Specifications](#10-api-specifications)  
11. [Design System](#11-design-system)  
12. [Implemented Features](#12-implemented-features)  
13. [Roadmap & Future Features](#13-roadmap--future-features)  
14. [Development Setup](#14-development-setup)  
15. [Known Issues](#15-known-issues)  
16. [Architecture Decision Records](#16-architecture-decision-records)

---

## 1\. Executive Summary

Telehealings is a continuity-first telehealth platform that connects users with licensed therapists for mental health services. It provides therapy sessions via video/audio/chat, appointment scheduling, secure messaging, AI-powered mental health support, and comprehensive platform administration.

The platform is built as a **mobile-first** application (React Native \+ Expo) with a **web-based admin portal**. It supports three distinct user roles \-- User (patient), Therapist, and Admin \-- each with dedicated interfaces and capabilities.

---

## 2\. Product Overview

### 2.1 Product Vision

Make mental health support accessible, affordable, and approachable. Telehealings provides a platform where users can discover licensed therapists, book and attend sessions, communicate securely, access self-help materials and libraries and get AI-powered support between sessions.

### 2.2 Product Description

Telehealings is a full-featured telehealth platform supporting the entire therapy journey:

- **Discovery:** Users browse and search licensed therapists by specialization, availability, rating, and price  
- **Onboarding:** Soft registration (minimal friction) followed by personalization (topic selection)  
- **Booking:** Schedule appointments with therapists based on real-time availability  
- **Sessions:** Video, audio, or chat-based therapy sessions with secure room management  
- **Communication:** Real-time messaging between users and therapists  
- **Payments:** Secure payment processing via Stripe, with refund and subscription support  
- **AI Support:** AI chatbot for mood tracking, journaling, and between-session support  
- **Administration:** Full platform management, user oversight, therapist verification, analytics

### 2.3 Target Audience

- **Primary:** Adults (18+) seeking mental health support  
- **Secondary:** Licensed therapists seeking a platform to manage their practice  
- **Tertiary:** Platform administrators managing operations

### 2.4 Key Differentiators

- Soft onboarding (no email/password required initially)  
- AI-powered mental health companion (Heali)  
- Multi-modal sessions (video, audio, chat)  
- Integrated mood tracking and journaling  
- Comprehensive admin analytics

---

## 3\. User Roles & Personas

### 3.1 Role: User (Patient)

**Persona:** A person seeking mental health support. May be dealing with stress, anxiety, relationship issues, or general wellness goals.

- Register via soft onboarding (name \+ T\&C) or full signup (email/phone \+ password)  
- Browse and search therapists  
- Book, reschedule, and cancel appointments  
- Attend video/audio/chat sessions  
- Send messages to therapists  
- Make payments and view payment history  
- Use AI chatbot (Heali)  
- Track mood and journal  
- Manage personal profile and preferences  
- View session history and notes  
- Leave reviews for therapists

### 3.2 Role: Therapist

**Persona:** A licensed mental health professional offering therapy services through the platform.

- Register and submit credentials for verification  
- Set availability schedule  
- Manage profile (bio, specializations, hourly rate, photo)  
- Accept or decline appointment requests  
- Conduct video/audio/chat sessions  
- Write session notes  
- Communicate with users via chat  
- View earnings and payment history  
- Manage notifications

### 3.3 Role: Admin

**Persona:** Platform operator responsible for managing users, therapists, content, and overall platform health.

- Admin login (username/password)  
- View and manage all users (CRUD)  
- View and manage all therapists (CRUD)  
- Verify therapist credentials  
- View all appointments and sessions  
- Access analytics dashboard (user growth, revenue, session stats)  
- Manage platform content  
- View financial reports  
- Manage promotions and offers  
- Access audit logs  
- Configure platform setting

---

### 6.5 Video/Audio Sessions

| Feature | Status | Description |
| :---- | :---- | :---- |
| Video Session | Planned | WebRTC-based video calling |
| Audio Session | Planned | Audio-only option |
| Chat Session | Planned | Text-based communication |
| Session Timer | Planned | Display elapsed/remaining time |
| Session Notes | Planned | Therapist writes post-session notes |
| Session Quality | Planned | Bandwidth indicator, reconnect handling |
| Waiting Room | Planned | Pre-session lobby |

### 6.6 Chat & Messaging

| Feature | Status | Description |
| :---- | :---- | :---- |
| Direct Messages | Planned | User-to-therapist messaging |
| Real-time | Planned | Socket.io for instant delivery |
| Read Receipts | Planned | Seen/unseen indicators |
| File Sharing | Planned | Images, documents |
| Message History | Planned | Full conversation history |
| Typing Indicator | Planned | Show when other party is typing |
| Push Notifications | Planned | Alert for new messages |
| Message Search | Planned | Search within conversations |
| Group Chat | Planned | Multi-participant conversations |

### 6.7 Payments

| Feature | Status | Description |
| :---- | :---- | :---- |
| Stripe Integration | Planned | Payment processing via Stripe |
| Card Payments | Planned | Visa, Mastercard, Amex |
| Save Card | Planned | Securely store payment method |
| Pay at Booking | Planned | Charge when booking appointment |
| Refunds | Planned | Full/partial refund processing |
| Subscriptions | Planned | Monthly/weekly therapy plans |
| Invoices | Planned | Auto-generated receipts |
| Promo Codes | Planned | Discount codes at checkout |
| Payment History | Planned | View all past transactions |
| Therapist Payout | Planned | Revenue distribution to therapists |

### 6.8 AI Chatbot (Heali)

| Feature | Status | Description |
| :---- | :---- | :---- |
| Conversational AI | Planned | Natural language chat interface |
| Mood Tracking | Planned | Daily mood logging with visual faces |
| Journaling | Planned | Guided journal prompts |
| Crisis Detection | Planned | Keyword/pattern detection for urgent help |
| Resource Suggestions | Planned | Relevant articles, exercises |
| Conversation History | Planned | View past AI conversations |
| Personality | Planned | Warm, supportive, non-judgmental tone |
| Therapist Escalation | Planned | Recommend booking session when needed |

### 6.9 Mood & Wellness Tracking

| Feature | Status | Description |
| :---- | :---- | :---- |
| Mood Check-in | Planned | Daily mood selection (5-level scale) |
| Mood History | Planned | Calendar view of mood over time |
| Journal Entries | Planned | Free-form text entries |
| Guided Exercises | Planned | Breathing, meditation, CBT exercises |
| Progress Insights | Planned | AI-generated mood patterns |
| Goal Setting | Planned | Set and track wellness goals |
| Streaks | Planned | Track daily engagement |

### 6.10 Content Library

| Feature | Status | Description |
| :---- | :---- | :---- |
| Articles | Planned | Mental health articles by category |
| Videos | Planned | Therapeutic video content |
| Audio | Planned | Guided meditations, sleep stories |
| Bookmarks | Planned | Save content for later |
| Categories | Planned | Anxiety, sleep, relationships, etc. |
| Search | Planned | Full-text search across content |
| Recommended | Planned | AI-curated content based on user topics |

### 6.11 Notifications

| Feature | Status | Description |
| :---- | :---- | :---- |
| Push Notifications | Planned | App-level alerts (FCM/APNs) |
| Email Notifications | Planned | Booking confirmations, reminders |
| In-App Bell | Planned | Notification center within app |
| Preferences | Planned | Configure which notifications to receive |
| Reminder Timing | Planned | 24h, 1h before appointment |

### 6.12 Admin Features

| Feature | Status | Description |
| :---- | :---- | :---- |
| Admin Login | DONE | Username/password authentication |
| User Management | DONE | View all users, paginated table |
| User CRUD | Planned | Create, read, update, delete users |
| Search & Filter | Planned | Search by name, filter by role, date |
| Export Data | Planned | CSV export of user data |
| Therapist Verification | Planned | Review and approve license credentials |
| Appointment Oversight | Planned | View all appointments across platform |
| Financial Reports | Planned | Revenue, bookings, therapist earnings |
| Analytics Dashboard | Planned | User growth, retention, engagement metrics |
| Content Management | Planned | CRUD for articles, videos, audio |
| Promo Management | Planned | Create and manage discount codes |
| Audit Logs | Planned | Track all admin actions |
| Platform Settings | Planned | Global configuration (fees, policies) |
| Communication | Planned | Broadcast messages to users/therapists |
| Compliance | Planned | HIPAA compliance tools, data export/delete |

---

## 7\. Tech Stack

### 7.1 Frontend

| Technology | Purpose |
| :---- | :---- |
| React Native | Mobile app framework |
| Expo SDK | Development platform, build tools |
| React | UI library |
| Expo Router | File-based routing |
| TypeScript | Type safety |
| Zustand | State management |
| AsyncStorage | Local data persistence |
| React Native SVG | Custom SVG icons |
| Reanimated | Smooth animations |
| expo-linear-gradient | Gradient backgrounds |
| expo-constants | Environment configuration |
| @react-native-async-storage | Cross-platform storage |

### 7.2 Backend

| Technology | Purpose |
| :---- | :---- |
| NestJS | Server framework |
| Node.js | Runtime |
| TypeScript | Type safety |
| Supabase JS | Supabase client (service role) |
| Prisma | ORM for PostgreSQL |
| bcrypt | Password hashing |
| class-validator | Request validation |
| class-transformer | DTO transformation |
| @nestjs/jwt | JWT handling |
| passport-jwt | JWT strategy |
| @nestjs/swagger | API documentation |
| @nestjs/terminus | Health checks |
| helmet | Security headers |
| Stripe | Payment processing |
| Socket.io | Real-time communication |
| uuid | UUID generation |

### 7.3 Infrastructure

| Technology | Purpose |
| :---- | :---- |
| Supabase | PostgreSQL database \+ Auth \+ Storage |
| Vercel (planned) | Frontend hosting (web) |
| Railway (planned) | Backend hosting |
| Stripe | Payment processing |
| Twilio (planned) | SMS for phone OTP |
| FCM/APNs (planned) | Push notifications |

---

## 12\. Implemented Features

### Phase 1 \-- Core Infrastructure (Current)

| Feature |
| :---- |
| Soft Onboarding (name \+ T\&C) |
| Personalisation (topic selection) |
| Admin Login |
| Admin Dashboard (user list) |
| User CRUD API |
| Profile CRUD API |
| Email/Password Auth API |
| Phone OTP UI |
| Signup flow screens |
| Zustand auth store |
| API client (auto-detect IP) |
| Swagger API docs |
| Database schema |
| Admin seed script |

---

## 13\. Roadmap & Future Features

### Phase 2 \-- Authentication & User Management

- Phone OTP send/verify (Supabase Auth \+ Twilio)  
- Email/password login (frontend wiring)  
- Google OAuth integration  
- Apple OAuth integration  
- Password reset flow  
- User profile screen (frontend)  
- Auth state validation on app launch

### Phase 3 \-- Therapist Features

- Therapist registration flow  
- Therapist verification workflow (admin)  
- Therapist profile management  
- Availability slot management  
- Therapist search and discovery  
- Therapist detail page  
- Therapist dashboard

### Phase 4 \-- Appointments & Scheduling

- Appointment booking flow  
- Calendar view  
- Appointment status management  
- Reschedule and cancel  
- Appointment notifications  
- Recurring appointments

### Phase 5 \-- Video/Audio Sessions

- WebRTC video calling  
- Audio-only sessions  
- Chat-based sessions  
- Session timer  
- Session notes  
- Waiting room

### Phase 6 \-- Chat & Messaging

- Real-time messaging (Socket.io)  
- Conversation list  
- File/image sharing  
- Read receipts  
- Push notifications for messages

### Phase 7 \-- Payments

- Stripe payment integration  
- Payment at booking  
- Refund processing  
- Subscription plans  
- Invoice generation  
- Promo codes  
- Payment history

### Phase 8 \-- AI Chatbot (Heali)

- Conversational AI interface  
- Mood tracking  
- Journaling  
- Crisis detection  
- Content recommendations  
- Conversation history

### Phase 9 \-- Admin Features

- Full user CRUD  
- Therapist verification  
- Analytics dashboard  
- Financial reports  
- Content management  
- Promo management  
- Audit logs  
- Platform settings

### Phase 10 \-- Deployment & DevOps

- CI/CD pipeline  
- Production deployment  
- Environment management  
- Monitoring and alerting  
- Database backups  
- Performance optimization

---

