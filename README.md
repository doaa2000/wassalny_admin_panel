# Wasalny — Admin Console

A production-ready **Vue 3 + TypeScript** admin dashboard for the Wasalny
ride-hailing platform, converted pixel-faithfully from the provided UI/UX
design. It ships with light/dark theming, full **Arabic ⇄ English (RTL/LTR)**
localisation, charts, reusable tables, and a clean, swappable data layer.

## Tech stack

| Concern        | Choice                                |
| -------------- | ------------------------------------- |
| Framework      | Vue 3 (`<script setup>`, Composition API) |
| Language       | TypeScript (strict)                   |
| Build          | Vite                                  |
| Routing        | Vue Router 4 (lazy-loaded screens)    |
| State          | Pinia                                 |
| Styling        | Tailwind CSS + CSS-variable design tokens |
| Charts         | Chart.js                              |
| Validation     | Zod (driver onboarding wizard)        |
| Networking     | Axios-ready + Supabase SDK            |

## Getting started

```bash
npm install
cp .env.example .env      # optional — app runs on mock data by default
npm run dev               # http://localhost:5173
npm run build             # type-check + production bundle
npm run type-check
```

The app **runs with zero backend configuration**: `VITE_USE_MOCK=true`
(the default) serves every screen from in-memory data sources.

## Architecture (Clean Architecture + SOLID)

The codebase separates presentation, domain, and data concerns so the backend
(currently Supabase) can be replaced — REST, Laravel, Node, ASP.NET — **without
touching any UI code**.

```
UI (pages/components)
    └─► Pinia store / composable
            └─► Repository  (domain interface)
                    └─► DataSource  (Supabase | Mock | REST …)
                            └─► Backend
```

```
src/
├── core/
│   ├── config/        # env + Supabase client (the ONLY direct SDK import)
│   ├── constants/     # palette, icons, navigation, i18n, documents
│   ├── composables/   # useI18n, useAsyncData, useDataTable, useThemeTokens
│   ├── domain/        # entities + repository interfaces (no framework deps)
│   ├── data/
│   │   ├── datasources/   # contracts + Mock + Supabase implementations
│   │   ├── repositories/  # repositories that depend on data-source contracts
│   │   └── mock/          # in-memory seed data
│   ├── di/            # composition root — wires data sources → repositories
│   └── utils/         # avatar, formatting helpers
├── modules/           # one folder per screen (dashboard, drivers, …)
├── shared/
│   ├── ui/            # Button, Input, Select, Modal, Badge, Pagination, …
│   ├── tables/        # reusable DataTable (search/sort/filter/paginate/states)
│   ├── charts/        # BaseChart wrapper
│   ├── layouts/       # AdminLayout, Sidebar, Topbar, PageHeader
│   └── modals/        # ConfirmModal, DocumentLightbox
├── stores/            # Pinia stores (ui, drivers, applications)
└── router/            # route table (19 screens, lazy-loaded)
```

### Swapping the backend

Dependency inversion lives in `src/core/di/container.ts`. To move a domain off
Supabase, implement its `*DataSource` contract (see
`core/data/datasources/contracts.ts`) and inject it there. Repositories, stores,
and components stay untouched.

```ts
// Example: drivers via REST instead of Supabase
new DriverRepository(new RestDriverDataSource())
```

## Screens (19)

Overview · Drivers (table, filters, details/docs modals, add-driver wizard) ·
Driver Applications (review drawer + document lightbox) · Onboarding Flow ·
Passengers · Trips · Live Map · Earnings & Commissions · Pricing · Governorates
& Cities · Coupons · Notifications · Complaints & Support · Ratings & Reviews ·
Reports · Content Management · Admin Users & Roles · Audit Logs · Settings.

## Design system

- **Tokens** — every colour/shadow is a CSS variable in
  `assets/styles/main.css`, toggled via the `data-theme` attribute. Tailwind maps
  semantic names (`bg`, `surface`, `border`, `primary`, …) to those variables.
- **i18n / RTL** — locale and document `dir` are driven by the `ui` store and
  applied to `<html>`; all spacing uses logical properties so the layout mirrors
  automatically.
- **States** — every list screen exercises loading skeletons, empty states, and
  error states via the `useAsyncData` + `DataTable` primitives.
