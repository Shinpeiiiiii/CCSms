# Codebase Improvement Audit

Date: 2026-08-10  
Scope: Full stack (server + client)  
Status: Findings only — no code changes applied

---

## Table of Contents

1. [Project Structure & Architecture Consistency](#1-project-structure--architecture-consistency)
2. [Backend — Controllers, Services, Models, Routes, Middlewares](#2-backend--controllers-services-models-routes-middlewares)
3. [Frontend — Pages, Components, Services, State Management](#3-frontend--pages-components-services-state-management)
4. [Auth & Security Patterns](#4-auth--security-patterns)
5. [Error Handling & Validation](#5-error-handling--validation)
6. [Database Schema & Data Access Patterns](#6-database-schema--data-access-patterns)
7. [API Design & Consistency](#7-api-design--consistency)
8. [Frontend Routing & Protected Routes](#8-frontend-routing--protected-routes)
9. [State Management & Cross-Tab Sync](#9-state-management--cross-tab-sync)
10. [Performance & Rendering Concerns](#10-performance--rendering-concerns)
11. [Missing Tests & Type Safety](#11-missing-tests--type-safety)
12. [Environment & Config Management](#12-environment--config-management)
13. [Existing Docs & Known TODOs/FIXMEs](#13-existing-docs--known-todosfixmes)
14. [Cross-Cutting / Additional Findings](#14-cross-cutting--additional-findings)

---

## Summary

- **4 critical bugs** require immediate attention
- **~20 architecture / consistency issues**
- **~15 security gaps**
- **Extensive dead code** that increases bundle size and cognitive load
- **Missing docs** for several core modules

The most urgent fixes are in `auth.middleware.js`, `token.js`, cookie options in login/refresh controllers, and consolidating the two frontend routers.

---

## 1. Project Structure & Architecture Consistency

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 1.1 | `client/src/App.jsx`, `client/src/main/router/index.jsx`, `client/src/app/router/Router.jsx`, `client/src/app/router/routerConfig.js` | **Two parallel router systems.** App.jsx imports the legacy `../src/main/router/index` while a modern `app/router/Router.jsx` + `routerConfig.js` exists but is unused. This creates confusion and maintenance debt. | Remove the legacy router and wire App.jsx to the new `app/router/Router.jsx`. Delete `client/src/main/router/index.jsx` and any stale imports. |
| 1.2 | `client/src/shared/services/api.js`, `client/src/shared/layouts/AuthLayout.jsx`, `client/src/modules/auth/pages/forgotpass.jsx`, `server/src/database/transaaction.js` | **Dead / zero-byte files** litter the codebase and confuse navigation. | Delete all zero-byte files. If functionality is needed later, recreate from source control. |
| 1.3 | `client/src/app/store.js`, `client/src/features/auth/authSlice.js` | **Unused Redux store** coexists with the active Zustand auth store. Package.json also includes `@reduxjs/toolkit` and `react-redux`. | Remove the Redux files and drop `@reduxjs/toolkit` / `react-redux` from dependencies unless a concrete feature requires them. |
| 1.4 | Module naming: `studentsubject` vs `studentSubject`, `sectionsubject` vs `sectionSubject`, `academicyear` vs `academicYear` | **Inconsistent casing** in folder/file names violates the convention used elsewhere (`academic/programs`, `academic/section`). | Standardize to camelCase for new modules; migrate existing folders via rename + search-replace imports. |
| 1.5 | Multiple components mix Tailwind, inline `style` objects, and `<style>` injection (e.g., `Sidebar.jsx`, `StudentFilterBar.jsx`, `Dashboard.jsx`). | **Styling approach fragmentation** increases bundle size and makes theme changes hard. | Adopt Tailwind utility classes as the single source of truth. Extract repeated inline styles into shared CSS modules or Tailwind components. |
| 1.6 | `server/src/modules/admission/` contains only utils/templates; no controller, routes, or service file is wired into `app.js`. | **Incomplete admission backend module** with dead code. | Either complete the admission backend module or remove the orphaned utils/templates to avoid confusion. |
| 1.7 | `client/src/modules/auth/components/protected-route/Protected-Route.jsx` (file inside a directory with same name as component). | **Naming collision risk** — directory and file share similar names; imports can break if a folder `protected-route` is created alongside the file. | Rename the directory to `protectedRoutes` or flatten to `client/src/modules/auth/components/ProtectedRoute.jsx`. |

---

## 2. Backend — Controllers, Services, Models, Routes, Middlewares

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 2.1 | `server/src/middlewares/auth.middleware.js` | Uses `process.env.JWT_SECRET` to verify access tokens, but the project environment variables are documented as `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`. | Align code with documentation: replace `process.env.JWT_SECRET` with `process.env.JWT_ACCESS_SECRET`. Add a startup assertion that required env vars exist. |
| 2.2 | `server/src/middlewares/auth.middleware.js` (lines 20–27) | **Dead code after `next()`**: `req.user = decoded` is set, `next()` is called, then `decoded.tokenVersion !== req.user.tokenVersion` is compared — but `req.user` is the same object as `decoded`, and the response has already been passed downstream. | Move the tokenVersion check before `next()`, or better, compare `decoded.tokenVersion` against a freshly fetched user’s `tokenVersion` inside the middleware. |
| 2.3 | `server/src/utils/token.js` | Also uses `process.env.JWT_SECRET` for `generateAccessToken`. | Replace with `process.env.JWT_ACCESS_SECRET` to match middleware and documentation. |
| 2.4 | `server/src/modules/auth/controllers/login.controller.js` (lines 70–76), `server/src/modules/auth/controllers/refresh.controller.js` (lines 51–57) | Cookie options specify `secure` twice: `secure: process.env.NODE_ENV === "production"` then immediately `secure: true`. The second key wins, forcing cookies to be `Secure` even in local development over HTTP. | Remove the duplicate `secure` key. Use `secure: process.env.NODE_ENV === "production"` so dev environments work over HTTP. |
| 2.5 | `server/src/database/mongodb.js` | Connection failure is logged but the process continues, causing uncaught exceptions later. | Call `process.exit(1)` after logging the MongoDB connection error. |
| 2.6 | `server/src/database/transaaction.js` | Empty file with a typo in the filename (`transaaction`). | Delete the file or implement a proper transaction helper (e.g., `mongoose.startSession()` wrapper). |
| 2.7 | `server/src/modules/auth/controllers/register.controller.js` | Catches all errors and returns `500`, conflating validation, duplicate-key, and server errors. | Return `400` for known business errors (e.g., duplicate email) and `500` only for unexpected failures. |
| 2.8 | `server/src/modules/students/controllers/student.controller.js` | Typo `sucess: false` on line 118. Also, `getMySubjects` fabricates client-side `_id` and `createdAt` fields for `CurriculumSubject` rows. | Fix typo. `getMySubjects` should return `CurriculumSubject` data without inventing Mongo IDs, or move the transformation into a dedicated DTO/mapper. |
| 2.9 | `server/src/modules/academic/section/services/section.services.js` line 77 | Populate select string typo: `curriclumName` instead of `curriculumName`. | Fix the typo; verify all populate selectors across services. |
| 2.10 | `server/src/modules/academic/section/services/section.services.js` `createSection` | `Curriculum.findById(data.curriculum)` is not populated, so `curriculum.academicYear` is an ObjectId. The comparison `curriculum.academicYear.toString() !== academicYear._id.toString()` works by accident but is fragile and confusing. | Explicitly populate `academicYear` or compare IDs directly with clear intent. |
| 2.11 | `server/src/modules/accounts/services/account.services.js` line 10 | `getTeachers` selects `employeeId`, but the `User` model has no `employeeId` field. | Remove `employeeId` from the select or add the field to the User model if needed. |
| 2.12 | `server/src/modules/accounts/routes/account.routes.js` lines 27–34 | Stub `/teachers` route returns a hardcoded empty array and a console log, bypassing the actual `getTeachers` service. | Remove the stub and uncomment the real `getTeachers` route, or delete it if it is replaced by a different endpoint. |
| 2.13 | `server/src/modules/studentapplications/services/studentapplication.services.js` `approveApplication` | Creates `User` + `Student` + sends email in a single function with no MongoDB transaction. A failure after `User.create` but before `Student.create` leaves orphan records. | Wrap the approval flow in a MongoDB session/transaction. Roll back on any failure. |
| 2.14 | `server/src/modules/academic/prerequisites/models/prerequisites.models.js` | Variable name `subjcetPrerequisitesSchema` is misspelled. | Rename to `subjectPrerequisitesSchema`. |
| 2.15 | `server/src/modules/academic/prerequisites/services/prerequisites.services.js` | `createPrerequisite` duplicate check ignores `curriculum` scope, so the same `(subject, requiredSubject)` pair cannot exist across different curriculums. | Include `curriculum` in the duplicate-check query when `curriculum` is provided. |
| 2.16 | `server/src/modules/academic/subject/model/subject.model.js` | Compound index on `{subjectCode, version}` is non-unique; only a single-field index exists. | Add a unique compound index `{ subjectCode: 1, version: 1 }` to enforce one version per code at the DB level. |
| 2.17 | `server/src/modules/enrollment/models/enrollment.model.js` | No unique constraint preventing a student from being enrolled twice in the same `academicYear` + `semester`. | Add a unique compound index `{ student: 1, academicYear: 1, semester: 1 }`. |
| 2.18 | `server/src/middlewares/turnstile.middleware.js` | Bypass logic is confusing: `ENABLE_TURNSTILE === 'false' && NODE_ENV !== 'production'` logs "Failed production detected" but actually means "skip Turnstile in non-production when explicitly disabled". | Rename the log message and simplify: skip only when `ENABLE_TURNSTILE !== 'true'` outside production, or gate strictly on a single flag. |
| 2.19 | `server/src/config/redis.js` | Logs `redisClient.isOpen` at module load time (side effect). Also, `connectRedis` does not throw on failure, so `server.js` continues even if Redis is down. | Remove the top-level `console.log`. Make `connectRedis` throw on failure so `server.js` can `process.exit(1)`. |
| 2.20 | `server/src/utils/cache.helper.js` | Logs every cache hit/miss unconditionally, which is noisy in production. | Add a debug/development guard: `if (process.env.NODE_ENV !== 'production') console.log(...)`. |
| 2.21 | `server/src/app.js` | `curriculumsubjectRoutes` is mounted at `/api` instead of a namespaced path like `/api/curriculum-subjects`. | Mount under `/api/curriculum-subjects` or `/api/curriculum/:curriculumId/subjects` for consistency. |
| 2.22 | `server/src/modules/academic/enrollmentperiod/controller/enrollmentperiod.controller.js` | No validation that `startDate < endDate`. | Add a service-level check and return `400` if dates are invalid. |
| 2.23 | `server/src/modules/academic/enrollmentperiod/models/enrollmentperiod.model.js` | `enrollmentPeriodName` has a commented-out `unique: true`. | Decide if names must be unique; if so, uncomment and add a unique index. |
| 2.24 | `server/src/modules/academic/curriculum/controller/curriculum.controller.js` lines 38–43, 59–64 | `getCurriculum` and `getCurriculumById` return `errors` and `warnings` on `400`, but other error paths (e.g., `updateCurriculum`) do not include them, leading to inconsistent frontend handling. | Standardize error payloads across all curriculum controllers, or strip `errors`/`warnings` from responses and expose them only on `publishCurriculum`. |

---

## 3. Frontend — Pages, Components, Services, State Management

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 3.1 | `client/src/modules/auth/pages/forgotpass.jsx` | Empty file (0 bytes). | Delete the file. |
| 3.2 | `client/src/shared/services/api.js` | Empty file (0 bytes) while `client/src/services/api.js` is the real Axios instance. | Delete the empty file to avoid confusion. |
| 3.3 | `client/src/modules/dashboard/pages/Dashboard.jsx` | Uses hardcoded stat values (`"120"`, `"95%"`, `"8"`, `"34"`) and a link to `/grades` which does not exist. | Replace hardcoded values with real TanStack Query fetches. Remove or implement the `/grades` route. |
| 3.4 | `client/src/modules/students/components/StudentFilterBar.jsx` | Uses dark-theme inline styles (`rgba(255,255,255,0.04)`, `#0A0F1E`) that clash with the light sidebar/dashboard theme. | Migrate to Tailwind classes with a consistent theme token system. |
| 3.5 | `client/src/modules/enrollment-review/pages/EnrollmentReview.jsx` vs `client/src/modules/enrollment-review/hooks/useEnrollmentReview.js` | `EnrollmentReview.jsx` imports from `../services/review.service.js`, but `useEnrollmentReview.js` imports from `../services/enrollmentService.js`. Two service files for the same domain. | Consolidate into a single `review.service.js` and update the hook to use it. |
| 3.6 | `client/src/modules/accounts/services/account.services.js` | Calls `/accounts/teachers`, but the backend stub returns an empty array. | Remove or fix the backend endpoint so the frontend receives real data. |
| 3.7 | `client/src/modules/auth/components/Sidebar.jsx` | Uses a module-level `sidebarCollapseState = {}` to persist collapse state. This is a global mutable variable that survives remounts but is not reset on logout, potentially leaking state across users in shared devices. | Reset `sidebarCollapseState` on logout (listen to the BroadcastChannel or auth-store change). |
| 3.8 | `client/src/modules/auth/components/UserMenu.jsx` | Logout uses `setTimeout(() => { logout(); ... }, 1200)` purely for animation. If the component unmounts before 1200ms, the timeout still fires. | Use a `useRef` for the timer and clear it in `useEffect` cleanup. |
| 3.9 | `client/src/modules/auth/components/NavItem.jsx` | `onMouseEnter` calls `iconRef.current?.startAnimation?.()` but not all Lucide icons implement `startAnimation` / `stopAnimation`. | Guard with `typeof Icon === 'function'` or remove animation hooks for static icons. |
| 3.10 | Multiple pages (e.g., `EnrollmentForm.jsx`, `ForgotPassword.jsx`) | Large inline `<style>` blocks and long inline style objects increase render cost and reduce readability. | Extract styles into CSS modules or Tailwind utility classes. |
| 3.11 | `client/src/modules/auth/components/Sidebar.jsx` | `useMemo` dependencies include `onClose`, which is recreated on every render by parent, causing memoized nav items to recompute. | Wrap `onClose` in `useCallback` in `DashboardLayout.jsx` before passing it down. |

---

## 4. Auth & Security Patterns

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 4.1 | `server/src/middlewares/auth.middleware.js`, `server/src/utils/token.js` | **JWT secret mismatch**: code uses `JWT_SECRET` while README documents `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`. This causes token verification to fail silently or use an unintended secret. | Standardize on `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. Add a startup check that both are defined. |
| 4.2 | `server/src/middlewares/auth.middleware.js` | Token version invalidation is dead code (see 2.2). Effective logout invalidation does not work for in-flight access tokens. | Fix the middleware so `tokenVersion` is actually checked on every authenticated request. |
| 4.3 | `server/src/modules/auth/controllers/login.controller.js` | Cookie `sameSite: "none"` + `secure: true` is correct for cross-site production, but in dev the duplicate `secure: true` blocks cookies over HTTP. | Use `secure: process.env.NODE_ENV === "production"` and `sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"`. |
| 4.4 | `client/src/modules/auth/state/auth-store.js` | `refreshToken` is persisted to `localStorage`. Even though the httpOnly cookie is the source of truth, storing the refresh token in localStorage expands the XSS attack surface. | Do **not** persist `refreshToken` to localStorage. Let the backend manage it via httpOnly cookie only. |
| 4.5 | `client/src/services/api.js` | Refresh interceptor ignores the new `refreshToken` returned by `/auth/refresh`, so the store’s `refreshToken` becomes stale. | Update the store with the new refresh token: `useAuthStore.setState({ accessToken: newAccessToken, refreshToken: response.data.refreshToken })`. |
| 4.6 | `server/src/middlewares/turnstile.middleware.js` | Bypass logic is inverted/confusing; if `ENABLE_TURNSTILE=false` in production, Turnstile is **not** bypassed (which is correct), but the log message is misleading. | Clarify the flag semantics: `ENABLE_TURNSTILE=true` forces verification in all environments; otherwise verify only in production. |
| 4.7 | `server/src/modules/auth/services/forgot-password.services.js` | Password reset uses a 6-digit numeric OTP (`Math.floor(100000 + Math.random() * 900000)`). This is weak (1M possibilities) and predictable. | Use a longer alphanumeric token (e.g., 32 chars) or a 6-digit OTP with rate limiting and shorter TTL (5 min is okay, but consider 10 attempts max). |
| 4.8 | Global | No `helmet`, no security headers (`X-Frame-Options`, `CSP`, `X-Content-Type-Options`). | Add `helmet` middleware in `app.js` with a content security policy appropriate for the API. |
| 4.9 | `server/src/modules/auth/controllers/check-email.controller.js` | Uses a regex constructed from user input: `new RegExp(\`^${email.trim().replace(...)}\`, 'i')`. If the regex escape is incorrect, this could still cause ReDoS or unexpected matching. | Use a case-insensitive exact match: `User.findOne({ email: { $regex: new RegExp('^' + escapeRegex(email.trim()) + '$', 'i') })` or simply lowercase both sides. |
| 4.10 | `server/src/app.js` | No global error handler; unhandled promise rejections or route handler errors may crash the process or leak stack traces. | Add a global error-handling middleware at the end of `app.js` and an `unhandledRejection` / `uncaughtException` listener in `server.js`. |

---

## 5. Error Handling & Validation

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 5.1 | All backend controllers | Controllers accept `req.body` directly without schema validation (Zod, Joi, or express-validator). Malformed input reaches services and models. | Add a shared validation middleware or use Zod schemas per route. Validate before entering the service layer. |
| 5.2 | `server/src/modules/students/controllers/student.controller.js` line 11 | `Student.create(req.body)` with no validation. | Validate `req.body` against the Student schema before creation. |
| 5.3 | Inconsistent error response shapes | Some endpoints return `{ message, errors, warnings }`, others return `{ success, data }`, others return raw arrays or `{ success: false, message }`. | Adopt a standard envelope: `{ success: boolean, data?: any, message?: string, errors?: string[] }`. |
| 5.4 | `server/src/modules/academic/curriculum/controller/curriculum.controller.js` | `getCurriculum` returns `400` with `errors`/`warnings`, but `publishCurriculum` also throws structured errors. The frontend has no way to display them. | Return validation errors/warnings on a dedicated field and ensure the frontend renders them before allowing publish. |
| 5.5 | `client/src/modules/enrollmentform/pages/EnrollmentForm.jsx` | Uses quick client-side checks (`if (!formData.firstName...)`) but no `react-hook-form` + Zod validation, despite `react-hook-form` and `zod` being in dependencies. | Integrate `react-hook-form` with `zod` resolver for type-safe validation and better UX. |

---

## 6. Database Schema & Data Access Patterns

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 6.1 | `server/src/modules/students/models/Student.js` | No `updatedBy` field despite project.md specifying it for audit tracking on `SectionSubject`. | Add `updatedBy` (ObjectId ref User, default null) to models that require audit trails: `Student`, `Program`, `Section`, `CurriculumSubject`, `EnrollmentPeriod`. |
| 6.2 | `server/src/modules/sectionsubject/models/sectionsubject.model.js` | Compound unique index `{section, subject}` exists (good), but no index on `instructor` or `day` for schedule conflict queries. | Add indexes on `{ instructor, day, startTime }` and `{ section, day }` to speed up conflict detection. |
| 6.3 | `server/src/modules/academic/section/services/section.services.js` | `getSection` runs two aggregations (`Student` + `SectionSubject`) on every call without caching. | Cache counts for a short TTL (e.g., 60s) or use MongoDB `$lookup` in a single aggregation. |
| 6.4 | `server/src/modules/academic/subject/services/subject.services.js` | `getSubject` is cached, but `getSubjectById` is not. | Cache `getSubjectById` as well, or at least cache subject lists by code prefix. |
| 6.5 | `server/src/modules/studentapplications/services/studentapplication.services.js` | `trackApplication` uses `$regex` with `^...$` and `i` flag on a field that should be unique (`applicationNumber`). | Use an exact case-insensitive unique index or store an uppercase canonical version and query with exact match. |
| 6.6 | `server/src/modules/academic/curriculum/services/curriculum.services.js` | `createNewVersion` copies `prerequisites` from old `CurriculumSubject` IDs to new ones, but the comment in `docs/curriculumAutomation.md` says this breaks the graph. | After inserting new `CurriculumSubject`s, remap prerequisite IDs via `oldIdToNewId` map and re-save. |
| 6.7 | `server/src/modules/studentapplications/services/studentapplication.services.js` | `startApplication` sets `emailVerified: true` without actually verifying the email (verification is done via OTP in the enrollment form). | Rename the field to `otpVerified` or remove the misleading `emailVerified` flag. |
| 6.8 | Multiple services | Cache invalidation is inconsistent. `curriculum.services.js` clears cache in some paths but not all (per `docs/curriculumAutomation.md`). | Audit every mutation endpoint and ensure `clearCache(...)` is called. |
| 6.9 | `server/src/modules/studentsubject/models/studentsubject.models.js` | `semester` is `String` but should probably be `Number` (enum `[1,2,3]`) to match `CurriculumSubject` and `SectionSubject`. | Change `semester` to `Number` with enum `[1, 2, 3]`. |

---

## 7. API Design & Consistency

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 7.1 | `server/src/modules/studentapplications/controllers/studentapplication.controller.js` | `getPendingApplications` returns a raw array, while `approveApplication` returns `{ success, data }`. | Standardize list endpoints to return `{ success: true, data: [...] }`. |
| 7.2 | `server/src/modules/accounts/routes/account.routes.js` | Duplicate variable declarations (`authorizeMiddleware` and `authMiddleware` are the same middleware imported twice). | Remove the duplicate import. |
| 7.3 | `server/src/modules/accounts/routes/account.routes.js` | `/teachers` route returns a hardcoded empty array with a console log. | Remove the stub or wire it to `getTeachers`. |
| 7.4 | `server/src/app.js` | `curriculumsubjectRoutes` mounted at `/api` instead of a sub-path. | Mount at `/api/curriculum-subjects` to avoid root-level collisions. |
| 7.5 | `server/src/modules/studentapplications/routes/studentapplication.routes.js` | No route-level rate limiting on public endpoints like `/start` and `/track`. | Add rate limiting to public application endpoints. |
| 7.6 | `server/src/modules/auth/routes/auth.routes.js` | `/register` is open (no auth, no Turnstile). | Add Turnstile or rate limiting to public registration to prevent abuse. |
| 7.7 | `server/src/modules/academic/enrollmentperiod/routes/enrollmentperiod.routes.js` | `getCurrentEnrollmentPeriod` is accessible to `student` and `teacher` roles, but the controller doesn’t restrict returned fields. | Ensure the response doesn’t leak sensitive fields, or use role-based field selection. |
| 7.8 | Multiple controllers | No standard error envelope; some return `{ message }`, others `{ success, message }`, others raw arrays. | Define a global response wrapper helper or a base controller class. |

---

## 8. Frontend Routing & Protected Routes

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 8.1 | `client/src/App.jsx`, `client/src/main/router/index.jsx` | App.jsx uses the **legacy router** which has inconsistent role guards. | Migrate App.jsx to the new `app/router/Router.jsx` (see 1.1). |
| 8.2 | `client/src/main/router/index.jsx` | `/dashboard` uses `<ProtectedRoute allowedRoles={...}>`, but `Protected-Route.jsx` does not accept or enforce `allowedRoles`. | Fix `ProtectedRoute` to accept `allowedRoles` and redirect unauthorized users, or consistently use `RoleProtectedRoute`. |
| 8.3 | `client/src/main/router/index.jsx` line 78–81 | `/attendance` route renders an empty `<RoleProtectedRoute>` with no children. | Remove the route or implement the Attendance page. |
| 8.4 | `client/src/app/router/routerConfig.js` line 59–61 | Commented note says `/attendance` had no element wired up. | Either implement the route or remove it from `routerConfig.js` to avoid confusion. |
| 8.5 | `client/src/modules/auth/components/protected-route/RoleProtectedRoute.jsx` | Redirects to `/dashboard` for unauthorized roles, but `/dashboard` itself requires auth. This creates a redirect loop risk if the user is unauthenticated but somehow has a stale role. | Redirect to `/login` when `!user`, and to `/dashboard` only when authenticated but unauthorized. |
| 8.6 | `client/src/modules/auth/components/protected-route/Protected-Route.jsx` | Only checks `accessToken` and `mustChangePassword`. It does not verify the token is actually valid (e.g., not expired). | Optionally call `/auth/refresh` or decode the JWT client-side to detect expiry before routing. |

---

## 9. State Management & Cross-Tab Sync

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 9.1 | `client/src/modules/auth/state/auth-store.js` | `refreshToken` is stored in localStorage (see 4.4). | Remove `refreshToken` from persisted state. |
| 9.2 | `client/src/services/api.js` | Refresh interceptor does not update `refreshToken` in the store (see 4.5). | Update both `accessToken` and `refreshToken` on successful refresh. |
| 9.3 | `client/src/modules/auth/state/auth-store.js` | `logout()` calls `useAuthStore.persist.clearStorage()`, which clears localStorage, but the httpOnly `refreshToken` cookie is not cleared client-side. | Accept that httpOnly cookies are cleared by the backend `/auth/logout`, but add a `credentials: 'include'` fetch to `/auth/logout` on app startup to clean up stale cookies. |
| 9.4 | `client/src/modules/auth/state/auth-store.js` | `BroadcastChannel` and `storage` event listeners are attached unconditionally on module load, which runs once per bundle. This is fine, but `syncFromStorage` re-reads the entire auth object on every storage event. | Optimize by comparing only the `accessToken` (already done) and debouncing rapid tab-switch events. |
| 9.5 | Unused Redux store | Dead code increases bundle size and cognitive load. | Remove `client/src/app/store.js` and `client/src/features/auth/authSlice.js` and their dependencies. |

---

## 10. Performance & Rendering Concerns

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 10.1 | `client/src/modules/students/pages/Students.jsx`, `client/src/modules/enrollment-review/pages/EnrollmentReview.jsx` | Large tables without pagination or virtualization. As data grows, rendering will freeze the main thread. | Add TanStack Table’s virtualization (`@tanstack/react-virtual`) or implement server-side pagination. |
| 10.2 | `client/src/modules/auth/components/Sidebar.jsx` | Module-level `sidebarCollapseState = {}` is a global mutable object. While it avoids remount resets, it persists across logouts and is not garbage-collected. | Move collapse state to a `useRef` in `DashboardLayout` or persist in `sessionStorage` scoped to the auth session. |
| 10.3 | `client/src/modules/auth/components/Sidebar.jsx` | `useMemo` dependencies include `onClose`, which is likely recreated on every `DashboardLayout` render (not wrapped in `useCallback`). | Wrap `onClose` in `useCallback` in `DashboardLayout.jsx` to stabilize memoization. |
| 10.4 | `client/src/providers/QueryProvider.jsx` | `staleTime: 1000 * 60` (1 minute) is short for static reference data (programs, departments). This causes excessive refetches. | Increase `staleTime` to 5–15 minutes for reference data, or set per-query in the hook. |
| 10.5 | `client/src/modules/students/components/StudentFilterBar.jsx` | Inline styles cause browser style recalculation on every render. | Migrate to Tailwind classes or CSS modules. |
| 10.6 | `client/src/modules/home/Home.jsx` | Imports `FeatureShowcase` from `../auth/components/FeatureShowcase`, coupling the public home page to the auth module. | Move shared components to `shared/components/`. |
| 10.7 | `client/src/modules/auth/components/Sidebar.jsx` | `renderedGroups` and `renderedUngrouped` memoize objects containing callbacks (`onClick: onClose`). If `onClose` is unstable, memoization is bypassed. | Same as 10.3 — stabilize callback references. |

---

## 11. Missing Tests & Type Safety

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 11.1 | `server/src/modules/students/tests/assignSection.test.js`, `server/src/modules/students/tests/inspectStudents.js` | Only two test files exist, both under `students`. No tests for auth, curriculum, prerequisites, enrollment, or admission. | Add unit tests for services (especially `prerequisites.services.js`, `curriculum.services.js`, `account.services.js`) and integration tests for critical flows (login → approve application → generate student subjects). |
| 11.2 | Entire project | No TypeScript, no type safety. Zod is in frontend dependencies but not used on the backend. | Add TypeScript or, at minimum, use Zod on the backend for request validation and typed service return values. |
| 11.3 | `server/src/modules/academic/curriculum/validators/` | Validators exist (`curriculum.validator.js`, `prerequisite.validator.js`, etc.) but are not wired into routes or controllers. | Wire validators into route middleware or call them from controllers before mutations. |
| 11.4 | No E2E tests | No Playwright / Cypress / Puppeteer tests for user flows (login, enrollment, approval). | Add at least one E2E test for the public enrollment flow and the admin approval flow. |

---

## 12. Environment & Config Management

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 12.1 | `server/src/app.js`, `server/src/config/mailer.js` | `dotenv.config()` is called in multiple files instead of once in the entry point. | Call `dotenv.config()` only in `server.js` (or `app.js`), then rely on the loaded `process.env` everywhere else. Remove redundant calls. |
| 12.2 | `server/src/server.js`, `server/src/database/mongodb.js`, `server/src/config/redis.js` | On connection failure, the server continues running. `redis.js` does not throw on failure. | Add `process.exit(1)` in catch blocks for DB/Redis connection failures. |
| 12.3 | `server/src/server.js` | Global `express-rate-limit` is applied to all routes (`100 req / 15 min`). This is too permissive for auth endpoints (login already has its own limiter, but `/refresh` and `/register` do not). | Apply route-specific rate limiters to `/auth/refresh`, `/auth/register`, and `/auth/forgot-password`. |
| 12.4 | `server/src/config/redis.js` | `console.log(redisClient.isOpen)` runs at module load time, which is a side effect and pollutes logs. | Remove the statement or move it inside `connectRedis`. |
| 12.5 | `server/.env`, `client/.env` | `.env` files exist but are not validated. Missing critical vars (e.g., `JWT_ACCESS_SECRET`) will cause cryptic runtime failures. | Add `dotenv-safe` or a startup validation function that asserts all required env vars are present. |
| 12.6 | `server/src/app.js` | CORS allowed origins include `https://ccsms.seddy012345.workers.dev` and `https://college-portal.seddy012345.workers.dev`. These look like hardcoded personal deployment URLs. | Move allowed origins to `CORS_ORIGIN` env var(s) so deployments are environment-agnostic. |
| 12.7 | `server/src/app.js` | No request body size limits (`express.json()` uses default 100kb, but file uploads or large payloads could be an issue). | Add `express.json({ limit: '1mb' })` and `express.urlencoded({ limit: '1mb' })`. |

---

## 13. Existing Docs & Known TODOs/FIXMEs

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 13.1 | `docs/curriculumAutomation.md` | Documents critical bugs (`publishCurriculum` broken, duplicate routes, version prerequisite mapping) that are **claimed to be fixed** in the code, but the doc still lists them as open. | Update the doc to reflect the current state. If bugs are fixed, move them to a “Resolved” section. If not fixed, add issue tracker links. |
| 13.2 | `docs/accountCreationArchitecture.md` | Notes that the frontend “bypasses the centralized `services/api.js` Axios client and injects the JWT manually.” | Fix the frontend `Accounts.jsx` to use the centralized `api` instance so the interceptor (refresh logic) is reused. |
| 13.3 | `docs/sectionSubjectArchitecture.md`, `docs/subjectArchitecture.md` | Excellent and detailed, but they describe a `SectionSubject` model with `day`, `startTime`, `endTime`, `room` — yet `sectionsubject.model.js` exists and is complete. The docs do not reference the actual model file path. | Add exact file paths and a “Current Implementation Status” table to each doc. |
| 13.4 | `docs/googleClassroomIntegration.md` | Entirely a future plan; no code has been written. | Add a “Not Started” status and a linked issue/ticket number so it is not mistaken for current functionality. |
| 13.5 | `docs/redesignSidebar.md` | This is a **design prompt**, not an architecture doc. It should not live in `docs/` alongside architecture docs. | Move to `.agents/skills/brand/` or a `design/` folder, or delete if the redesign is complete. |
| 13.6 | Missing docs | No architecture docs for: `enrollment`, `admission` / `studentapplications`, `prerequisites`, `auth` flow, `studentsubject`, or the new router architecture. | Create `docs/enrollmentArchitecture.md`, `docs/admissionFlow.md`, `docs/prerequisiteFlow.md`, `docs/studentSubjectGeneration.md`, and `docs/frontendRouting.md`. |
| 13.7 | `README.md` | Does not mention the two-router problem, the Redux dead code, or the JWT secret mismatch. It also omits the `studentapplications` and `enrollment` modules. | Update README to reflect the actual module list, known limitations, and environment variable names exactly as used in code. |
| 13.8 | `docs/sectionSubjectArchitecture.md` | Recommends a unique index `{ section, subject }` which exists in code — good. But it also documents `updatedBy` as required, while the model has it but many other models do not. | Document the audit-trail requirement explicitly: which models have `createdBy` / `updatedBy` and which are missing them. |

---

## 14. Cross-Cutting / Additional Findings

| # | File Path(s) | Current Issue / Gap | Suggested Improvement |
|---|-------------|---------------------|----------------------|
| 14.1 | `client/src/modules/auth/components/Sidebar.jsx`, `NavGroup.jsx` | `max-height` animation uses pixel values computed from `scrollHeight`. When content changes dynamically (e.g., loading more nav items), the height can become stale. | Recalculate `scrollHeight` on content changes, or use `grid-template-rows: 0fr / 1fr` animation for smoother collapse. |
| 14.2 | `client/src/modules/enrollment-review/components/ApplicationRow.jsx` (if exists) or inline table in `EnrollmentReview.jsx` | Inline table styles are duplicated across components. | Extract a reusable `Table` component with consistent header/row/cell styles. |
| 14.3 | `server/src/app.js` | No `trust proxy` beyond `app.set("trust proxy", 1)` — this is correct for a single reverse proxy, but if deployed behind Cloudflare Workers + Railway, verify the proxy chain depth. | Document the expected proxy topology in `docs/deployment.md`. |
| 14.4 | `server/src/app.js` | No request timeout handling. Long-running queries (e.g., `getSection` aggregations) can hang the event loop. | Set server-level timeouts (`server.timeout = 30000`) and use `Promise.race` for external calls (Turnstile, email). |
| 14.5 | `client/src/modules/auth/components/Sidebar.jsx` | Brand header shows “SPMS” / “Teacher Portal” in one place and “CCSms” / “School Management System” in another (`Login.jsx`, `EnrollmentForm.jsx`). | Centralize branding strings in `constants/branding.js`. |
| 14.6 | `server/src/modules/students/controllers/student.controller.js` | `deleteStudent` returns `204` with `res.status(204).json()` — 204 responses should not have a body. | Return `res.status(204).end()` or `res.sendStatus(204)`. |
| 14.7 | `client/src/modules/auth/components/protected-route/Protected-Route.jsx` | Does not handle the `mustChangePassword` redirect for `RoleProtectedRoute`. | Add the `mustChangePassword` check to `RoleProtectedRoute` or compose `ProtectedRoute` inside it. |

---

## Priority Recommendation

1. **Fix auth criticals first**: JWT secret mismatch, dead tokenVersion logic, cookie `secure` flag, and router consolidation. These affect every authenticated user.
2. **Remove dead code**: zero-byte files, unused Redux, stubbed routes. This reduces cognitive load immediately.
3. **Add validation layer**: Zod / express-validator on backend, `react-hook-form` + Zod on frontend forms.
4. **Stabilize sidebar**: wrap `onClose` in `useCallback`, reset collapse state on logout, and consider `grid-template-rows` animation.
5. **Add missing docs**: at minimum `docs/enrollmentArchitecture.md`, `docs/admissionFlow.md`, and update `README.md` with accurate module/env info.
