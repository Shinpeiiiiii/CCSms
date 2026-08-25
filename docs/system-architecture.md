# CCSms - System Architecture & Design

## Table of Contents

1. [System Overview](#1-system-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Deployment Architecture](#4-deployment-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Design](#7-database-design)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Caching Strategy](#9-caching-strategy)
10. [Security Architecture](#10-security-architecture)
11. [Data Flow Diagrams](#11-data-flow-diagrams)
12. [Module Breakdown](#12-module-breakdown)

---

## 1. System Overview

**CCSms** (College/Course Student Management System) is a full-stack web application for managing academic institutions. It provides role-based access for administrators, registrars, teachers, and students to manage departments, programs, curricula, subjects, sections, student enrollments, and applications.

### Core Capabilities

- Role-based access control (Admin, Registrar, Teacher, Student)
- Academic structure management (Departments, Programs, Curricula, Subjects, Sections)
- Student lifecycle management (Application, Admission, Enrollment, Grading)
- Teacher assignment and load management
- Email notifications and OTP verification
- Responsive UI with animations and skeleton loading states

### Roles & Permissions

| Role | Capabilities |
|---|---|
| **Admin** | Full access: user management, departments, programs, prerequisites, all academic modules |
| **Registrar** | Students, sections, programs, subjects, enrollment periods, application review, section subjects, academic loads |
| **Teacher** | Dashboard, programs, sections, subjects, curricula, grade management |
| **Student** | Dashboard, My Subjects, My Profile, enrollment form, application tracking |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                          │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  React   │  │  TanStack    │  │ Zustand  │  │  React Query  │  │
│  │  Router  │  │  React Table │  │  Store   │  │  (Server      │  │
│  │  v7      │  │  v8          │  │          │  │   State)      │  │
│  └──────────┘  └──────────────┘  └──────────┘  └───────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Feature Modules (10 modules)                    │  │
│  │  auth │ dashboard │ students │ accounts │ academic │ ...    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTPS / Axios
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVER (Express.js)                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Middleware Layer                          │  │
│  │  Rate Limiter │ Auth (JWT) │ Role │ Turnstile │ CORS        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  API Routes (18 route groups)                 │  │
│  │  /api/auth │ /api/students │ /api/department │ /api/program  │  │
│  │  /api/subject │ /api/section │ /api/curriculum │ ...        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               Service Layer │ Controller Layer               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                    │
│  │ MongoDB  │  │  Redis   │  │  Nodemailer  │                    │
│  │(Mongoose)│  │ (Cache)  │  │  (Gmail SMTP)│                    │
│  └──────────┘  └──────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | SPA with fast HMR and build |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with Radix UI primitives |
| **Client State** | Zustand 5 | Authentication state (persisted + cross-tab sync) |
| **Server State** | TanStack React Query 5 | API data fetching, caching, mutations |
| **Routing** | React Router DOM v7 | Client-side routing with role-based guards |
| **Forms** | react-hook-form + Zod v4 | Form management with schema validation |
| **Tables** | TanStack React Table v8 | Client-side data tables with sorting, filtering, pagination |
| **Backend** | Express.js 5 | RESTful API server |
| **Database** | MongoDB + Mongoose 9 | Document database with ODM |
| **Cache** | Redis 6 | Server-side response caching (5min TTL) |
| **Auth** | JWT + bcrypt | Stateless auth with hashed passwords |
| **Email** | Nodemailer (Gmail SMTP) | OTP verification, password reset, notifications |
| **Captcha** | Cloudflare Turnstile | Bot protection on login |
| **Container** | Docker + Docker Compose | Multi-service containerized deployment |
| **Hosting** | Railway | Cloud deployment platform |

---

## 4. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Railway (PaaS)                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Docker Compose                      │   │
│  │                                                  │   │
│  │  ┌──────────────┐  ┌──────────────────────┐    │   │
│  │  │   Frontend   │  │      Backend         │    │   │
│  │  │   (Vite)     │  │    (Express.js)      │    │   │
│  │  │   Port 5173  │  │    Port 5000         │    │   │
│  │  └──────────────┘  └──────────────────────┘    │   │
│  │                                                  │   │
│  │  ┌──────────────┐                               │   │
│  │  │    Redis     │                               │   │
│  │  │  Port 6379   │                               │   │
│  │  └──────────────┘                               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌───────────────────────────┐   │
│  │    MongoDB       │  │    Cloudflare (Workers)    │   │
│  │  (External)      │  │    college-portal.*        │   │
│  └──────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Docker Multi-Stage Build

| Stage | Base Image | Purpose |
|---|---|---|
| `base` | `node:20-slim` | Common dependencies |
| `development` | base + `nodemon` | Hot-reload dev server |
| `builder` | base + `npm ci` | Production build of client |
| `production` | base | Copy built assets + server, run with healthcheck |

### Environment Configuration

| Service | Key Environment Variables |
|---|---|
| **Server** | `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `REDIS_URL`, `TURNSTILE_SECRET_KEY`, `CORS_ORIGINS`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` |
| **Client** | `VITE_API_URL` |

---

## 5. Frontend Architecture

### Module Organization (Feature-First)

```
client/src/
├── modules/                    # Feature modules (self-contained)
│   ├── auth/                   # Authentication
│   │   ├── pages/              # Login, Register, ForgotPassword, ChangePassword
│   │   ├── components/         # Sidebar, Topbar, ProtectedRoute
│   │   ├── services/           # Auth API calls
│   │   ├── state/              # useAuthStore (Zustand)
│   │   └── hooks/              # useAuth
│   ├── dashboard/              # Admin/Registrar dashboard
│   ├── students/               # Student management
│   ├── accounts/               # Account management
│   ├── academic/               # 11 sub-modules (department, program, subject, etc.)
│   ├── enrollmentform/         # Public enrollment form
│   ├── admission/              # Application review
│   ├── enrollment-review/      # Enrollment review
│   └── home/                   # Public landing page
├── shared/                     # Cross-module shared code
│   ├── layouts/                # AuthLayout, DashboardLayout, MainLayout
│   └── components/             # RoleProtectedRoute, StatsCard, skeletons
├── components/                 # Reusable UI components (14 categories)
│   ├── actions/                # Action buttons
│   ├── badge/                  # Status badges
│   ├── buttons/                # Button variants
│   ├── cards/                  # Card components
│   ├── forms/                  # Form fields, selectors
│   ├── table/                  # DataTable, columns
│   ├── modal/                  # Dialog components
│   ├── toast/                  # Notification toasts
│   ├── search/                 # Search inputs
│   └── shadcn/                 # Radix UI primitives
├── hooks/                      # Global custom hooks
├── services/                   # Axios instance + interceptors
├── constants/                  # Roles, Query keys
├── context/                    # ConfirmModal context
├── providers/                  # QueryClientProvider
├── features/                   # Redux slices (legacy authSlice)
└── lib/                        # Utility functions (cn, etc.)
```

### State Management

```
┌───────────────────────────────────────────────┐
│            Client State Architecture           │
│                                                │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │    Zustand        │  │   Redux Toolkit  │  │
│  │  (Auth Store)     │  │  (Legacy auth)   │  │
│  │                   │  │                  │  │
│  │  - user           │  │  - authSlice     │  │
│  │  - accessToken    │  │                  │  │
│  │  - isAuthenticated│  │                  │  │
│  │  - persist +      │  │                  │  │
│  │    BroadcastChannel│ │                  │  │
│  └──────────────────┘  └──────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │        TanStack React Query v5           │  │
│  │  - API data caching (60s staleTime)      │  │
│  │  - Automatic refetching                  │  │
│  │  - Optimistic updates via mutations      │  │
│  │  - Query key management                  │  │
│  └──────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### Routing Strategy

- **Role-based route guards:** `ProtectedRoute` (authenticated) and `RoleProtectedRoute` (role-specific)
- **Lazy loading:** Available via `app/router/Router.jsx` (not yet active); current router uses eager imports
- **Route groups:** Public routes (home, about, enrollment form), Auth routes (login, register), Protected routes (dashboard, academic modules)
- **Idle timeout:** 5-hour inactivity triggers auto-logout with user alert

### Key Libraries

| Library | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| React Router DOM | 7.16 | Client-side routing |
| Zustand | 5.0 | Auth state management |
| TanStack React Query | 5.101 | Server state caching |
| TanStack React Table | 8.21 | Data table rendering |
| react-hook-form | 7.80 | Form state management |
| Zod | 4.4 | Schema validation |
| Framer Motion | 12.x | Animations |
| shadcn/ui | 4.x | UI component library |
| Axios | 1.17 | HTTP client |

---

## 6. Backend Architecture

### Request Lifecycle

```
Client Request
      │
      ▼
┌─────────────┐
│  Rate       │  100 req/15min (global)
│  Limiter    │  5 req/15min (login-specific)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Turnstile  │  Cloudflare captcha verification
│  Middleware  │  (login only, bypassable in dev)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  CORS       │  Whitelist: localhost:5173, *.workers.dev
│  Middleware  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Auth       │  JWT access token verification
│  Middleware  │  tokenVersion check against DB
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Role       │  Role-based authorization
│  Middleware  │  Admin | Registrar | Teacher | Student
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Controller │  Request handling, input validation
│  Layer      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Service    │  Business logic, caching, DB operations
│  Layer      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Mongoose   │  MongoDB operations
│  Models     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Redis      │  Response caching (300s TTL)
│  Cache      │
└─────────────┘
```

### API Route Groups (18 total)

| Mount Point | Module | Key Endpoints |
|---|---|---|
| `/api/auth` | Authentication | login, register, refresh, logout, forgot-password, reset-password, activate, change-password |
| `/api/students` | Students | CRUD, assign-section, get-by-section |
| `/api/accounts` | Accounts | User CRUD (admin only) |
| `/api/department` | Departments | CRUD |
| `/api/program` | Programs | CRUD |
| `/api/subject` | Subjects | CRUD, versioning |
| `/api/curriculum` | Curricula | CRUD, versioning, lock/unlock |
| `/api/section` | Sections | CRUD |
| `/api/academicyear` | Academic Years | CRUD, status transitions |
| `/api/enrollmentperiod` | Enrollment Periods | CRUD |
| `/api/prerequisite` | Prerequisites | CRUD |
| `/api/subjectassignment` | Subject Assignments | CRUD |
| `/api/teacherassignment` | Teacher Assignments | CRUD |
| `/api/student-subject` | Student Subjects | CRUD, grade recording |
| `/api/section-subject` | Section Subjects | CRUD, scheduling |
| `/api/student-applications` | Applications | Submit, review, timeline |
| `/api/verification` | OTP Verification | Send, verify |
| `/api/health` | Health Check | Status endpoint |

### Module Pattern (per module)

```
module/
├── routes/         # Express Router definitions
├── controllers/    # Request/response handling
├── services/       # Business logic + DB operations
└── models/         # Mongoose schema definitions
```

---

## 7. Database Design

### Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │   Student    │       │  Application │
│──────────────│       │──────────────│       │──────────────│
│ firstName    │◄──┐   │ studentNumber│       │ applicationNo│
│ lastName     │   │   │ firstName    │       │ email        │
│ email (unique│   │   │ program ─────┼──┐    │ program ─────┼──┐
│ password     │   │   │ section ─────┼──┼┐   │ section ─────┼──┼┐
│ role         │   │   │ yearLevel    │  ││   │ status       │  ││
│ tokenVersion │   └───┤ user ────────┤  ││   │ reviewedBy ──┼──┤│
│ isActive     │       │ application ─┼──┤│   └──────────────┘  ││
│ mustChangePw │       └──────────────┘  ││                     ││
│ failedLogin  │              │           ││                     ││
│ lockUntil    │              │           ││                     ││
└──────────────┘              │           ││                     ││
                              │           ││                     ││
┌──────────────┐              │           ││                     ││
│  Department  │              │           ││                     ││
│──────────────│              │           ││                     ││
│ departmentCode│             │           ││                     ││
│ departmentName│◄─┐         │           ││                     ││
│ departmentHead│  │         │           ││                     ││
└──────────────┘  │         │           ││                     ││
                  │         │           ││                     ││
┌──────────────┐  │         │           ││                     ││
│   Program    │──┘         │           ││                     ││
│──────────────│◄───────────┼───────────┼┘                     ││
│ programCode  │            │           │                      ││
│ programName  │            │           │                      ││
│ department ──┼──┐         │           │                      ││
│ durationYears│  │         │           │                      ││
└──────────────┘  │         │           │                      ││
                  │         │           │                      ││
┌──────────────┐  │         │           │                      ││
│  Curriculum  │──┘         │           │                      ││
│──────────────│            │           │                      ││
│ curriculumCode│           │           │                      ││
│ program ─────┼──┐        │           │                      ││
│ academicYear ─┼──┼─┐     │           │                      ││
│ version      │  │ │     │           │                      ││
│ isCurrentVer │  │ │     │           │                      ││
│ lock (object)│  │ │     │           │                      ││
└──────────────┘  │ │     │           │                      ││
                  │ │     │           │                      ││
┌──────────────┐  │ │     │           │                      ││
│CurriculumSubj│  │ │     │           │                      ││
│──────────────│  │ │     │           │                      ││
│ curriculum ──┼──┘ │     │           │                      ││
│ subject ─────┼──┐ │     │           │                      ││
│ yearLevel    │  │ │     │           │                      ││
│ semester     │  │ │     │           │                      ││
│prerequisites │  │ │     │           │                      ││
└──────────────┘  │ │     │           │                      ││
                  │ │     │           │                      ││
┌──────────────┐  │ │     │           │                      ││
│   Subject    │──┘ │     │           │                      ││
│──────────────│    │     │           │                      ││
│ subjectCode  │    │     │           │                      ││
│ subjectName  │    │     │           │                      ││
│ units        │    │     │           │                      ││
│ category     │    │     │           │                      ││
│ version      │    │     │           │                      ││
│parentSubject │    │     │           │                      ││
│isCurrentVer  │    │     │           │                      ││
└──────────────┘    │     │           │                      ││
                    │     │           │                      ││
┌──────────────┐    │     │           │                      ││
│  Section     │────┼─────┼───────────┼──────────────────────┘┘
│──────────────│    │     │           │
│ sectionCode  │    │     │           │
│ curriculum ──┼────┘     │           │
│ academicYear ───────────┘           │
│ yearLevel    │                      │
│ capacity     │                      │
│ adviser ─────┼── (ref User)         │
└──────────────┘                      │
                                      │
┌──────────────┐    ┌──────────────┐  │
│  Enrollment  │    │AcademicYear  │  │
│──────────────│    │──────────────│  │
│ student ─────┼──┐ │ acadYearCode │  │
│ academicYear ─┼──┼─│ startDate    │  │
│enrollPeriod ─┼──┼─│ endDate      │  │
│ section ─────┼──┼─│ status       │  │
│ semester     │  │ └──────────────┘  │
│ status       │  │                   │
└──────────────┘  │ ┌──────────────┐  │
                  │ │EnrollPeriod  │  │
┌──────────────┐  │ │──────────────│  │
│StudentSubject│  │ │academicYear ─┼──┘
│──────────────│  │ │ startDate    │
│ student ─────┼──┘ │ endDate      │
│ subject ─────┼──┐ │ status       │
│ section ─────┼──┼─└──────────────┘
│ academicYear ─┼──┼─┐
│ semester     │  │ │ ┌──────────────┐
│ finalGrade   │  │ │ │   Teacher    │
│ status       │  │ │ │  Assignment  │
└──────────────┘  │ │ │──────────────│
                  │ │ │subjectAssign─┼──┐
┌──────────────┐  │ │ │teacher ─────┼──┼── (ref User)
│SectionSubject│  │ │ │status       │  │
│──────────────│  │ │ └──────────────┘  │
│ section ─────┼──┼─┘                   │
│ subject ─────┼──┘ ┌──────────────┐   │
│ instructor ──┼────│SubjectAssign │───┘
│ room         │    │──────────────│
│ day/time     │    │ section ─────┼──┐
│ semester     │    │currSubject ──┼──┼── (ref CurriculumSubject)
└──────────────┘    └──────────────┘  │
                                      │
┌──────────────┐    ┌──────────────┐  │
│  StudentApp  │    │Verification  │  │
│──────────────│    │──────────────│  │
│ appNumber    │    │ email        │  │
│ program ─────┼────│ code         │  │
│ section ─────┼────│ purpose      │  │
│ status       │    │ expiresAt    │  │
│ reviewedBy ──┼── (ref User)      │  │
└──────────────┘    └──────────────┘  │
                                      │
┌──────────────┐                      │
│  AppTimeline │                      │
│──────────────│                      │
│ application ─┼── (ref Application) │
│ performedBy ─┼── (ref User)        │
│ action       │                      │
└──────────────┘                      │
                                      │
┌──────────────┐                      │
│   Prereq.    │                      │
│──────────────│                      │
│ subject ─────┼── (ref Subject)     │
│requiredSubj ─┼── (ref Subject)     │
│ curriculum ──┼── (ref Curriculum)  │
│ type         │                      │
│ minimumGrade │                      │
└──────────────┘                      │
```

### Key Models (19 total)

| Model | Purpose | Key Fields |
|---|---|---|
| **User** | System users | email, password, role, tokenVersion, isActive, mustChangePassword |
| **Student** | Student records | studentNumber, program, section, yearLevel, studentType, status |
| **Department** | Academic departments | departmentCode, departmentName, departmentHead |
| **Program** | Academic programs | programCode, programName, department, durationYears |
| **Subject** | Course subjects | subjectCode, subjectName, units, category, version (versioned) |
| **Curriculum** | Program curricula | curriculumCode, program, academicYear, version, lock (versioned) |
| **CurriculumSubject** | Curriculum-subject mapping | curriculum, subject, yearLevel, semester, prerequisites |
| **Section** | Class sections | sectionCode, curriculum, academicYear, adviser, capacity |
| **AcademicYear** | Academic years | academicYearCode, startDate, endDate, status |
| **EnrollmentPeriod** | Enrollment windows | academicYear, startDate, endDate, status |
| **Enrollment** | Student enrollments | student, academicYear, section, semester, status |
| **StudentSubject** | Student subject records | student, subject, section, finalGrade, status |
| **SectionSubject** | Section scheduling | section, subject, instructor, room, day, startTime, endTime |
| **SubjectAssignment** | Subject-to-section mapping | section, curriculumSubject, status |
| **TeacherAssignment** | Teacher-to-subject mapping | subjectAssignment, teacher, status |
| **Application** | Student applications | applicationNumber, program, section, status, reviewedBy |
| **ApplicationTimeline** | Application audit trail | application, action, performedBy, visibility |
| **Verification** | OTP codes | email, code, purpose, expiresAt (TTL index) |
| **SubjectPrerequisite** | Prerequisite rules | subject, requiredSubject, curriculum, minimumGrade |

---

## 8. Authentication & Authorization

### Authentication Flow

```
┌──────────┐     POST /api/auth/login      ┌──────────┐
│  Client  │ ──────────────────────────────▶│  Server  │
│          │                                │          │
│  Login   │  1. Rate limit check (5/15min) │          │
│  Form    │  2. Turnstile captcha verify   │          │
│          │  3. Find user by email         │          │
│          │  4. Check account lockout      │          │
│          │  5. bcrypt password compare    │          │
│          │  6. Check isActive             │          │
│          │  7. Generate JWT access token  │          │
│          │     (15min expiry)             │          │
│          │  8. Generate JWT refresh token │          │
│          │     (5h expiry, httpOnly)      │          │
│          │  9. Save refresh token in DB   │          │
│          │                                │          │
│  Store   │◀─── { user, accessToken } ─────│  Respond │
│  tokens  │                                │          │
└──────────┘                                └──────────┘
```

### Token Management

| Token | Storage | Expiry | Refresh |
|---|---|---|---|
| **Access Token** | Zustand store (localStorage) | 15 minutes | Automatic on 401 |
| **Refresh Token** | httpOnly cookie (SameSite=none, Secure) | 5 hours | Via `/api/auth/refresh` |

### Token Refresh Mechanism

```
Client (Axios interceptor)
      │
      ▼
  401 Response
      │
      ▼
POST /api/auth/refresh (with httpOnly cookie)
      │
      ├── Verify refresh token signature
      ├── Check tokenVersion matches DB
      ├── Generate new token pair
      │
      ▼
  Retry original request with new access token
```

### Cross-Tab Synchronization

- Zustand `persist` middleware saves auth state to localStorage
- `BroadcastChannel` + `storage` event listeners sync auth state across browser tabs
- Logout in one tab invalidates all tabs via `tokenVersion` increment

### Password Security

| Feature | Implementation |
|---|---|
| Hashing | bcrypt with salt rounds = 10 |
| Account lockout | 5 failed attempts → locked for 15 minutes |
| Must-change password | New users flagged on activation |
| OTP verification | 10-minute expiry, 5 max attempts, MongoDB TTL index |

---

## 9. Caching Strategy

### Server-Side Caching (Redis)

```
┌──────────┐     Request      ┌──────────┐     Cache Hit?
│  Client  │ ────────────────▶│  Server  │ ─────────────┐
│          │                  │          │              │
│          │◀─── Response ────│  Redis   │    Yes ──────┤
│          │                  │  (5min   │              │
│          │                  │   TTL)   │    No ───────┤
│          │                  │          │              │
│          │                  │ MongoDB  │◀─────────────┘
│          │                  │ (query)  │
└──────────┘                  └──────────┘
```

**Cache utilities:**
- `getCache(key)` / `setCache(key, value, ttl)` — Raw Redis operations
- `remember(key, ttl, callback)` — Cache-through pattern (check cache → miss → query DB → store → return)
- `clearCache(...keys)` — Invalidate specific cache entries

### Client-Side Caching (React Query)

| Setting | Value | Purpose |
|---|---|---|
| `staleTime` | 60 seconds | Data considered fresh for 1 minute |
| `retry` | 1 | One retry on failure |
| `refetchOnWindowFocus` | false | No automatic refetch on tab focus |

---

## 10. Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                   │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 1. Network Security                           │  │
│  │    - CORS whitelist (localhost + workers.dev)  │  │
│  │    - HTTPS (Railway)                          │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 2. Rate Limiting                              │  │
│  │    - Global: 100 requests/15 minutes           │  │
│  │    - Login: 5 attempts/15 minutes              │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 3. Bot Protection                             │  │
│  │    - Cloudflare Turnstile captcha (login)      │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 4. Authentication                             │  │
│  │    - JWT access tokens (15min)                 │  │
│  │    - httpOnly refresh cookies (5h)             │  │
│  │    - Token versioning for instant invalidation │  │
│  │    - bcrypt password hashing                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 5. Authorization                              │  │
│  │    - Role-based middleware (admin/registrar/   │  │
│  │      teacher/student)                          │  │
│  │    - Client-side route guards                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 6. Data Security                              │  │
│  │    - Input validation (Zod schemas)            │  │
│  │    - Account lockout (5 failed → 15min lock)   │  │
│  │    - OTP with TTL + attempt limits             │  │
│  │    - No secrets in client bundle               │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Password Reset Flow

```
User Requests Reset
        │
        ▼
POST /api/auth/forgot-password
        │
        ├── Generate 6-digit OTP
        ├── Store in Verification collection (10min TTL)
        ├── Send via Nodemailer (Gmail SMTP)
        │
        ▼
User Enters OTP
        │
        ▼
POST /api/auth/verify-otp
        │
        ├── Check code matches
        ├── Check attempts < 5
        ├── Check not expired
        │
        ▼
POST /api/auth/reset-password
        │
        ├── Hash new password
        ├── Update user password
        ├── Increment tokenVersion (invalidate all tokens)
        │
        ▼
Redirect to Login
```

---

## 11. Data Flow Diagrams

### Student Application Flow

```
Student                    System                     Registrar
   │                          │                           │
   │  1. Submit Application   │                           │
   │ ────────────────────────▶│                           │
   │                          │  2. Store Application     │
   │                          │     status: "Pending"     │
   │                          │                           │
   │                          │  3. Create Timeline Entry │
   │                          │     action: "Submitted"   │
   │                          │                           │
   │  4. Confirmation         │                           │
   │◀────────────────────────│                           │
   │                          │                           │
   │                          │  5. New Application       │
   │                          │     Notification          │
   │                          │──────────────────────────▶│
   │                          │                           │
   │                          │  6. Review Application    │
   │                          │◀──────────────────────────│
   │                          │                           │
   │                          │  7. Update Status         │
   │                          │     (Approved/Rejected)   │
   │                          │                           │
   │                          │  8. Send Email            │
   │                          │     Notification          │
   │  9. Email Update         │                           │
   │◀────────────────────────│                           │
```

### Enrollment Flow

```
Student                    System                     Registrar
   │                          │                           │
   │  1. Submit Enrollment    │                           │
   │     Form                 │                           │
   │ ────────────────────────▶│                           │
   │                          │  2. Validate Application  │
   │                          │  3. Create Enrollment     │
   │                          │     status: "Pending"     │
   │                          │                           │
   │  4. Enrollment Created   │                           │
   │◀────────────────────────│                           │
   │                          │                           │
   │                          │  5. Assessment            │
   │                          │◀──────────────────────────│
   │                          │                           │
   │                          │  6. Update Status:        │
   │                          │     "Assessed" → "Paid"   │
   │                          │     → "Enrolled"          │
   │                          │                           │
   │                          │  7. Create StudentSubject │
   │                          │     records per section   │
   │                          │     subject schedule      │
   │                          │                           │
   │  8. Enrollment Complete  │                           │
   │◀────────────────────────│                           │
```

### Grade Recording Flow

```
Teacher                    System                     Student
   │                          │                           │
   │  1. Access Grade Book   │                           │
   │ ────────────────────────▶│                           │
   │                          │  2. Fetch StudentSubject  │
   │                          │     records for section   │
   │                          │                           │
   │  3. Student List         │                           │
   │◀────────────────────────│                           │
   │                          │                           │
   │  4. Enter Grades         │                           │
   │ ────────────────────────▶│                           │
   │                          │  5. Validate + Update     │
   │                          │     finalGrade, status    │
   │                          │     (Completed/Failed)    │
   │                          │                           │
   │  6. Success              │                           │
   │◀────────────────────────│                           │
   │                          │                           │
   │                          │  7. Notify Student        │
   │                          │──────────────────────────▶│
```

---

## 12. Module Breakdown

### Server Module Matrix

| Module | Route Prefix | Models | Key Services |
|---|---|---|---|
| **auth** | `/api/auth` | User | login, register, refresh, logout, passwordReset, activation |
| **academic/department** | `/api/department` | Department | CRUD operations |
| **academic/programs** | `/api/program` | Program | CRUD with department linking |
| **academic/subject** | `/api/subject` | Subject, SubjectAssignment | CRUD with versioning |
| **academic/section** | `/api/section` | Section | CRUD with curriculum linking |
| **academic/curriculum** | `/api/curriculum` | Curriculum, CurriculumSubject | CRUD with versioning + locking |
| **academic/academicyear** | `/api/academicyear` | AcademicYear | CRUD with status transitions |
| **academic/enrollmentperiod** | `/api/enrollmentperiod` | EnrollmentPeriod | CRUD |
| **academic/prerequisites** | `/api/prerequisite` | SubjectPrerequisite | CRUD |
| **students** | `/api/students` | Student | CRUD, section assignment |
| **accounts** | `/api/accounts` | User | Admin account management |
| **enrollment** | `/api/enrollment` | Enrollment | Enrollment lifecycle |
| **studentapplications** | `/api/student-applications` | Application, ApplicationTimeline | Application review + audit |
| **admission** | — | — | Email templates (planned) |
| **teacherassignment** | `/api/teacherassignment` | TeacherAssignment | Teacher load management |
| **studentsubject** | `/api/student-subject` | StudentSubject | Grade recording |
| **sectionsubject** | `/api/section-subject` | SectionSubject | Class scheduling |
| **verification** | `/api/verification` | Verification | OTP generation + verification |

### Client Module Matrix

| Module | Layout | Key Pages | State |
|---|---|---|---|
| **auth** | AuthLayout | Login, Register, ForgotPassword, ChangePassword | useAuthStore (Zustand) |
| **dashboard** | DashboardLayout | Dashboard | React Query |
| **students** | DashboardLayout | Students, StudentDashboard, MySubjects, MyProfile | React Query |
| **accounts** | DashboardLayout | Accounts | React Query |
| **academic** | DashboardLayout | Department, Program, Subject, Section, Curriculum, etc. | React Query |
| **enrollmentform** | MainLayout | EnrollmentForm | React Hook Form + Zod |
| **admission** | DashboardLayout | PendingApplication | React Query |
| **enrollment-review** | DashboardLayout | EnrollmentReview | React Query |
| **home** | MainLayout | Home, Hero, Features, Testimonials, FAQ, Footer | Static |

---

## Appendix A: File Structure Summary

```
TeacherPortal/
├── client/                     # React SPA (Vite)
│   ├── src/
│   │   ├── modules/            # 10 feature modules
│   │   ├── shared/             # Layouts + shared components
│   │   ├── components/         # 14 reusable UI categories
│   │   ├── hooks/              # Global custom hooks
│   │   ├── services/           # Axios instance
│   │   ├── constants/          # Roles, Query keys
│   │   └── lib/                # Utilities
│   ├── vite.config.js          # Dev proxy + path aliases
│   └── package.json
├── server/                     # Express API
│   ├── server.js               # Entry point
│   ├── src/
│   │   ├── app.js              # Express setup + route mounts
│   │   ├── config/             # Redis, mailer
│   │   ├── database/           # MongoDB connection
│   │   ├── middlewares/        # Auth, role, rate-limit, turnstile
│   │   ├── modules/            # 11 domain modules
│   │   └── utils/              # Token, cache helpers
│   ├── seedAdmin.js            # Admin seeder
│   └── package.json
├── docs/                       # Architecture documentation
├── Dockerfile                  # Multi-stage build
├── docker-compose.yml          # 3-service setup
└── railway.json                # Deployment config
```

## Appendix B: Environment Variables

### Server (.env)

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Access token signing key | `<random-string>` |
| `JWT_SECRET_EXPIRY` | Access token lifetime | `15m` |
| `JWT_REFRESH_SECRET` | Refresh token signing key | `<random-string>` |
| `JWT_REFRESH_SECRET_EXPIRY` | Refresh token lifetime | `5h` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:5173,...` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret | `<key>` |
| `ENABLE_TURNSTILE` | Enable captcha in dev | `false` |
| `GMAIL_USER` | Gmail sender address | `user@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail app password | `<password>` |

### Client (.env)

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
