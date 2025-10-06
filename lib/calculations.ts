import {
    ComparisonInput,
    ComparisonOutput,
    Vehicle,
    ICEVehicle,
    EVVehicle,
    VehicleResultSummary,
    YearlyBreakdownComponent,
} from './types';
import { round2 } from './currency';

function annualKmForVehicle(v: Vehicle, globalAnnualKm: number): number {
    const monthly = (v as ICEVehicle).monthlyKm; // both types may optionally have monthlyKm
    const specifiedAnnual = (v as ICEVehicle).annualKm; // allow direct annual override
    if (specifiedAnnual != null) return specifiedAnnual;
    if (monthly != null) return monthly * 12;
    return globalAnnualKm;
}

function monthlyLoanPayment(principal: number, annualRatePct: number, termYears: number): number {
    if (principal <= 0) return 0;
    const n = termYears * 12;
    if (annualRatePct <= 0) return principal / n;
    const r = annualRatePct / 100 / 12;
    const numerator = principal * r * Math.pow(1 + r, n);
    const denom = Math.pow(1 + r, n) - 1;
    return numerator / denom;
}

interface LoanResult {
    monthlyPayment: number;
    totalPaidWithinHorizon: number;
    yearlyPayments: number[];
}
function loanPayments(v: Vehicle, horizonYears: number): LoanResult {
    const principal = v.purchasePrice - (v.downPayment || 0);
    const termYears = (v as any).loanTermYears || 0;
    const rate = (v as any).interestRateAnnualPct || 0;
    if (!termYears) {
        return {
            monthlyPayment: 0,
            totalPaidWithinHorizon: 0,
            yearlyPayments: Array.from({ length: horizonYears }, () => 0),
        };
    }
    const monthly = monthlyLoanPayment(principal, rate, termYears);
    const n = termYears * 12;
    const totalLoan = monthly * n;
    const yearlyPayments: number[] = [];
    for (let y = 1; y <= horizonYears; y++) {
        if (y <= termYears) {
            yearlyPayments.push(monthly * 12);
        } else yearlyPayments.push(0);
    }
    const totalWithinHorizon = yearlyPayments.reduce((a, b) => a + b, 0);
    return { monthlyPayment: monthly, totalPaidWithinHorizon: totalWithinHorizon, yearlyPayments };
}

function computeICE(
    v: ICEVehicle,
    annualKm: number,
    horizon: number
): {
    yearly: YearlyBreakdownComponent[];
    totalFuel: number;
    totalMaint: number;
    resaleOffset: number;
    totalLoan: number;
    totalCost: number;
    costPerKm: number | null;
} {
    const annualFuelLiters =
        annualKm && v.fuelEfficiencyKmPerLiter > 0 ? annualKm / v.fuelEfficiencyKmPerLiter : 0;
    const annualFuelCost = annualFuelLiters * v.fuelPricePerLiter;
    const maint = v.annualMaintenanceTHB || 0;
    const loan = loanPayments(v, horizon);
    const resaleOffset = v.resaleValue || 0;

    const yearly: YearlyBreakdownComponent[] = [];
    let cumulative = 0;
    for (let y = 1; y <= horizon; y++) {
        const fuelY = annualFuelCost;
        const maintY = maint;
        const loanY = loan.yearlyPayments[y - 1] || 0;
        // Depreciation simplistic: apply resale only at final year; track as (purchasePrice - resale)/horizon per year for visualization
        const depreciationBase = v.purchasePrice - resaleOffset;
        const depreciationY = depreciationBase / horizon;
        cumulative += fuelY + maintY + loanY + depreciationY;
        const comp: YearlyBreakdownComponent = {
            year: y,
            fuelOrElectricity: fuelY,
            maintenance: maintY,
            loan: loanY,
            depreciation: depreciationY,
            cumulativeTotal: cumulative,
        };
        yearly.push(comp);
    }
    const totalFuel = annualFuelCost * horizon;
    const totalMaint = maint * horizon;
    const totalLoan = loan.totalPaidWithinHorizon;
    const totalCostRaw = totalFuel + totalMaint + totalLoan + (v.purchasePrice - resaleOffset);
    const totalCost = totalCostRaw;
    const denomKm = annualKm * horizon;
    const costPerKm = denomKm > 0 ? totalCost / denomKm : null;
    return { yearly, totalFuel, totalMaint, resaleOffset, totalLoan, totalCost, costPerKm };
}

