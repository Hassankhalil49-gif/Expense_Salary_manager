# AGENTS.md

Guidance for AI coding agents working in this repository.

**Canonical index:** [docs/SOURCE_OF_TRUTH.md](./docs/SOURCE_OF_TRUTH.md)  
**Short map for LLMs:** [llms.txt](./llms.txt)

## Project

Expense & Salary Manager — Next.js 15 App Router app for personal income tracking (expenses/budgets planned). Stack: React 19, Prisma + PostgreSQL, NextAuth v5 (Credentials + JWT), Zod, Tailwind, shadcn/ui.

## Hard rules

1. **Do not commit secrets.** Never write real credentials into tracked files. Update `.env.example` with placeholder keys only.
2. **Do not invent APIs.** Prefer existing Server Actions under `lib/**/actions.ts` over new REST routes unless the user asks for an API.
3. **Always scope data by user.** Any Prisma read/write on user-owned models must filter by authenticated `userId` (`requireAuth()` / session).
4. **Validate inputs with Zod** schemas in `lib/validations/*` before DB writes.
5. **Match local style.** Read a nearby file before editing. Preserve existing ActionResult shapes, import order, and folder layout.
6. **Minimal diffs.** No drive-by refactors, unrelated formatting, or unsolicited README rewrites unless asked.
7. **Database:** Prefer `prisma migrate` migrations for schema changes; commit SQL under `prisma/migrations/`.
8. **Docs stay current.** When changing scope, schema, or conventions, update the matching file under `docs/` (see Source of Truth).

## Where things live

| Concern | Location |
|---------|----------|
| Routes / pages | `app/` |
| Auth config & session | `lib/auth/` |
| Income domain | `lib/income/`, `components/income/`, `app/dashboard/income/` |
| Dashboard aggregates | `lib/dashboard/`, `components/dashboard/` |
| Zod schemas | `lib/validations/` |
| Prisma client | `lib/db/prisma.ts` |
| Schema & migrations | `prisma/` |
| Middleware guard | `middleware.ts` |
| shadcn UI | `components/ui/` |

## Implementation patterns

### Server Actions

```ts
"use server";

export async function createThing(input: unknown): Promise<ActionResult<...>> {
  const user = await requireAuth();
  const parsed = thingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", fieldErrors: ... };
  }
  // prisma create scoped to user.id
  revalidatePath("/dashboard/...");
  return { success: true, data: ... };
}
```

### New protected page

1. Add route under `app/dashboard/...`.
2. Ensure middleware still matches (`/dashboard/:path*` already covers it).
3. Load data in a Server Component via `lib/` helpers; keep client islands small.
4. Wire nav in `lib/dashboard/navigation.ts` (`enabled: true` when ready).

### New Prisma model

1. Update `prisma/schema.prisma`.
2. Add migration (`npm run db:migrate`).
3. Add types/queries/actions + validations.
4. Update `docs/DATA_MODEL.md`.
5. Do not expose other users' rows.

## Planned features (nav placeholders)

Expenses, budgets, savings goals, recurring expenses, transactions, reports, insights, settings — see `lib/dashboard/navigation.ts` (`enabled: false`). Implement behind feature branches; enable nav only when the page works.

## Commands agents may run

```bash
npm install
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run dev
```

Do not force-push, amend others' commits, or change git config unless the user explicitly asks.

## Product docs (read before large features)

| Doc | When to use |
|-----|-------------|
| [docs/SOURCE_OF_TRUTH.md](./docs/SOURCE_OF_TRUTH.md) | Which file is canonical |
| [docs/PRD.md](./docs/PRD.md) | Scope, priorities, feature status |
| [docs/SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md) | Decisions, system diagrams |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Layers, auth/data flow, module shape |
| [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) | ERD and entity specs |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | Tokens, components, theming, a11y |

When shipping a new module: update PRD status, architecture/data model (if schema/layers change), and design notes if you introduce tokens or patterns.

## Shared agent context on GitHub

These files are committed so Cursor, GitHub Copilot, and other tools see the same rules:

| File | Role |
|------|------|
| `AGENTS.md` | This file |
| `llms.txt` | Compact LLM entrypoint |
| `.github/copilot-instructions.md` | Copilot repo instructions |
| `.cursor/rules/*.mdc` | Cursor scoped/always rules |

## Docs to keep in sync

When you add env vars, scripts, or major folders: update `.env.example`, `README.md`, and this file if agent guidance changes.
