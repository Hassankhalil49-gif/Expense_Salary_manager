# GitHub Copilot instructions

Expense & Salary Manager — Next.js 15 App Router + Prisma/PostgreSQL + NextAuth v5 (Credentials, JWT) + Zod + shadcn/ui.

Before large changes, read `docs/SOURCE_OF_TRUTH.md`, then `docs/PRD.md` and `docs/ARCHITECTURE.md`.

## Must follow

- Prefer Server Components; use `"use client"` only for interactive UI.
- Put mutations in `lib/**/actions.ts` with `"use server"`.
- Call `requireAuth()` before any user-owned DB work; always filter by `userId` from the session — never trust a client-supplied user id.
- Validate inputs with Zod schemas in `lib/validations/*` before writes.
- Return action results as `{ success: true, data? }` or `{ success: false, error, fieldErrors? }`.
- Call `revalidatePath` after successful mutations.
- Use `@/` import aliases; reuse `components/ui/*`.
- Do not invent REST CRUD APIs when Server Actions already cover the feature.
- Do not commit secrets; add new env keys to `.env.example` only as placeholders.
- Prefer `prisma migrate` migrations; commit SQL under `prisma/migrations/`.
- Keep diffs minimal — no unrelated refactors.

## Feature layout

Match the income module:

- Domain: `lib/<feature>/` (actions, queries, types, constants)
- UI: `components/<feature>/`
- Route: `app/dashboard/<feature>/`
- Enable sidebar entry in `lib/dashboard/navigation.ts` only when the page works (`enabled: true`)

## Docs to update when shipping

- Requirements/status → `docs/PRD.md`
- Layers/flows/schema narrative → `docs/ARCHITECTURE.md`, `docs/SYSTEM_DESIGN.md`, `docs/DATA_MODEL.md`
- UI tokens/patterns → `docs/DESIGN_SYSTEM.md`

Full agent guidance: `AGENTS.md`. Product docs index: `docs/README.md`.
