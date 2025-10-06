# ICE vs EV Comparison — SPA Spec (for AI code generator)

**App title:** `ICE vs EV Comparison`
_(short, clear — implies decision between keeping (ICE) or charging (EV))_

**Language:** English (default), supports Thai (switchable)
**Framework:** Next.js 15 (TypeScript, App Router) — single page app behavior
**Styling:** Tailwind CSS + DaisyUI (optional components for speed)
**Formatting:** Prettier enabled
**Linting:** **No ESLint** (explicitly omitted)
**Design:** Mobile-first, responsive, dark theme default (light theme optional)
**Accessibility:** follow basic a11y (aria labels, keyboard focusable forms)
**Output formats:** Table (default) and Graph (switchable). Numbers shown with 2 decimal places.

---

## High-level user flows

1. **Onboard / First use**

    - User sees default language = English and dark theme active.
    - User presented with a short form to enter:

        - 1 ICE car (required)
        - 1 EV car (required)

    - The app also has a button to `Add another EV` (so user may compare 1 ICE vs 2 EVs).
    - User can load **pre-configured vehicles** from a dropdown (preconfig JSON) to quickly populate fields.

2. **Compare**

    - After form submit, the app calculates costs over a configurable time horizon (default 5 years), displays a comparison table and a graph (user can toggle).

3. **Edit / Save**

    - User can edit any vehicle data, change assumptions (electricity price, annual maintenance rates, loan params), and re-run comparison.

4. **Language & theme**

    - Header includes language toggle (EN/TH) and theme toggle (Dark/Light). Dark is default.

---

## Tech / Tooling details

-   Next.js 15 App Router with TypeScript.
-   Tailwind CSS v3+ integrated. Include DaisyUI plugin for ready-made components (optional).
-   Prettier config included (prettier config file).
-   No ESLint config files in repo.
-   Use a client-side only architecture (no server required). Optional API route `/api/compare` for heavy calculations if needed.
-   Charts: use a lightweight chart lib (e.g., `recharts` or `chart.js` via `react-chartjs-2`). (Either is fine; spec chooses `recharts` for simplicity.)

---

## Project structure (suggested)

```
/app
  /(locale)            # i18n route grouping
  /compare
    page.tsx           # main SPA page (uses client components)
  layout.tsx
/components
  VehicleForm.tsx
  VehicleCard.tsx
  ComparisonTable.tsx
  ComparisonChart.tsx
  Header.tsx
  LanguageToggle.tsx
  ThemeToggle.tsx
  PreconfigSelector.tsx
/lib
  calculations.ts
  validators.ts
  currency.ts
/public
  /locales/en.json
  /locales/th.json
/preconfig
  vehicles.json
/styles
  globals.css (tailwind imports)
```

---

## Data model (TypeScript interfaces)

```ts
// Vehicle types
type VehicleType = 'ICE' | 'EV';

interface BaseVehicle {
    id: string; // uuid
    name: string; // display name
    type: VehicleType;
    purchasePrice: number; // THB
    downPayment?: number; // THB, default 0
    resaleValue?: number | null; // optional resale value (for ICE user-provided)
    notes?: string;
}

// ICE-specific inputs
interface ICEVehicle extends BaseVehicle {
    type: 'ICE';
    fuelType: string; // e.g., 'E20'
    fuelPricePerLiter: number; // THB per liter
    fuelEfficiencyKmPerLiter: number; // km per liter
    monthlyKm?: number; // km per month (if provided)
    annualMaintenanceTHB?: number; // THB per year
}

// EV-specific inputs
interface EVVehicle extends BaseVehicle {
    type: 'EV';
    rangeKmPerCharge?: number; // km per full charge (optional)
    energyConsumptionKwhPer100km?: number; // kWh/100km (preferred)
    electricityPricePerKwh: number; // THB per kWh
    annualMaintenanceTHB?: number;
    batteryWarrantyYears?: number;
}
```

---

## Pre-configured vehicles (JSON)

Include 5 ICE and 5 EV presets to let users quickly choose. The app ships with `/preconfig/vehicles.json`. _All numbers are example defaults and editable by users._

