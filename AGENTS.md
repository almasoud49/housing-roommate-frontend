# AGENTS.md

Next.js 16 frontend (App Router, React 19, TS, Tailwind v4, shadcn/ui `base-nova`) for the Housing & Roommate Platform. Consumes the separate backend at `housing-roommate-platform/` (Express + Prisma + bKash). No tests, no CI.

Directory structure and code style mirror `Apollo-Level2-Web-Dev/PH-Healthcare-Nextjs` (part-7):

- `src/app/(public)/(authentication)/...` — login, register, forgot-password
- `src/app/(public)/(marketing)/...` — home, about, services, pricing, contact, properties, payment
- `src/app/(dashboard)/dashboard|landlord|admin/...` — each with own `layout.tsx` wrapping RoleGuard + DashboardShell
- `src/api/*.api.ts` — thin API functions returning `apiClient` promises
- `src/hooks/*.hook.ts` — TanStack Query wrappers around api functions; always import from `@/hooks`
- `src/lib/apiClient.ts` — ofetch instance; injects `Authorization: Bearer` from localStorage
- `src/routes/*.routes.ts` — sidebar route config per role; `src/types/*.type.ts`; `src/validation/*.validation.ts`; `src/utils/*.util.ts`
- `src/components/{auth,dashboard,form,layout,modules,ui}` — guards, shell, forms, header/footer, feature modules, shadcn ui
- `src/assets/svg` — logo components

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build (Turbopack); the main verification step
- `npm start` — serve the production build
- `npm run lint` — eslint
- No typecheck script: run `npx tsc --noEmit` manually

## Setup

- `.env.local` must set `NEXT_PUBLIC_API_URL` (e.g. `https://housing-roommate-platform.vercel.app/api/v1`). Gitignored; `.env.example` is committed.
- `assignments/` root is a git repo pointing at the **backend** remote — never commit from there; this folder has its own git repo.

## Architecture notes (non-obvious)

- Auth: login stores JWT in localStorage key `accessToken` and sets `hr_role` cookie; `apiClient` reads localStorage for the Bearer header. `useGetMe` (`/auth/me`) drives guards/header. `AuthGuard`/`RoleGuard` in `src/components/auth` wrap protected layouts. `src/middleware.ts` also redirects via `hr_role` — cookie alone is UX, the API is the real guard.
- Roles: TENANT → `/dashboard`, LANDLORD + PROPERTY_MANAGER → `/landlord`, ADMIN → `/admin`. Middleware and layout `RoleGuard` both enforce this; keep both when adding routes.
- Theming: dark mode via `next-themes` (`ThemeProvider` in `src/providers/index.tsx`); toggle lives in the header. `@custom-variant dark` is set in `globals.css`, so `dark:` classes respond to the `.dark` class. `<html>` and `<body>` carry `suppressHydrationWarning` — do not remove.
- Root layout renders `<Providers>` **inside** `<body>` and `<Toaster>` as a sibling of `Providers`. Toaster must stay inside `<body>` (it renders a `<section>`), otherwise you get invalid nesting under `<html>`.
- bKash payment: `POST /payment/initiate` → `res.data.bkashCreateResponse.bkashURL` → full-page redirect; success/cancel land on `/payment/success` / `/payment/cancel` (both under `(public)/(marketing)`).
- Many backend list endpoints return a paginated envelope `{data: {data: [], meta}}` — unwrap `res.data.data` or `res.data.data.data` (see hooks/pages).
- Registration/OTP flows depend on Redis; on Vercel they need the `connectRedis()` fix in the backend to be deployed, else `{"message":"The client is closed"}`.
- Sidebar navigation is data-driven from `src/routes/*.routes.ts` via `DashboardSidebar`.
- Services page uses plain grouped sections (categories with dot markers); the earlier tabs experiment was reverted — do not reintroduce it.
- lucide-react v1.x removed brand icons (`Facebook`, `Twitter`, ...) — use Globe/Mail/Phone/etc. instead.

## Conventions

- Forms use `@tanstack/react-form` with zod v4 schemas from `@/validation` (zod v4: `z.email()`), `Field`/`FieldError` ui components.
- Toasts: `sonner` (`toast.success/error`).
- `Button` does not support `asChild` — use `<Button render={<Link href="/x" />}>label</Button>`.
- `cn` comes from the `cn` npm package (`import { cn } from "cn"`), theme tokens in `src/app/globals.css` `@theme inline`.
- Demo credentials and route map live in README.md.
