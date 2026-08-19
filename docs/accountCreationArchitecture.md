# Account Creation Architecture

## Overview

The portal supports two distinct account creation paths:

1. **Admin-created accounts** — Teachers, Registrars, and Admins are created by an existing admin through the Account Management page.
2. **Public registration** — Students self-register through the enrollment form (limited to email and password).

This document focuses on the admin-created account flow for Teachers, Registrars, and Admins.

## Architecture

```mermaid
flowchart TD
    Admin["Admin"] -->|1. Open /account| Frontend["Accounts.jsx"]
    Frontend -->|2. POST /api/accounts/create with Bearer token| Route["account.routes.js"]
    Route -->|3. authorizeMiddleware + authorizeRoles('admin')| Controller["account.controller.js"]
    Controller -->|4. createAccount data| Service["account.services.js"]
    Service -->|5. Check email uniqueness| UserModel["User model"]
    Service -->|6. Hash password| Bcrypt["bcrypt.hash()"]
    Service -->|7. Create document| UserModel
    UserModel -->|8. Return created user| Controller
    Controller -->|9. 201 + account| Frontend
    Frontend -->|10. Show success toast| Admin
```

## Frontend

File: `client/src/modules/accounts/pages/Accounts.jsx`

- Accessible only to admins via `RoleProtectedRoute allowedRoles={['admin']}` and nav item `/account`.
- Form fields: `firstName`, `lastName`, `email`, `password`, `role`.
- Available roles: `teacher`, `registrar`, `admin`.
- Submits directly to `http://localhost:5000/api/accounts/create` using raw `axios` with the bearer token from `useAuthStore`.
- On success: resets form and shows inline success message.
- On error: displays API error message.

## Backend Route

File: `server/src/modules/accounts/routes/account.routes.js`

```
POST /api/accounts/create
```

- Protected by `authorizeMiddleware` (validates JWT Bearer) and `authorizeRoles('admin')`.
- Mounted in `server/src/app.js` at `/api/accounts`.

## Controller

File: `server/src/modules/accounts/controller/account.controller.js`

- `createAccount(req, res)` receives the validated request.
- Delegates to `accountService.createAccount(req.body)`.
- Returns `201 Created` with the created account payload on success.
- Returns `400 Bad Request` on validation or service errors.

## Service

File: `server/src/modules/accounts/services/account.services.js`

- `createAccount(data)` performs the following:
  1. Checks if a user with the same `email` already exists.
  2. Hashes `data.password` using `bcrypt.hash(..., 10)`.
  3. Creates the `User` document with:
     - `firstName`, `lastName`, `email`, `password` (hashed), `role`.
  4. Returns the created user.

Additional service methods:
- `getTeachers()` — returns users with `role: 'teacher'`, excluding password and refreshToken.
- `getAccount()` — returns all users, excluding passwords.
- `getAccountById(id)` — returns a single user by ID, excluding password.
- `getUserById(id)` — returns a single user by ID (raw document).

## Model

File: `server/src/modules/auth/models/User.js`

| Field | Type | Notes |
|-------|------|-------|
| `firstName` | String | Required |
| `lastName` | String | Required |
| `email` | String | Required |
| `password` | String | Required |
| `role` | String | Enum: `admin`, `registrar`, `teacher`, `student` (default: `teacher`) |
| `tokenVersion` | Number | Default `0` — used for logout invalidation |
| `failedLoginAttempts` | Number | Default `0` |
| `lockUntil` | Date | Default `null` |
| `mustChangePassword` | Boolean | Default `false` |
| `timestamps` | — | Auto-managed `createdAt` / `updatedAt` |

## Security Notes

- Passwords are never stored in plain text; `bcrypt` with 10 salt rounds is used.
- Email uniqueness is enforced at the service layer before creation.
- Only users with the `admin` role can reach the account creation endpoint.
- The frontend currently bypasses the centralized `services/api.js` Axios client and injects the JWT manually.

## Public Registration (Students)

The public endpoint `POST /api/auth/register` (`register.controller.js`) is available without authentication but only accepts `email` and `password`. It does not allow setting `role`, `firstName`, or `lastName`. This endpoint is primarily used for student onboarding through the enrollment flow, where additional profile data is completed later.
