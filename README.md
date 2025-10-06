# ICE vs EV Comparison

**Compare the true cost of owning a petrol (ICE) car vs one or two electric vehicles (EVs).**
Mobile-first, responsive single-page app built with Next.js (TypeScript). Dark theme by default, bilingual (English/Thai), quick presets (includes Honda Freed), and realtime cost/graph comparisons.

---

# About

**ICE vs EV Comparison** helps car owners make data-driven decisions about switching from a petrol car to an EV. It compares up-front costs (purchase and loan), running costs (fuel or electricity), maintenance, and resale/depreciation across configurable horizons (1, 2, 3, 5, 10 years). Results are shown in an easy-to-read table and visualized with charts.

---

# Tech Stack

-   Next.js 15 App Router + TypeScript
-   Tailwind CSS + DaisyUI
-   Recharts for charts
-   React Hook Form + Zod (planned for richer validation; minimal placeholder form currently)
-   Vitest for unit tests (calculations)
-   i18n via simple JSON locale files under `public/locales`
-   No ESLint (per spec) — only Prettier formatting

---

# Project Structure (current snapshot)

```
/app
  layout.tsx
  /compare
    page.tsx
/components
  Header.tsx
  LanguageToggle.tsx
  ThemeToggle.tsx
  VehicleForm.tsx
  VehicleCard.tsx
  ComparisonTable.tsx
  ComparisonChart.tsx
  PreconfigSelector.tsx
/lib
  types.ts
  calculations.ts
  validators.ts
  currency.ts
  __tests__/calculations.test.ts
/preconfig
  vehicles.json
/public
  /locales/en.json
  /locales/th.json
/styles
  globals.css
```

---

# Quick start (dev)

1. Clone

```bash
git clone <repo-url>
cd ice-ev-comparison
```

2. Install dependencies

```bash
npm install
```

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000/compare

---

# Scripts

```bash
npm run dev         # Start Next.js in development
npm run build       # Production build
npm run start       # Start production server (after build)
npm run typecheck   # TypeScript noEmit check
npm run test        # Run Vitest tests once
npm run test:watch  # Watch tests
```

---

# Environment / Config

Currently no environment variables required. All calculations are client-side. Optional future API route: `/api/compare`.

---

# i18n

Locale files located in `public/locales/en.json` and `public/locales/th.json`. A lightweight language toggle stores preference in `localStorage` (`lang` key). Future improvement: context provider + key-based lookup across UI.

---

# Theming

Dark mode default. Theme toggle updates `<html>` class `dark` and sets `data-theme` for DaisyUI.

---

# Calculations

Core logic in `lib/calculations.ts`. Provides `compare({ vehicles, horizonYears, annualKm })` returning per-vehicle totals plus yearly cumulative costs.

Formulas implemented:

-   Fuel liters = annualKm / kmPerLiter
-   Fuel cost = liters \* fuelPricePerLiter
-   EV energy = (annualKm / 100) \* kWh/100km
-   Electricity cost = energy \* pricePerKwh
-   Loan payment = standard amortization M = P _ r _ (1+r)^n / ((1+r)^n - 1)
-   Total cost ≈ running + maintenance + loan + (purchase - resale)

Depreciation currently modeled simply as (purchase - resale)/horizon for visualization.

---

# Testing

Minimal test in `lib/__tests__/calculations.test.ts`. Add more covering:

-   Resale impact
-   Zero km edge case
-   EV fallback consumption via range + battery capacity

Run:

```bash
npm run test
```

---

# Roadmap / Next Steps

-   Integrate React Hook Form + Zod schema into `VehicleForm`
-   Add translation consumption for labels / table headers
-   Persist last-used vehicles in `localStorage`
-   Add stacked + pie chart i18n labels
-   Add advanced options: discount rate (NPV), battery replacement modeling
-   Export to CSV

---

# Contributing

-   Fork -> branch -> PR. Keep changes small and focused.
-   Use Prettier before committing.
-   Add tests for logic changes.
-   Keep README updated for new env vars or scripts.

---

# License

MIT (add `LICENSE` file before release).

---

# Disclaimer

Results are estimates based on user inputs; does not account for taxes, incentives, charging network fees variance, or environmental externalities.
