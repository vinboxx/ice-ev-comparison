export type VehicleType = 'ICE' | 'EV';

export interface BaseVehicle {
    id: string;
    name: string;
    type: VehicleType;
    purchasePrice: number;
    downPayment?: number;
    resaleValue?: number | null;
    notes?: string;
}

export interface ICEVehicle extends BaseVehicle {
    type: 'ICE';
    fuelType?: string;
    fuelPricePerLiter: number;
    fuelEfficiencyKmPerLiter: number; // km per liter
    monthlyKm?: number; // km per month
    annualKm?: number; // optional direct annual entry
    annualMaintenanceTHB?: number;
    loanTermYears?: number;
    interestRateAnnualPct?: number; // 0-30
}

export interface EVVehicle extends BaseVehicle {
    type: 'EV';
    rangeKmPerCharge?: number;
    energyConsumptionKwhPer100km?: number; // preferred
    batteryCapacityKwh?: number; // if range used for calc
    electricityPricePerKwh: number;
    annualMaintenanceTHB?: number;
    batteryWarrantyYears?: number;
    monthlyKm?: number; // align with ICE for simplicity
    loanTermYears?: number;
    interestRateAnnualPct?: number;
    resaleValue?: number | null; // allow EV resale optionally
}

export type Vehicle = ICEVehicle | EVVehicle;

export interface YearlyBreakdownComponent {
    year: number; // 1-based
    fuelOrElectricity: number;
    maintenance: number;
    loan: number;
    depreciation: number; // book value decline (if resale used, aggregated at end)
    cumulativeTotal: number;
}

export interface VehicleResultSummary {
    vehicleId: string;
    name: string;
    type: VehicleType;
    totalCost: number;
    costPerKm: number | null; // null if annual km zero
    totalFuelOrElectricity: number;
    totalMaintenance: number;
    totalLoanPayments: number;
    resaleOffset: number; // positive number deducted
    yearly: YearlyBreakdownComponent[];
}

export interface ComparisonInput {
    vehicles: Vehicle[];
    horizonYears: number; // default 5
    annualKm: number; // user-level annual km (if vehicle monthly not set)
    discountRatePct?: number; // optional NPV
}

export interface ComparisonOutput {
    results: VehicleResultSummary[];
}
