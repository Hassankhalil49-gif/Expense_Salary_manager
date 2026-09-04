# Contributing

Thanks for collaborating on Expense & Salary Manager. Keep changes focused and reviewable.

## Workflow

1. Sync `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a branch from `main`:
   ```bash
   git checkout -b feature/short-description
   # or: fix/..., chore/..., docs/...
   ```
3. Implement, then verify locally:
   ```bash
   npm run lint
   npm run build   # recommended before opening a PR
   ```
4. Commit with a clear message (focus on **why**):
   ```bash
   git add .
   git commit -m "Add income status filter to dashboard queries"
   ```
5. Push and open a pull request:
   ```bash
   git push -u origin HEAD
   gh pr create
   ```

Prefer small PRs (one feature or fix). Rebase or merge `main` into your branch before requesting review if it has drifted.

## Branch naming

| Prefix | Use |
|--------|-----|
| `feature/` | New behavior or UI |
| `fix/` | Bug fixes |
| `chore/` | Tooling, deps, cleanup |
| `docs/` | Documentation only |
| `refactor/` | No intentional behavior change |

## Coding guidelines

- Match existing patterns in nearby files (imports, naming, Server Actions shape).
- Prefer Server Components; add `"use client"` only when needed.
- Put mutations in `lib/**/actions.ts` with `"use server"`. Always call `requireAuth()` (or equivalent) and validate with Zod.
- Return a consistent action result: `{ success: true, data? }` or `{ success: false, error, fieldErrors? }`.
- Revalidate affected paths after writes (`revalidatePath`).
- Keep Prisma access in query/action modules — avoid scattering `prisma` calls across UI components.
- Use `@/` path aliases; do not invent deep relative imports across top-level folders.
- UI: reuse `components/ui/*` (shadcn). Do not duplicate primitives.
- Do not commit secrets (`.env`, keys, dump files).

### Database changes

1. Edit `prisma/schema.prisma`.
2. Run `npm run db:migrate` and commit the generated migration under `prisma/migrations/`.
3. Avoid `db:push` on shared/production databases.

### Auth / security

- Never log passwords or hashes.
- Scope all user data queries by `userId` from the authenticated session.
- Keep middleware matchers in sync when adding protected routes.

## Pull request checklist

- [ ] Branch is up to date with `main`
- [ ] Lint passes (`npm run lint`)
- [ ] App builds (`npm run build`) if you touched app/lib/prisma code
- [ ] New env vars documented in `.env.example` and README
- [ ] Migrations included when the schema changed
- [ ] PR description explains **what** and **why**

## Product & design docs

Before large features, skim:

- [docs/SOURCE_OF_TRUTH.md](./docs/SOURCE_OF_TRUTH.md) — which files are canonical
- [docs/PRD.md](./docs/PRD.md) — what to build and priority
- [docs/SYSTEM_DESIGN.md](./docs/SYSTEM_DESIGN.md) — system decisions and diagrams
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — where code should live
- [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) — entities and ERD
- [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) — UI tokens and patterns

Update those docs in the same PR when you change scope, data model, or visual conventions. Agent guidance lives in [AGENTS.md](./AGENTS.md), [llms.txt](./llms.txt), and [.github/copilot-instructions.md](./.github/copilot-instructions.md).

## Getting help

Open a GitHub issue or ask in your team chat. Point to the relevant path under `app/`, `lib/`, or `components/` when possible.
