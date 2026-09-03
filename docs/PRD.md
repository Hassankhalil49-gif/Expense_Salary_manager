# Product Requirements Document (PRD)

**Product:** Expense & Salary Manager  
**Status:** Active development (MVP in progress)  
**Last updated:** 2026-09-03  
**Repo:** [Expense_Salary_manager](https://github.com/Hassankhalil49-gif/Expense_Salary_manager)

---

## 1. Vision

Give individuals a simple, private place to track salary and other income, understand monthly cash flow, and (soon) manage expenses, budgets, and savings goals — without spreadsheet chaos.

## 2. Problem

People earn from multiple sources (salary, freelance, business, investments) and struggle to see:

- What came in this month vs what went out
- Pending vs received income
- Progress toward savings
- Recurring money patterns

Existing tools are either too heavy, too sales-driven, or not tailored to salary + side-income workflows.

## 3. Goals

### Primary (MVP)

1. Secure account (register / login).
2. Record and manage income entries with type, status, and recurrence.
3. Dashboard summary for the current month (income, expenses placeholder, savings math).
4. Responsive UI with light/dark theme.

### Secondary (post-MVP)

5. Full expense tracking and categories.
6. Budgets and alerts.
7. Savings goals.
8. Recurring expenses and transaction ledger.
9. Reports and insights.

### Non-goals (for now)

- Multi-user households / shared budgets
- Bank sync / Open Banking
- Tax filing or payroll
- Mobile native apps
- Multi-currency FX conversion engine

## 4. Personas

| Persona | Needs |
|---------|--------|
| **Salaried professional** | Log paycheck, bonuses; see monthly leftovers |
| **Freelancer / hybrid earner** | Multiple income sources, pending invoices |
| **Budget-conscious saver** | Goals, recurring costs, category spend (later) |

## 5. User journeys

### 5.1 Auth

1. Visit `/` → redirect to `/login` (or `/dashboard` if already signed in).
2. Register with name, email, password → land on dashboard.
3. Login with credentials → JWT session (30-day max age).

### 5.2 Income

1. Open **Income** (`/dashboard/income`).
2. Add income: amount, source, type, date, status, notes, recurring flag.
3. Edit / delete / update status (received ↔ pending).
4. See list + summary cards for the period.

### 5.3 Dashboard

1. Open **Dashboard** (`/dashboard`).
2. View summary cards (income, expenses, savings, rate).
3. View charts when data exists; empty state when not.
4. See recent income transactions.

## 6. Functional requirements

### Auth

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| A1 | Email + password registration with validation | P0 | Done |
| A2 | Login / logout | P0 | Done |
| A3 | Protect `/dashboard/*` routes | P0 | Done |
| A4 | Password hashing (bcrypt) | P0 | Done |

### Income

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| I1 | CRUD income records scoped to user | P0 | Done |
| I2 | Types: SALARY, FREELANCE, BUSINESS, INVESTMENT, BONUS, OTHER | P0 | Done |
| I3 | Status: RECEIVED, PENDING | P0 | Done |
| I4 | Recurring flag + notes | P1 | Done |
| I5 | Decimal amounts (2 places), positive only | P0 | Done |

### Dashboard

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| D1 | Current-month income total | P0 | Done |
| D2 | Summary: expenses, savings, savings rate | P0 | Partial (expenses = 0 until expenses ship) |
| D3 | Charts: income vs expenses, categories, savings trend | P1 | Scaffolded; expenses empty |
| D4 | Recent transactions list | P1 | Done (income) |
| D5 | Empty states | P1 | Done |

### Planned modules

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| E1 | Expense CRUD + categories | P0 | Not started |
| B1 | Budgets per category/period | P1 | Not started |
| S1 | Savings goals | P1 | Not started |
| R1 | Recurring expenses | P1 | Not started |
| T1 | Unified transactions view | P2 | Not started |
| P1 | Reports / insights | P2 | Not started |
| C1 | Settings (profile, currency, preferences) | P2 | Not started |

Nav placeholders live in `lib/dashboard/navigation.ts` (`enabled: false`).

## 7. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Security | User data isolation by `userId`; no plaintext passwords; secrets in env |
| Performance | Server Components for reads; Turbopack in dev |
| Accessibility | Semantic labels, sheet titles, icon button aria-labels |
| Theming | System / light / dark via `next-themes` |
| Reliability | Zod validation; Server Action result objects for expected failures |
| Maintainability | Feature folders under `lib/` + `components/`; Prisma migrations |

## 8. Success metrics (suggested)

- Time-to-first income entry &lt; 2 minutes after register
- Weekly active users logging ≥ 1 income or expense
- Zero cross-user data leaks in QA
- p95 dashboard load under 2s on typical laptop + local DB

## 9. Risks & open questions

| Risk / question | Notes |
|-----------------|--------|
| Currency | Single currency assumed for MVP — confirm default (e.g. USD/PKR) in Settings later |
| Recurring income generation | Flag exists; auto-creating future rows not specified yet |
| Expenses schema | Should align with income (amount, date, category, status) for unified transactions |
| Hosting | TBD (Vercel + managed Postgres recommended) |

## 10. Release phases

| Phase | Scope |
|-------|--------|
| **MVP** | Auth + Income + Dashboard (current) |
| **v1** | Expenses + categories + dashboard charts with real spend |
| **v1.1** | Budgets + recurring expenses |
| **v2** | Savings goals, reports, insights, settings |

## 11. Related docs

- [Architecture](./ARCHITECTURE.md)
- [Design system](./DESIGN_SYSTEM.md)
- [Contributing](../CONTRIBUTING.md)
- [Agents](../AGENTS.md)