```json
{
    "ice": [
        {
            "id": "ice-honda-freed",
            "name": "Honda Freed (example)",
            "type": "ICE",
            "purchasePrice": 600000,
            "fuelType": "E20",
            "fuelPricePerLiter": 30,
            "fuelEfficiencyKmPerLiter": 12,
            "monthlyKm": 1000,
            "annualMaintenanceTHB": 15000,
            "resaleValue": 120000
        },
        {
            "id": "ice-toyota-vios",
            "name": "Toyota Vios",
            "type": "ICE",
            "purchasePrice": 560000,
            "fuelType": "E20",
            "fuelPricePerLiter": 30,
            "fuelEfficiencyKmPerLiter": 15,
            "monthlyKm": 1000,
            "annualMaintenanceTHB": 12000,
            "resaleValue": 100000
        },
        {
            "id": "ice-honda-civic",
            "name": "Honda Civic",
            "type": "ICE",
            "purchasePrice": 900000,
            "fuelType": "E20",
            "fuelPricePerLiter": 30,
            "fuelEfficiencyKmPerLiter": 12,
            "monthlyKm": 1000,
            "annualMaintenanceTHB": 18000,
            "resaleValue": 200000
        },
        {
            "id": "ice-mazda2",
            "name": "Mazda 2",
            "type": "ICE",
            "purchasePrice": 650000,
            "fuelType": "E20",
            "fuelPricePerLiter": 30,
            "fuelEfficiencyKmPerLiter": 14,
            "monthlyKm": 1000,
            "annualMaintenanceTHB": 13000,
            "resaleValue": 110000
        },
        {
            "id": "ice-toyota-cross",
            "name": "Toyota Corolla Cross (ICE)",
            "type": "ICE",
            "purchasePrice": 1000000,
            "fuelType": "E20",
            "fuelPricePerLiter": 30,
            "fuelEfficiencyKmPerLiter": 13,
            "monthlyKm": 1000,
            "annualMaintenanceTHB": 17000,
            "resaleValue": 220000
        }
    ],
    "ev": [
        {
            "id": "ev-mg4-sr",
            "name": "MG 4 (Standard Range)",
            "type": "EV",
            "purchasePrice": 709900,
            "rangeKmPerCharge": 423,
            "energyConsumptionKwhPer100km": 13.5,
            "electricityPricePerKwh": 5.5,
            "annualMaintenanceTHB": 8000,
            "batteryWarrantyYears": 8
        },
        {
            "id": "ev-byd-dolphin",
            "name": "BYD Dolphin",
            "type": "EV",
            "purchasePrice": 620000,
            "rangeKmPerCharge": 405,
            "energyConsumptionKwhPer100km": 13.0,
            "electricityPricePerKwh": 5.5,
            "annualMaintenanceTHB": 7000,
            "batteryWarrantyYears": 8
        },
        {
            "id": "ev-aion-s",
            "name": "Aion S",
            "type": "EV",
            "purchasePrice": 680000,
            "rangeKmPerCharge": 420,
            "energyConsumptionKwhPer100km": 12.8,
            "electricityPricePerKwh": 5.5,
            "annualMaintenanceTHB": 7500,
            "batteryWarrantyYears": 8
        },
        {
            "id": "ev-mg-ep",
            "name": "MG ZS EV",
            "type": "EV",
            "purchasePrice": 999000,
            "rangeKmPerCharge": 320,
            "energyConsumptionKwhPer100km": 15.0,
            "electricityPricePerKwh": 5.5,
            "annualMaintenanceTHB": 9000,
            "batteryWarrantyYears": 7
        },
        {
            "id": "ev-neta-v",
            "name": "Neta V (example)",
            "type": "EV",
            "purchasePrice": 599000,
            "rangeKmPerCharge": 370,
            "energyConsumptionKwhPer100km": 14.0,
            "electricityPricePerKwh": 5.5,
            "annualMaintenanceTHB": 7000,
            "batteryWarrantyYears": 8
        }
    ]
}
```

> **Note:** `electricityPricePerKwh` default uses a national average placeholder (e.g., 5.5 THB/kWh). User can override per their plan (home rate, charging station rate).

---

## Required UI components & behavior

### Header

-   App title, language toggle (EN/TH), theme toggle (dark/light), link to `Pre-configs` modal.

### VehicleForm (primary)

-   One form row per vehicle (card style). For initial state:

    -   ICE Vehicle (required)
    -   EV Vehicle (required)

-   Option to `Add another EV` (max 1 extra to support 1 ICE vs 2 EV).
-   Inputs per vehicle (with placeholders and tooltips):

    -   Name (text, required)
    -   Purchase price (number, THB, required)
    -   Down payment (number, default 0)
    -   Resale value (number, optional — for ICE only, optional; can be used for cost offset)
    -   For ICE:

        -   Fuel type (text)
        -   Fuel price per liter (number, THB)
        -   Fuel efficiency (km per liter) (number)
        -   Monthly km (number) — optional; if blank, user can enter annual km

    -   For EV:

        -   Energy consumption (kWh/100km) (number) **preferred**
        -   OR Range per charge + battery capacity (optional advanced fields). If both are empty, show validation error.
        -   Electricity price per kWh (number)
        -   Battery warranty years (number)

    -   Annual maintenance (THB)
    -   Loan terms (toggle advanced per vehicle): term years, annual interest rate (percent), monthly insurance? (insurance can be a separate global input)

-   Buttons:

    -   `Load pre-config`
    -   `Reset`
    -   `Compare` (primary)

