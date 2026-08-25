# Admin Account Management Improvement Plan

## Goal

Improve the admin account management module (`/account`) to be secure, consistent with other management pages, and free of bugs identified in the codebase audit.

## Scope

- **Backend**: `server/src/modules/accounts/` (routes, controller, service, model)
- **Frontend**: `client/src/modules/accounts/` (pages, components, hooks, services)

## Current State

| Issue | Location | Severity |
|-------|----------|----------|
| `/teachers` route returns hardcoded empty array | `server/src/modules/accounts/routes/account.routes.js:27-34` | Critical |
| `getTeachers` selects non-existent `employeeId` | `server/src/modules/accounts/services/account.services.js:10` | High |
| `createAccount` does not persist `middleName` | `server/src/modules/accounts/services/account.services.js:46-56` | Medium |
| First-user logic creates active bootstrap admin correctly | `server/src/modules/accounts/services/account.services.js:38-44` | N/A — logic is correct |
| `activateAccount` is intentionally unauthenticated (uses token, not JWT) | `server/src/modules/accounts/routes/account.routes.js:23` | Design note |
| `deleteAccount` returns 200 with message | `server/src/modules/accounts/services/account.services.js:131-138` | N/A — current behavior is acceptable |
| Frontend forms use inline styles instead of Tailwind | `AccountForm.jsx`, `AccountColumns.jsx`, `AccountToolbar.jsx` | Medium |
| Frontend uses `alert()` for errors | `Accounts.jsx`, `Program.jsx` | Low |
| Debug `console.log` statements in hooks | `useAccounts.js`, `useCrud.js` | Low |
| No account status toggle (`isEnabled`) | Frontend + Backend | Medium — new field required |

## Tasks

### 1. Backend Route Fixes

- **1.1** Remove the hardcoded `/teachers` stub (lines 27–34) and uncomment the real route on line 20, wiring it to `getTeachers` with `authMiddleware` + `authorizeRoles('admin', 'registrar')`.
- **1.2** Standardize all response envelopes to `{ success, data, message }`.

### 2. Backend Service Fixes

- **2.1** Remove `employeeId` from `getTeachers` select clause.
- **2.2** Fix `createAccount` to persist `middleName` (already included in `User.create`, verify it's passed from frontend).
- **2.3** Confirm first-user bootstrap logic is correct: first user ever is created as `isActive: true` without activation token; all subsequent users are `isActive: false` with activation token and email. No change needed.
- **2.4** Add field whitelist to `updateAccount` (allow only `firstName`, `middleName`, `lastName`, `email`, `role`, `isActive`).

### 3. Backend Validation

- **3.1** Add request validation middleware to account routes (email format, required fields, password length on activate).
- **3.2** Ensure `email` uniqueness is enforced at the service layer (already done).

### 4. Frontend Styling Migration

- **4.1** Migrate `AccountForm.jsx` inline styles to Tailwind utility classes.
- **4.2** Migrate `AccountToolbar.jsx` inline styles to Tailwind.
- **4.3** Migrate `AccountColumns.jsx` status badge inline styles to Tailwind.
- **4.4** Replace `alert()` calls in `Accounts.jsx` with toast notifications (use existing toast system if available).

### 5. Frontend UX Improvements

- **5.1** Add account status actions in the table actions: "Resend Activation" for inactive users, and an `isEnabled` toggle for all users.
- **5.2** Add bulk selection + bulk `isEnabled` toggle in `Accounts.jsx` (reuse `useBatchSelection` pattern from `students`).
- **5.3** Add `middleName` display in the Name column when present.
- **5.4** Show loading states on action buttons.

### 6. Backend — `isEnabled` Field Addition

- **6.1** Add `isEnabled: { type: Boolean, default: true }` to the `User` model.
- **6.2** Update `login.controller.js` to check `isEnabled` after `isActive`, returning a distinct message: "Your account has been disabled by an administrator."
- **6.3** Add `toggleAccountStatus(id)` service method that flips `isEnabled` and returns the updated user.
- **6.4** Add `PATCH /:id/toggle-status` route (admin only) that calls the new service method.
- **6.5** Standardize response envelopes across all account endpoints to `{ success, data, message }`.

### 7. Code Hygiene

- **7.1** Remove `console.log` statements from `useAccounts.js` and `useCrud.js`.
- **7.2** Ensure `AccountForm` resets properly when switching between create/edit modes.

## Dependencies

- **Tailwind CSS**: Available and used in sibling pages (`Program.jsx`, `Section.jsx`).
- **Toast system**: The codebase has three patterns — `react-toastify` (dominant, used in 9+ modules), a custom `ToastProvider`/`useToast` (only in `Students.jsx`), and a `sonner` wrapper that imports `next-themes` (appears incompatible with this Vite app). **Recommendation:** Standardize the admin module on `react-toastify` since it is already a project dependency and requires no provider setup.
- **Batch selection**: `useBatchSelection` hook exists at `client/src/modules/students/hooks/useBatchSelection.js` and is generic. It can be reused for account table row selection.
- **Action buttons**: `ActionButton` component already accepts a `customButtons` array, so new per-row actions can be added without modifying the shared component.

## Validation

1. **Create account**: Admin creates a teacher/registrar/admin account → activation email is sent (unless bootstrap first user) → account appears with correct `isActive` state in table.
2. **First user**: If no users exist, first admin account is created as Active without activation email or token.
3. **Edit account**: Admin edits name/email/role → changes persist; backend whitelist prevents privilege escalation via raw body.
4. **Delete account**: Admin deletes account → success toast shown → account removed from table.
5. **Role filtering**: Filtering by role works correctly in the toolbar.
6. **Resend activation**: Admin clicks resend for inactive user → new token generated, email sent, `activationExpires` updated.
7. **Toggle isEnabled**: Admin toggles `isEnabled` → user is blocked/allowed with a clear message distinct from email activation.

## Out of Scope

- Password reset / forgot-password flow
- Student self-registration
- Department-level account scoping
- Audit logging (`createdBy` / `updatedBy`)
