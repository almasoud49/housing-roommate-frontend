# AGENTS.md

Next.js 16 frontend (App Router, React 19, TS, Tailwind v4, shadcn/ui) for the Housing & Roommate Platform. Consumes the separate backend at `housing-roommate-platform/` (Express + Prisma + bKash). No tests, no CI.

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build (Turbopack); this is the main verification step
- `npm start` — serve the production build
- `npm run lint` — eslint
- No typecheck script: run `npx tsc --noEmit` manually

## Setup

- `.env.local` must set `NEXT_PUBLIC_API_URL` (e.g. `https://housing-roommate-platform.vercel.app/api/v1`). It is gitignored; `.env.example` is committed.
- Frontend and backend repos are separate. `assignments/` root is a git repo pointing at the **backend** remote — never commit from there; this folder has its own git repo.

## Architecture notes (non-obvious)

- App Router groups: public pages at root, tenant at `/dashboard/*`, landlord at `/landlord/*`, admin at `/admin/*`, payment at `/payment/*`.
- `src/middleware.ts` gates `/dashboard`, `/landlord`, `/admin` via the `hr_role` cookie. UI must also check role via `useAuth()` — middleware alone is UX, not security.
- Auth flow: `POST /auth/login` → `accessToken` JWT in response body. Zustand store in `src/store/auth.ts` persists it to `localStorage` key `hr-auth` and sets `hr_role` cookie. Axios interceptor in `src/lib/api.ts` reads localStorage and sets `Authorization: Bearer`. Do not fetch with raw `fetch` in client components — use `api`.
- Every list/data page must keep filter/sort/pagination state in the URL via `useSearchParams` so views are shareable.
- Use `loading.tsx` + skeletons, error boundaries (`error.tsx`), and Sonner toasts for API failures.

## UI gotchas

- shadcn/ui here is style `base-nova`: components import from `@base-ui/react/*`, **not** Radix. `Button` does not support `asChild` — use `<Button render={<Link href="/x" />}>label</Button>`.
- Class merging imports `cn` from the `cn` npm package (`import { cn } from "cn"`), not from `@/lib/utils`.
- Theme tokens live in `src/app/globals.css` (`@theme inline` mapping); don't re-add dark `prefers-color-scheme` blocks.

## Forms / validation

- React Hook Form + Zod (**zod v3** — use `z.string().email()`, not `z.email()`).
- Client schemas roughly mirror backend zod schemas in `housing-roommate-platform/src/app/module/*/*.validation.ts`; when unsure of an API payload, check those first (e.g. maintenance create requires `roomId` + `category`; applications create requires `roomId`).

## Backend integration notes

- Payment: `POST /payment/initiate {applicationId, amount, currency:"BDT"}` → response contains `bkashCreateResponse.bkashURL` → redirect browser there; bKash callback returns to `/payment/success` or `/payment/cancel`.
- Registration/verify-email/forgot-password require OTP via email (Redis-backed). If the deployed backend hasn't been redeployed with the Redis `connectRedis()` fix, these endpoints return `{"message":"The client is closed"}`.
- Demo login accounts (also hardcoded on `/login`): see README.md.
- Notifications list endpoint returns a paginated `{data, meta}` envelope, not a bare array — several list endpoints do this; unwrap `res.data.data.data` or use the array-unwrapping seen in existing pages.