function computeEV(
    v: EVVehicle,
    annualKm: number,
    horizon: number
): {
    yearly: YearlyBreakdownComponent[];
    totalFuel: number;
    totalMaint: number;
    resaleOffset: number;
    totalLoan: number;
    totalCost: number;
    costPerKm: number | null;
} {
    let energyConsumption = v.energyConsumptionKwhPer100km;
    if (!energyConsumption && v.rangeKmPerCharge && v.batteryCapacityKwh) {
        energyConsumption = (v.batteryCapacityKwh / v.rangeKmPerCharge) * 100;
    }
    const annualKwh = annualKm && energyConsumption ? (annualKm / 100) * energyConsumption : 0;
    const annualElectricityCost = annualKwh * v.electricityPricePerKwh;
    const maint = v.annualMaintenanceTHB || 0;
    const loan = loanPayments(v, horizon);
    const resaleOffset = v.resaleValue || 0;
    const yearly: YearlyBreakdownComponent[] = [];
    let cumulative = 0;
    for (let y = 1; y <= horizon; y++) {
        const elecY = annualElectricityCost;
        const maintY = maint;
        const loanY = loan.yearlyPayments[y - 1] || 0;
        const depreciationBase = v.purchasePrice - resaleOffset;
        const depreciationY = depreciationBase / horizon;
        cumulative += elecY + maintY + loanY + depreciationY;
        yearly.push({
            year: y,
            fuelOrElectricity: elecY,
            maintenance: maintY,
            loan: loanY,
            depreciation: depreciationY,
            cumulativeTotal: cumulative,
        });
    }
    const totalFuel = annualElectricityCost * horizon;
    const totalMaint = maint * horizon;
    const totalLoan = loan.totalPaidWithinHorizon;
    const totalCostRaw = totalFuel + totalMaint + totalLoan + (v.purchasePrice - resaleOffset);
    const totalCost = totalCostRaw;
    const denomKm = annualKm * horizon;
    const costPerKm = denomKm > 0 ? totalCost / denomKm : null;
    return { yearly, totalFuel, totalMaint, resaleOffset, totalLoan, totalCost, costPerKm };
}

export function compare(input: ComparisonInput): ComparisonOutput {
    const { vehicles, horizonYears, annualKm } = input;
    const results: VehicleResultSummary[] = vehicles.map(v => {
        const effectiveAnnualKm = annualKmForVehicle(v, annualKm);
        if (v.type === 'ICE') {
            const r = computeICE(v as ICEVehicle, effectiveAnnualKm, horizonYears);
            return {
                vehicleId: v.id,
                name: v.name,
                type: v.type,
                totalCost: r.totalCost,
                costPerKm: r.costPerKm,
                totalFuelOrElectricity: r.totalFuel,
                totalMaintenance: r.totalMaint,
                totalLoanPayments: r.totalLoan,
                resaleOffset: r.resaleOffset,
                yearly: r.yearly.map(y => ({ ...y, cumulativeTotal: round2(y.cumulativeTotal) })),
            };
        } else {
            const r = computeEV(v as EVVehicle, effectiveAnnualKm, horizonYears);
            return {
                vehicleId: v.id,
                name: v.name,
                type: v.type,
                totalCost: r.totalCost,
                costPerKm: r.costPerKm,
                totalFuelOrElectricity: r.totalFuel,
                totalMaintenance: r.totalMaint,
                totalLoanPayments: r.totalLoan,
                resaleOffset: r.resaleOffset,
                yearly: r.yearly.map(y => ({ ...y, cumulativeTotal: round2(y.cumulativeTotal) })),
            };
        }
    });
    return { results };
}
