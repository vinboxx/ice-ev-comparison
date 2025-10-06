import { describe, it, expect } from 'vitest';
import { compare } from '../calculations';
import type { Vehicle } from '../types';

describe('compare calculations', () => {
    it('basic ICE vs EV scenario', () => {
        const vehicles: Vehicle[] = [
            {
                id: 'ice1',
                name: 'Honda Freed',
                type: 'ICE',
                purchasePrice: 600000,
                fuelPricePerLiter: 30,
                fuelEfficiencyKmPerLiter: 12,
                monthlyKm: 1000,
            },
            {
                id: 'ev1',
                name: 'MG4',
                type: 'EV',
                purchasePrice: 709900,
                electricityPricePerKwh: 5.5,
                energyConsumptionKwhPer100km: 13.5,
                monthlyKm: 1000,
            },
        ];
        const out = compare({ vehicles, horizonYears: 5, annualKm: 12000 });
        expect(out.results.length).toBe(2);
        const ice = out.results[0];
        const ev = out.results[1];
        expect(ice.totalCost).toBeGreaterThan(0);
        expect(ev.totalCost).toBeGreaterThan(0);
    });
});