### VehicleCard

-   Displays a summary with quick edit, small icons for ICE/EV, shows purchase price and expected annual running cost (computed on the fly).

### ComparisonTable

-   Columns:

    -   Vehicle name, Total Cost (5-year default), Running cost breakdown (fuel/electricity, maintenance, loan payments, depreciation), Cost per km, Resale value (if applicable)

-   Two-decimal numbers, currency formatted (THB).
-   Option to switch time horizon (1, 2, 3, 5, 10 years).

### ComparisonChart

-   Chart switcher: `Cumulative cost over time` (line chart), `Cost breakdown` (stacked bar per year), `Cost composition` (pie for total cost over chosen horizon).
-   Default charts chosen:

    -   **Line chart**: cumulative total cost per vehicle over years (best for seeing breakeven).
    -   **Stacked bar**: for each vehicle, bars show stacked components (fuel/electricity, maintenance, loan, depreciation).
    -   **Pie** (optional): composition for a single selected vehicle.

### PreconfigSelector

-   Dropdown or modal listing pre-config vehicles with search. Selecting populates one of the form slots.

---

## Calculations (core logic)

All formulas are deterministic and run client-side (`/lib/calculations.ts`).

Definitions:

-   `T` = analysis horizon in years (default 5)
-   `annualKm` = if user provides monthlyKm, annualKm = monthlyKm \* 12
-   `k` = 2 decimal places on display

### ICE running cost

-   `annualFuelLiters = annualKm / fuelEfficiencyKmPerLiter`
-   `annualFuelCost = annualFuelLiters * fuelPricePerLiter`
-   `annualMaintenance = provided value or default`
-   `loanMonthlyPayment = loanCalc(purchasePrice, downPayment, annualRate, termYears)`
    (use standard amortization formula)
-   `totalCostOverT = (annualFuelCost + annualMaintenance) * T + totalLoanPaymentsOverT - resaleOffset`

    -   `resaleOffset` = (resaleValue || 0). If resaleValue provided, treat as reduction in final cost (optionally discounted to present value; default: no discount).

-   `costPerKm = totalCostOverT / (annualKm * T)`

### EV running cost

-   If `energyConsumptionKwhPer100km` provided:

    -   `annualKwh = (annualKm / 100) * energyConsumptionKwhPer100km`
    -   `annualElectricityCost = annualKwh * electricityPricePerKwh`

-   Else if range + batteryCapacity given:

    -   `energyConsumptionKwhPer100km = (batteryCapacity / rangeKmPerCharge) * 100` (computed)

-   `annualMaintenance` from input (default lower than ICE)
-   `totalCostOverT = (annualElectricityCost + annualMaintenance) * T + totalLoanPaymentsOverT - resaleOffset`
-   Consider battery replacement? Optional advanced scenario: if `batteryLifeYears < T`, add battery replacement cost (configurable advanced setting).
-   `costPerKm = totalCostOverT / (annualKm * T)`

### Loan amortization (monthly payment)

-   Use formula: `M = P * r * (1+r)^n / ((1+r)^n - 1)` where:

    -   `P = purchasePrice - downPayment`
    -   `r = monthly interest rate = annualRate / 12 / 100`
    -   `n = termYears * 12`

-   `totalLoanPaymentsOverT` = sum of payments for min(T, termYears)

### Depreciation

-   If `resaleValue` provided for ICE, include as offset.
-   For EV, optionally allow user to add expected resale after T years.

---

## Validation rules (client-side)

-   `name` required, max length 80.
-   `purchasePrice` required, > 0.
-   `fuelPricePerLiter`, `electricityPricePerKwh` >= 0.
-   `fuelEfficiencyKmPerLiter` > 0 (for ICE).
-   `energyConsumptionKwhPer100km` > 0 (for EV) OR (`rangeKmPerCharge` >0 AND `batteryCapacityKwh` >0).
-   Monthly km / Annual km: if provided, must be >= 0.
-   Loan term years: integer 1–10.
-   Interest rate: between 0 and 30 (percent).
-   Numeric inputs should be parsed as numbers and validated; show inline error messages in selected language.

---

## i18n keys (initial)

Place translation files under `/public/locales/en.json` and `/public/locales/th.json`.

Example keys:

```json
{
    "app.title": "Charge or Keep",
    "header.language": "Language",
    "header.theme": "Theme",
    "form.vehicleName": "Vehicle name",
    "form.purchasePrice": "Purchase price (THB)",
    "form.fuelPrice": "Fuel price (THB / L)",
    "form.fuelEfficiency": "Fuel efficiency (km / L)",
    "form.energyConsumption": "Energy consumption (kWh / 100 km)",
    "form.electricityPrice": "Electricity price (THB / kWh)",
    "action.compare": "Compare",
    "action.addEV": "Add another EV",
    "chart.cumulative": "Cumulative cost over time",
    "chart.breakdown": "Cost breakdown (stacked)",
    "table.totalCost": "Total cost",
    "table.costPerKm": "Cost per km",
    "validation.required": "This field is required"
}
```

