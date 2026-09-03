# Expense & Salary Manager

Personal finance web app for tracking salary/income and (planned) expenses, budgets, and savings. Built with **Next.js 15**, **Prisma**, **PostgreSQL**, and **NextAuth**.

**Repo:** [Hassankhalil49-gif/Expense_Salary_manager](https://github.com/Hassankhalil49-gif/Expense_Salary_manager)

## Features

| Area | Status |
|------|--------|
| Email/password auth (register, login, JWT sessions) | Done |
| Dashboard shell, charts, summary cards | Done |
| Income CRUD (types, status, recurring, notes) | Done |
| Expenses, budgets, savings goals, reports | Planned (nav placeholders) |

## Tech stack

- **Framework:** Next.js 15 (App Router, Turbopack in dev)
- **UI:** React 19, Tailwind CSS, shadcn/ui (New York), Lucide icons
- **Auth:** NextAuth v5 (Credentials + Prisma adapter)
- **Validation:** Zod + React Hook Form
- **DB:** PostgreSQL via Prisma ORM
- **Charts:** Recharts

## Prerequisites

- Node.js **18+** (20+ recommended)
- npm **10+**
- A running **PostgreSQL** database (local or hosted)

## Quick start

```bash
# 1. Clone
git clone https://github.com/Hassankhalil49-gif/Expense_Salary_manager.git
cd Expense_Salary_manager

# 2. Install
npm install

# 3. Environment
cp .env.example .env
# Edit .env — set DATABASE_URL and AUTH_SECRET

# 4. Database
npm run db:generate
npm run db:migrate

# 5. Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login`. Register a user, then use the dashboard.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Secret for NextAuth JWT/session signing |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/expense_salary_manager?schema=public"
AUTH_SECRET="your-generated-secret"
```

Never commit `.env` — it is gitignored.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply migrations (`prisma migrate dev`) |
| `npm run db:push` | Push schema without a migration (prototyping) |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
app/                    # App Router pages & API routes
  (auth)/               # Login & register
  dashboard/            # Protected dashboard + income
  api/auth/             # NextAuth route handlers
components/
  auth/                 # Auth UI
  dashboard/            # Shell, charts, summary
  income/               # Income forms & tables
  ui/                   # shadcn primitives
lib/
  auth/                 # NextAuth config, session helpers, actions
  dashboard/            # Dashboard data & calculations
  income/               # Income queries, actions, types
  validations/          # Zod schemas
  db/                   # Prisma client singleton
prisma/
  schema.prisma         # Data models
  migrations/           # SQL migrations
middleware.ts           # Protects /dashboard; redirects auth pages
```

## Architecture notes

- **Server Components** by default; client components only where interactivity is needed (`"use client"`).
- **Mutations** go through Server Actions in `lib/*/actions.ts` (`"use server"`), not REST handlers.
- **Auth:** Credentials provider + JWT strategy; `requireAuth()` / middleware guard `/dashboard/*`.
- **Validation:** Zod schemas in `lib/validations/*` before DB writes.
- **Money:** Prisma `Decimal`; format helpers live under `lib/income/decimal.ts` and `lib/format/`.

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/PRD.md](./docs/PRD.md) | Product requirements, phases, feature status |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, layers, data flow |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | UI tokens, components, theming |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Branching, PRs, coding conventions |
| [AGENTS.md](./AGENTS.md) | Guidance for AI coding agents |
| [.cursor/rules/](./.cursor/rules/) | Cursor project rules |

## License

Private collaboration project. Ask the repo owner before redistributing.
