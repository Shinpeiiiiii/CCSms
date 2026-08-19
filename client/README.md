# TeacherPortal Client

React frontend for the TeacherPortal school management system.

## Stack

- React 19 + Vite 8
- Tailwind CSS v4
- React Router v7
- Zustand + TanStack Query v5
- shadcn/ui + Radix UI
- react-hook-form + Zod

## Scripts

```bash
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Environment

- `VITE_API_URL` — Backend API origin (e.g. `http://localhost:5000`)

The dev server proxies `/api` requests to the backend.
