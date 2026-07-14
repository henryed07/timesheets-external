# Timesheets (Netlify / Next.js edition)

A Next.js rewrite of the timesheeting app, built to run natively on Netlify (Netlify Functions have no Python support, so this is a from-scratch port of the Django app in the parent folder, not a deployment of it).

## Stack

- **Next.js 16** (App Router, Server Actions) + TypeScript + Tailwind
- **Prisma 7** ORM with the `@prisma/adapter-pg` driver adapter, targeting Postgres
- **Custom session auth**: `jose`-signed JWT in an httpOnly cookie (no third-party auth library), following the pattern in Next.js's own auth guide
- `bcryptjs` for password hashing, `zod` for validation

## Features

- Self-service registration for external contractors, picking an existing supplier company or adding a new one
- Profile page (name, email, job title, phone, company)
- Weekly timesheets: create a Mon-Sun week, fill in daily hours + notes, save as draft, submit for approval
- Every timesheet carries the submitting user's company/supplier
- Staff-only review dashboard (`/admin`, requires `role = STAFF`) to filter by status/company and approve/reject with a comment
- Route protection via `src/proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`)

## Local development

A local dev Postgres (via Prisma's embedded dev server) is used instead of Docker:

```bash
npx prisma dev -d          # starts a local Postgres, prints a DATABASE_URL
# copy that DATABASE_URL into .env if it changes port
npm install
npm run build               # runs `prisma generate` then `next build`
npm run dev
```

Seed a staff (admin) account:

```bash
npm run db:seed              # creates admin@example.com / AdminPass123! with role STAFF
```

Regular users self-register at `/register`, which always creates `role: EMPLOYEE`.

## Database migrations

The initial schema is checked in at `prisma/migrations/20260101000000_init`. Locally this was applied with `prisma db push` because the embedded dev Postgres doesn't support Prisma's shadow-database flow that `migrate dev` needs — this only affects local iteration. Against a real Postgres (Netlify DB / Neon, or any other), use:

```bash
npm run db:migrate           # prisma migrate deploy
```

## Deploying to Netlify

1. Push this folder to its own git repository (it's already initialized here) and connect it as a site in Netlify — Netlify auto-detects Next.js and installs the adapter (`@netlify/plugin-nextjs`) automatically, no extra config needed beyond `netlify.toml`.
2. Provision a database: **Netlify DB** (Neon-backed) is the simplest option — `netlify db init` after `netlify login`, or point `DATABASE_URL` at any Postgres instance.
3. Set environment variables on the Netlify site: `DATABASE_URL`, `SESSION_SECRET` (`openssl rand -base64 32`).
4. Run `npm run db:migrate` against that database once (locally with `DATABASE_URL` pointed at it, or via a Netlify build hook) before first deploy, and run `npm run db:seed` once to create a staff account.
5. Deploy (`git push` to the connected branch, or `netlify deploy --prod`).

## Key routes

| Route | Purpose |
|---|---|
| `/register` | External user sign-up |
| `/login` | Login |
| `/profile` | Edit profile & company |
| `/timesheets` | My timesheets |
| `/timesheets/new` | Create a new weekly timesheet |
| `/timesheets/[id]` | View/edit/submit a timesheet |
| `/admin` | Staff-only review dashboard |
| `/admin/[id]` | Review/approve/reject a submitted timesheet |

## Notes

- `SESSION_SECRET` in `.env` is a dev-only placeholder — generate a real one for any deployed environment.
- Staff accounts aren't self-serviceable by design; create them via `npm run db:seed` or directly in the database.
