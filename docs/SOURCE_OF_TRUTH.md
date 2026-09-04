# Sources of Truth

**Product:** Expense & Salary Manager  
**Last updated:** 2026-09-05  
**Purpose:** Single map of which files are canonical for product, code, agents, and external tools (Cursor, GitHub Copilot, Claude Code, etc.).

When documents conflict, prefer the **code + schema** over prose, then resolve by updating the stale doc in the same change.

---

## 1. How to use this file

| Audience | Start here |
|----------|------------|
| Humans (product / eng) | [PRD](./PRD.md) → [System design](./SYSTEM_DESIGN.md) → [Architecture](./ARCHITECTURE.md) |
| AI coding agents | Root [AGENTS.md](../AGENTS.md) → this file → linked docs |
| GitHub Copilot | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) |
| Generic LLM / scrapers | Root [`llms.txt`](../llms.txt) |

---

## 2. Product & design (intent)

| Concern | Canonical file | Notes |
|---------|----------------|-------|
| What we build, priorities, status | [`docs/PRD.md`](./PRD.md) | Update status tables when shipping |
| Why / how the system is designed | [`docs/SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md) | Decisions, C4 views, trade-offs |
| Runtime layers, flows, module pattern | [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) | Must match `lib/` + `app/` |
| Entities, fields, relationships | [`docs/DATA_MODEL.md`](./DATA_MODEL.md) + [`prisma/schema.prisma`](../prisma/schema.prisma) | Schema wins on conflict |
| UI tokens & conventions | [`docs/DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Tokens live in `app/globals.css` |
| Docs index | [`docs/README.md`](./README.md) | Keep links current |

---

## 3. Runtime code (implementation)

| Concern | Canonical location |
|---------|-------------------|
| Routes / pages | `app/` |
| Auth (NextAuth, session, register/login) | `lib/auth/` |
| Route protection | `middleware.ts` |
| Income domain | `lib/income/`, `components/income/`, `app/dashboard/income/` |
| Dashboard aggregates & nav | `lib/dashboard/`, `components/dashboard/` |
| Zod schemas | `lib/validations/` |
| Prisma client | `lib/db/prisma.ts` |
| Schema & migrations | `prisma/schema.prisma`, `prisma/migrations/` |
| Money formatting | `lib/format/currency.ts`, `lib/income/decimal.ts` |
| Env contract | `.env.example` (never `.env`) |
| Nav feature flags | `lib/dashboard/navigation.ts` (`enabled`) |

---

## 4. Agent & IDE context (shared on GitHub)

These files are **committed** so any clone (and any tool that reads the repo) gets the same rules.

| File | Role | Consumed by |
|------|------|-------------|
| [`AGENTS.md`](../AGENTS.md) | Hard rules + patterns for coding agents | Cursor, Claude Code, Codex, humans |
| [`llms.txt`](../llms.txt) | Short machine-readable project map | LLM tools / crawlers |
| [`.cursor/rules/*.mdc`](../.cursor/rules/) | Always-on / scoped Cursor rules | Cursor |
| [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | Repo-wide Copilot guidance | GitHub Copilot |
| This file | Index of canonical sources | All of the above |

### Cursor rules (detail)

| Rule file | Scope |
|-----------|--------|
| `project.mdc` | Always — core conventions |
| `auth.mdc` | Auth-related files |
| `prisma.mdc` | Schema / DB |
| `server-actions.mdc` | Mutations / validation |
| `ui-next.mdc` | App Router / UI |
| `docs.mdc` | Edits under `docs/` |

---

## 5. Conflict resolution order

1. **Security & tenancy** — `requireAuth()` + `userId` filter; never trust client `userId`.
2. **`prisma/schema.prisma` + migrations** — data shape.
3. **Working Server Actions / queries** — behavior.
4. **Zod schemas** in `lib/validations/` — accepted inputs.
5. **PRD / architecture / design docs** — intent; update them when code intentionally diverges.
6. **Agent instructions** — must mirror code patterns, not invent new ones.

---

## 6. Maintenance checklist

When you change scope, schema, or conventions, update in the **same PR**:

- [ ] Status / requirements in `docs/PRD.md`
- [ ] Flows or layers in `docs/ARCHITECTURE.md` / `docs/SYSTEM_DESIGN.md`
- [ ] Entities in `docs/DATA_MODEL.md` if schema changed
- [ ] Tokens/patterns in `docs/DESIGN_SYSTEM.md` if UI conventions changed
- [ ] `.env.example` + README if env vars changed
- [ ] `AGENTS.md` / Cursor rules / `llms.txt` / Copilot instructions if agent guidance changed
- [ ] `lib/dashboard/navigation.ts` — set `enabled: true` only when the route works

---

## 7. Related

- [Contributing](../CONTRIBUTING.md)
- [README](../README.md)
