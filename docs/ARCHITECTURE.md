# Architecture

**Product:** Expense & Salary Manager  
**Last updated:** 2026-09-03

This document describes how the system is structured today and how new features should plug in.

---

## 1. High-level overview

```
┌─────────────┐     HTTPS      ┌──────────────────────────────┐
│   Browser   │ ◄────────────► │  Next.js 15 (App Router)     │
└─────────────┘                │  - RSC pages                 │
                               │  - Client islands            │
                               │  - Server Actions            │
                               │  - NextAuth route handlers   │
                               │  - Middleware (auth gate)    │
                               └──────────────┬───────────────┘
                                              │
                                              ▼
                               ┌──────────────────────────────┐
                               │  PostgreSQL (Prisma ORM)     │
                               │  User, Account, Session,     │
                               │  Income (+ future Expense…)  │
                               └──────────────────────────────┘
```

- **No separate backend service** — domain logic lives in `lib/` and runs on the Next.js server.
- **Primary mutation path** — Server Actions (`"use server"`), not REST CRUD APIs.
- **Auth** — NextAuth v5 Credentials provider, JWT sessions, Prisma adapter for account/session tables.

---

## 2. Runtime & request flow

### Public / auth pages

```
GET /  →  auth()  →  /dashboard (signed in) or /login
GET /login | /register  →  middleware redirects to /dashboard if already signed in
```

### Protected dashboard

```
Request /dashboard/*
  → middleware (NextAuth authorized callback)
  → layout (DashboardShell)
  → page Server Component
  → lib/*/get-*-data.ts or queries (Prisma, scoped by userId)
  → components (RSC + client children)
```

### Mutations

```
Client form / dialog
  → Server Action (lib/**/actions.ts)
  → requireAuth()
  → Zod safeParse
  → Prisma write (userId scoped)
  → revalidatePath(...)
  → ActionResult { success | error }
```

---

## 3. Layering

| Layer | Responsibility | Location |
|-------|----------------|----------|
| **Routes** | Thin pages, layouts, loading/error UI | `app/` |
| **UI** | Presentational + interactive components | `components/` |
| **Domain** | Queries, actions, calculations, types | `lib/<feature>/` |
| **Validation** | Zod schemas | `lib/validations/` |
| **Auth** | NextAuth config, session helpers | `lib/auth/` |
| **Persistence** | Schema, migrations, Prisma client | `prisma/`, `lib/db/` |
| **Edge gate** | Route protection | `middleware.ts` |

**Dependency direction:** `app` → `components` → `lib` → `prisma` / DB.  
Avoid importing from `app/` into `lib/`. Avoid Prisma calls inside pure UI components.

---

## 4. Feature module pattern

Each feature should follow the income module shape:

```
lib/<feature>/
  actions.ts      # "use server" mutations
  queries.ts      # DB reads (user-scoped)
  types.ts        # Shared TS types
  constants.ts    # Enums / labels
  get-*-data.ts   # Page-level aggregate loaders (optional)
  *.ts            # Helpers (decimal, etc.)

components/<feature>/
  *-page-client.tsx
  *-form-dialog.tsx
  ...

app/dashboard/<feature>/
  page.tsx
  loading.tsx
```

Enable the sidebar entry in `lib/dashboard/navigation.ts` only when the route is usable.

---

## 5. Data model (current)

```
User 1──* Account
User 1──* Session
User 1──* Income

Income:
  amount Decimal(12,2)
  source, type (enum), date, status (enum)
  notes?, recurring, timestamps
```

Auth-related models (`Account`, `Session`, `VerificationToken`) support the Prisma adapter / NextAuth ecosystem even though the app uses JWT session strategy for Credentials.

### Future entities (planned)

- `Expense` (+ `ExpenseCategory`)
- `Budget`
- `SavingsGoal`
- `RecurringExpense` or recurrence rules
- Optional unified `Transaction` view (computed or table)

All user-owned tables must include `userId` + cascade delete from `User`.

---

## 6. Auth architecture

| Piece | Role |
|-------|------|
| `lib/auth/auth.config.ts` | Edge-safe callbacks + pages; used by middleware |
| `lib/auth/auth.ts` | Full NextAuth (adapter, Credentials, JWT/session callbacks) |
| `lib/auth/session.ts` | `requireAuth()` for Server Actions / RSC |
| `lib/auth/actions.ts` | Register / sign-in / sign-out actions |
| `middleware.ts` | Matcher: `/dashboard/:path*`, `/login`, `/register` |
| `types/next-auth.d.ts` | Session user `id` typing |

**Rules:** never trust client-supplied `userId`; always take identity from the session.

---

## 7. Frontend architecture

- **Fonts:** Geist Sans / Geist Mono (`app/layout.tsx`).
- **Theme:** `ThemeProvider` (`next-themes`), class-based dark mode.
- **Shell:** `DashboardShell` — desktop sidebar + mobile sheet.
- **Charts:** Recharts under `components/dashboard/charts/`.
- **Toasts:** Radix toast wrappers in `components/ui/`.
- **Forms:** React Hook Form + Zod resolvers on client; Server Actions on submit.

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for tokens and UI conventions.

---

## 8. Configuration & ops

| Concern | Approach |
|---------|----------|
| Env | `DATABASE_URL`, `AUTH_SECRET` (see `.env.example`) |
| Scripts | `scripts/run.mjs` wraps local `next` / `eslint` / `prisma` binaries |
| Migrations | `prisma/migrations` via `npm run db:migrate` |
| Lint | ESLint flat config (`eslint.config.mjs`) |
| Deploy (recommended) | Vercel + managed Postgres; set env vars; run migrations in CI/release |

---

## 9. Security model

1. Middleware blocks unauthenticated access to dashboard routes.
2. Server Actions call `requireAuth()` before any mutation.
3. Every query filters by `user.id`.
4. Passwords stored as `passwordHash` only (bcrypt).
5. Secrets never committed; `.env` gitignored.

---

## 10. Extensibility checklist (new feature)

1. PRD: add requirements + status in [PRD.md](./PRD.md).
2. Schema + migration.
3. `lib/validations` + `lib/<feature>` queries/actions.
4. `components/<feature>` + `app/dashboard/<feature>` page.
5. Wire nav (`enabled: true`).
6. Update dashboard aggregations if the home view should reflect new data.
7. Update this architecture doc if layers or data model change.

---

## 11. Related docs

- [PRD](./PRD.md)
- [Design system](./DESIGN_SYSTEM.md)
- [README](../README.md)
- [AGENTS](../AGENTS.md)