Provide Thai translations in `th.json`.

---

## Themes

-   Default theme: **dark** (use Tailwind's `class="dark"` system).
-   Provide a toggle to switch to light theme. Save user preference to `localStorage`.
-   DaisyUI can be used to quickly build theme toggles and pre-styled components.

---

## Charts (recommended)

-   **Line chart**: `recharts` `LineChart` — x-axis years (0..T), y-axis cumulative cost — draw one line per vehicle.
-   **Stacked bar**: `BarChart` stacked by components (`fuel/electricity`, `maintenance`, `loan`, `depreciation`).
-   **Pie**: `PieChart` for single vehicle composition.
-   Chart behaviors:

    -   Tooltips show numeric breakdown with 2 decimals.
    -   Legend allows toggling vehicle series on/off.
    -   Mobile-friendly (single series per view or horizontal scrolling).

---

## Table display

-   Table with sortable columns (Total cost, Cost per km, Annual running).
-   Colors/tints to indicate best/worst (e.g., lowest cost green).
-   Rows collapse to show yearly breakdown on expand.

---

## Advanced / Optional features

-   Battery replacement modeling (if `batteryReplacementCost` and `batteryLifeYears` provided).
-   Charging behavior toggles: `home-only`, `public-only`, `mixed` with different kWh rates.
-   Discounting future cash flows (NPV) — advanced option (off by default).
-   Export results to CSV / PDF — optional.

---

## Prettier config (example)

Create `.prettierrc`:

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

## Default UI copy / UX notes

-   Keep forms short and show calculated previews in real-time.
-   Use progressive disclosure: show advanced loan options only when toggled.
-   Provide small help icons/tooltips for fields (e.g., how to get kWh/100km).
-   Default analysis horizon shown is **5 years** (matching your earlier analysis); allow user change.

---

## Display formatting & rounding

-   All currency values displayed with thousands separators and **2 decimal places** (e.g., `709,900.00 THB`).
-   All kWh/km or km/L numbers show 2 decimal places.
-   Internal calculations should use full precision and round only for display.

---

## Example UI wireframe (text)

-   **Header**: [App title] [Language toggle EN/TH] [Theme toggle]
-   **Top**: `Preconfig` dropdown + `Load defaults` button
-   **Main**:

    -   Left column (forms): ICE card, EV card, [+ Add EV]
    -   Right column (results): Tabs: `Table` | `Graph` ; Controls for horizon (1/2/3/5/10 years) and export

-   **Bottom**: small notes, disclaimers, version.

---

## Edge cases & error handling

-   If user enters unrealistic values (e.g., 0 fuel efficiency), show friendly error and examples.
-   If `annualKm` is 0, show results as N/A.
-   If 2 EVs are added, handle chart color assignment and legend appropriately.

---

## Example calculation test cases (for QA)

1. **Basic** — ICE: Honda Freed (purchase 600k, fuelEff 12 km/L, fuel 30 THB/L, monthlyKm 1000) vs EV: MG4 (709,900, energy 13.5 kWh/100km, elec 5.5 THB/kWh). Horizon 5 years. Expect EV to show lower running electricity cost but higher purchase/loan cost.
2. **Resale** — Add ICE resaleValue 120k. Confirm final totalCost reduces by that amount.
3. **Loan** — 5-year loan, 3.5% annual → verify monthly payment formula works.

---

## API (optional, for server-side calculation)

If you prefer serverless calculation endpoint:

-   `POST /api/compare`

    -   Body: `{ vehicles: Vehicle[], annualKm: number, horizonYears: number }`
    -   Response: `{ results: VehicleResult[] }` where `VehicleResult` contains yearly breakdown arrays used for charts/tables.

-   Keep calculations deterministic and idempotent.

---

## Notes to AI developer / implementer

-   Focus on a clean, mobile-first UI. Keep forms minimal and readable on small screens.
-   Implement inputs with appropriate HTML5 types (`number`, `text`), and use libraries like React Hook Form or Zod for validation.
-   Keep business logic in `/lib/calculations.ts` with pure functions and unit tests.
-   Persist user preferences (theme, language, last used vehicles) to `localStorage`.
-   Preconfig JSON must be modifiable (allow user to add custom presets to localStorage).

---

If you'd like, I can now:

-   generate a ready-to-run Next.js 15 TypeScript project scaffold (files + key components), or
-   produce the JSON `vehicles.json` file ready to drop into `/preconfig`, or
-   output the TypeScript interfaces & a sample `calculations.ts` implementation.

Which of those should I generate next? (If you prefer, I can produce the full scaffold now.)
