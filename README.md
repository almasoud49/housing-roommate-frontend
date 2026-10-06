# Housing & Roommate Platform — Frontend

Next.js (App Router) + TypeScript frontend for the Housing & Roommate Platform.

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 + shadcn/ui (base-nova)
- TanStack Query (server state), Zustand (auth state)
- React Hook Form + Zod
- Recharts, Sonner, Lucide icons

## Getting Started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm run dev
```

Production backend used: `https://housing-roommate-platform.vercel.app/api/v1`

## Demo Login Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | testeradmin@gmail.com | Tester@admin12345 |
| Landlord | demo.landlord@housing.com | Demo@12345 |
| Tenant | demo.tenant@housing.com | Demo@12345 |

All three are available as one-click buttons on `/login`.

## Routes

- Public: `/`, `/about`, `/services`, `/pricing`, `/contact`, `/properties`, `/properties/[id]`, `/login`, `/register`, `/forgot-password`, `/payment/success`, `/payment/cancel`
- Tenant: `/dashboard`, `/dashboard/applications`, `/dashboard/payments`, `/dashboard/viewings`, `/dashboard/maintenance`, `/dashboard/roommate`, `/dashboard/notifications`, `/dashboard/profile`
- Landlord: `/landlord`, `/landlord/properties`, `/landlord/properties/new`, `/landlord/applications`, `/landlord/earnings`, `/landlord/profile`
- Admin: `/admin`, `/admin/users`, `/admin/audit-logs`, `/admin/settings`

## Notes
- Role-based routing is enforced both in `middleware.ts` and in UI rendering.
- Payment flow uses the backend's bKash sandbox integration: initiate → bKash redirect → success/cancel pages.
