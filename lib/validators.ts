import { z } from 'zod';

export const baseVehicleSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(80),
    type: z.enum(['ICE', 'EV']),
    purchasePrice: z.number().positive(),
    downPayment: z.number().min(0).optional().default(0),
    resaleValue: z.number().min(0).nullable().optional(),
    notes: z.string().optional(),
});

export const iceVehicleSchema = baseVehicleSchema.extend({
    type: z.literal('ICE'),
    fuelType: z.string().optional(),
    fuelPricePerLiter: z.number().min(0),
    fuelEfficiencyKmPerLiter: z.number().positive(),
    monthlyKm: z.number().min(0).optional(),
    annualKm: z.number().min(0).optional(),
    annualMaintenanceTHB: z.number().min(0).optional(),
    loanTermYears: z.number().int().min(1).max(10).optional(),
    interestRateAnnualPct: z.number().min(0).max(30).optional(),
});

export const evVehicleSchema = baseVehicleSchema
    .extend({
        type: z.literal('EV'),
        rangeKmPerCharge: z.number().positive().optional(),
        energyConsumptionKwhPer100km: z.number().positive().optional(),
        batteryCapacityKwh: z.number().positive().optional(),
        electricityPricePerKwh: z.number().min(0),
        annualMaintenanceTHB: z.number().min(0).optional(),
        batteryWarrantyYears: z.number().min(0).optional(),
        loanTermYears: z.number().int().min(1).max(10).optional(),
        interestRateAnnualPct: z.number().min(0).max(30).optional(),
        resaleValue: z.number().min(0).nullable().optional(),
    })
    .refine(
        v => {
            // At least energyConsumption or (range and battery capacity)
            if (v.energyConsumptionKwhPer100km) return true;
            if (v.rangeKmPerCharge && v.batteryCapacityKwh) return true;
            return false;
        },
        { message: 'Provide energy consumption or (range + battery capacity)' }
    );

export const comparisonInputSchema = z.object({
    vehicles: z.array(z.union([iceVehicleSchema, evVehicleSchema])).min(2),
    horizonYears: z.number().int().min(1).max(30).default(5),
    annualKm: z.number().min(0),
    discountRatePct: z.number().min(0).max(100).optional(),
});
