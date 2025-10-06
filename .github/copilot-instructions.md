# Copilot Instructions

# Key features

-   Compare **1 ICE** vs **1–2 EVs** (user may add an extra EV for side-by-side comparison).
-   Pre-configured vehicles to save data entry (5 ICE + 5 EV presets; includes **Honda Freed**).
-   Mobile-first responsive design; dark theme default.
-   Two languages: **English** (default) and **Thai**. Language toggle in header.
-   Toggle between **Table** and **Graphs** (cumulative cost line chart, stacked bar, pie).
-   Inputs: purchase price, loan parameters, fuel/energy consumption, electricity price, maintenance, optional resale value (ICE).
-   Input validation and friendly error messages.
-   Prettier for code formatting. **No ESLint** by project requirement.
-   Client-side deterministic calculations contained in `/lib/calculations.ts`. Optional serverless `/api/compare` endpoint supported.

---

# Tech stack

-   Next.js 15 (App Router) + TypeScript
-   Tailwind CSS + DaisyUI (component speed-up)
-   Recharts (recommended) for charts (or react-chartjs-2 as alternative)
-   React Hook Form + Zod (recommended) for form handling & validation
-   Prettier for formatting
-   LocalStorage for user prefs & saved presets
-   No ESLint (explicitly omitted per spec)

---

# How to use the app (user flow)

1. Open app (default EN + dark theme).
2. Load a preset or start entering vehicle data:

    - Required: 1 ICE and 1 EV.
    - (Optional) click **Add another EV** to compare 2 EVs vs 1 ICE.

3. Enter or adjust assumptions:

    - Monthly km (or annual km), fuel price, electricity price, maintenance, loan terms (term years, annual interest), resale (optional for ICE).

4. Click **Compare**.
5. View results:

    - Table: Totals, cost-per-km, yearly breakdown.
    - Chart: Toggle between cumulative cost (line), stacked bars (component breakdown), pie (composition).

6. Toggle language (EN/TH) and theme (dark/light). Save preferences persistently.

---

# Calculations & assumptions (summary)

-   Default analysis horizon: **5 years** (configurable).
-   Key formulas:

    -   ICE annual fuel (liters) = `annualKm / kmPerLiter`
    -   ICE annual fuel cost = `annualLiters * pricePerLiter`
    -   EV annual kWh = `(annualKm / 100) * kWhPer100km`
    -   EV annual electricity cost = `annualKwh * pricePerKwh`
    -   Loan monthly payment uses standard amortization formula. Total loan payments over T years are included.
    -   Resale value (if provided) reduces total cost at end of horizon.

-   Battery replacement not included by default (advanced option).
-   Present value discounting (NPV) is optional and off by default.
-   All currency values shown with **2 decimals**. Internal calculations use full precision.

---

# i18n & theming

-   Translation JSON files: `/public/locales/en.json` and `/public/locales/th.json`.
-   Default language: English. Toggle in header.
-   Theme: dark by default; toggles to light. Preference saved to `localStorage`.

---

# Validation & formatting

-   Use `React Hook Form` with `Zod` or similar for validation.
-   Validation examples:

    -   `purchasePrice > 0`, `kmPerLiter > 0`, `kWh/100km > 0` (or range+capacity provided), interest `0–30%`.

-   Formatting: Prettier configured (`.prettierrc`). No ESLint file included.

Example `.prettierrc`:

```json
{
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 100,
    "tabWidth": 2,
    "arrowParens": "avoid"
}
```

---

# Unit tests & QA (recommendations)

-   Add unit tests for `/lib/calculations.ts` using Jest/ Vitest. Include testcases:

    -   ICE vs EV basic scenario (Honda Freed vs MG4).
    -   Loan amortization correctness.
    -   Edge cases (0 km, zero consumption).

-   Add e2e tests for main UI flows with Playwright or Cypress (mobile viewport).
