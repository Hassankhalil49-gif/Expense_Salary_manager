# Design System

**Product:** Expense & Salary Manager  
**Last updated:** 2026-09-05  
**UI kit:** [shadcn/ui](https://ui.shadcn.com) — **New York** style, **Neutral** base, CSS variables  
**Icons:** Lucide React  
**Fonts:** Geist Sans (UI), Geist Mono (code/numeric optional)

This document describes the **current** visual system encoded in the repo. Prefer tokens and existing primitives over one-off styles.

---

## 1. Principles

1. **Product UI, not marketing** — dense but calm dashboard; clear hierarchy.
2. **Token-first** — colors, radius, and borders via CSS variables / Tailwind semantic classes.
3. **Compose, don’t fork** — use `components/ui/*`; extend with feature components.
4. **Light & dark equal** — every surface must work in both themes (`next-themes`, `class` strategy).
5. **One job per view** — pages stay thin; feature components own interaction.

---

## 2. Foundations

### 2.1 Color tokens

Defined in `app/globals.css` as HSL channels (no `hsl()` wrapper in the variable). Consumed via Tailwind in `tailwind.config.ts`.

| Token | Usage |
|-------|--------|
| `background` / `foreground` | Page canvas and default text |
| `card` / `card-foreground` | Panels, sidebar, summary cards |
| `popover` | Dropdowns, popovers |
| `primary` / `primary-foreground` | Primary buttons, strong emphasis |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Subtle backgrounds, helper text |
| `accent` / `accent-foreground` | Hover/accent surfaces |
| `destructive` | Delete / danger actions |
| `border` / `input` / `ring` | Borders, form controls, focus rings |
| `chart-1` … `chart-5` | Recharts series colors |

**Do:** `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`.  
**Don’t:** hard-code `#fff`, `bg-gray-100`, or purple gradient flourishes unless introduced as a named token.

### 2.2 Radius

- `--radius: 0.5rem`
- Tailwind: `rounded-lg` → `var(--radius)`, `rounded-md` / `rounded-sm` derived

### 2.3 Typography

| Role | Implementation |
|------|----------------|
| Sans UI | `--font-geist-sans` on `body` (`font-sans`) |
| Mono | `--font-geist-mono` |
| Page titles | `text-2xl` / `text-3xl` + `font-semibold` (match dashboard header) |
| Section labels | `text-sm font-medium` |
| Helper / meta | `text-sm text-muted-foreground` |

Currency and amounts should use consistent formatting helpers (`lib/format/currency.ts`) rather than ad-hoc `toFixed` in JSX.

### 2.4 Spacing & layout

- Dashboard sidebar width: **16rem** (`w-64`) desktop; sheet **18rem** (`w-72`) mobile.
- Mobile top bar: **h-14**, sticky, blurred background.
- Page content: prefer consistent horizontal padding (`p-4` / `px-6` patterns already used in dashboard views).
- Cards: use `Card`, `CardHeader`, `CardTitle`, `CardContent` from `components/ui/card`.

### 2.5 Elevation & borders

Prefer **borders** (`border`, `border-r`) over heavy shadows. Shell uses `border-r` / `border-b`. Avoid multi-layer glow effects.

---

## 3. Theming

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
```

- Toggle: `components/theme/theme-toggle.tsx`
- Dark overrides live under `.dark` in `globals.css`
- Charts have separate light/dark `--chart-*` values — use `chart-1`…`chart-5` classes / CSS vars in Recharts

---

## 4. Components

### 4.1 Primitives (`components/ui/`)

Generated/maintained in shadcn New York style. Common set in use:

Button, Input, Label, Textarea, Select, Card, Badge, Avatar, Dialog, Sheet, Dropdown Menu, Separator, Skeleton, Table, Toast, Tooltip.

**Adding a primitive:**

```bash
npx shadcn@latest add <component>
```

Keep `components.json` settings (New York, neutral, CSS variables).

### 4.2 Feature components

| Area | Path | Notes |
|------|------|--------|
| Auth | `components/auth/` | Forms, layout, password input |
| Dashboard | `components/dashboard/` | Shell, sidebar, summary, charts, empty state |
| Income | `components/income/` | Page client, form dialog, delete dialog, summary cards |
| Theme | `components/theme/` | Provider + toggle |

**Pattern:** Server page loads data → passes props into a `*-page-client.tsx` for dialogs/tables.

### 4.3 Button variants

Use shadcn `Button` variants (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`) and sizes (`default`, `sm`, `lg`, `icon`). Icon-only controls need `aria-label`.

### 4.4 Feedback

- Toasts via `useToast` / `ToastProviderWrapper` for action success/failure.
- Inline `fieldErrors` from Server Actions on forms.
- Route `loading.tsx` + `error.tsx` under dashboard for async/error UX.

---

## 5. Navigation & IA

Sidebar items: `lib/dashboard/navigation.ts`.

| State | Presentation |
|-------|----------------|
| `enabled: true` | Active link |
| `enabled: false` | Visible but disabled / non-navigable placeholder |

Product name in chrome: **Salary & Expense Manager**.

---

## 6. Data display

### Summary cards

Use shared card layouts (`summary-cards`, `income-summary-cards`) — label, primary metric, optional hint. Keep numbers tabular/consistent.

### Charts

- Location: `components/dashboard/charts/`
- Library: Recharts
- Series colors: design tokens `chart-1`…`chart-5`
- Empty data: render empty state, not blank axes

### Tables / lists

Prefer `Table` primitive or existing income list patterns. Status → `Badge`. Destructive actions behind confirm dialog.

---

## 7. Forms

- Labels always associated with controls.
- Password fields: `PasswordInput` pattern from auth.
- Dialogs for create/edit (`Dialog`); confirm deletes in dedicated dialogs.
- Validate client-side (RHF + Zod) and again in Server Actions.

---

## 8. Responsive behavior

| Breakpoint | Behavior |
|------------|----------|
| `< lg` | Sidebar hidden; hamburger + Sheet |
| `≥ lg` | Fixed sidebar |

Touch targets for icon buttons should remain at least the default `size="icon"` button hit area.

---

## 9. Motion

Keep motion subtle:

- Sheet / dialog transitions from Radix defaults are enough.
- `ThemeProvider` uses `disableTransitionOnChange` to avoid flashy theme tweening.
- Do not add decorative infinite animations on the dashboard.

---

## 10. Accessibility checklist

- [ ] Icon buttons have accessible names
- [ ] Dialogs / sheets have titles (`SheetTitle`, dialog title)
- [ ] Color is not the only status signal (use Badge text)
- [ ] Focus rings visible (`ring` token)
- [ ] Contrast holds in light and dark

---

## 11. Do / Don’t

| Do | Don’t |
|----|--------|
| Use semantic tokens (`bg-card`, `text-muted-foreground`) | Invent a second palette in feature CSS |
| Reuse `components/ui` | Copy-paste Button styles into feature files |
| Match existing dashboard spacing | Introduce a new grid system per page |
| Enable nav only when the page works | Link to 404 placeholders |
| Format money via shared helpers | Inline currency strings inconsistently |

---

## 12. Related docs

- [Sources of truth](./SOURCE_OF_TRUTH.md)
- [PRD](./PRD.md)
- [System design](./SYSTEM_DESIGN.md)
- [Architecture](./ARCHITECTURE.md)
- [README](../README.md)
- Token source: `app/globals.css`, `tailwind.config.ts`, `components.json`
