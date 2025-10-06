'use client';
import { useState } from 'react';
import type { Vehicle, ICEVehicle, EVVehicle } from '../lib/types';

interface VehicleFormProps {
    vehicles: Vehicle[];
    setVehicles: (v: Vehicle[]) => void;
    onCompare: () => void;
}

const emptyICE = (): ICEVehicle => ({
    id: 'ice-' + Math.random().toString(36).slice(2),
    name: 'ICE Vehicle',
    type: 'ICE',
    purchasePrice: 0,
    fuelPricePerLiter: 0,
    fuelEfficiencyKmPerLiter: 1,
});

const emptyEV = (): EVVehicle => ({
    id: 'ev-' + Math.random().toString(36).slice(2),
    name: 'EV Vehicle',
    type: 'EV',
    purchasePrice: 0,
    electricityPricePerKwh: 0,
});

export function VehicleForm({ vehicles, setVehicles, onCompare }: VehicleFormProps) {
    const [error, setError] = useState<string | null>(null);
    function update(id: string, patch: Partial<Vehicle>) {
        setVehicles(vehicles.map(v => (v.id === id ? ({ ...v, ...patch } as Vehicle) : v)));
    }
    function addEV() {
        if (vehicles.filter(v => v.type === 'EV').length >= 2) return;
        setVehicles([...vehicles, emptyEV()]);
    }
    function validate(): boolean {
        for (const v of vehicles) {
            if (!v.name || v.purchasePrice <= 0) {
                setError('Missing required fields');
                return false;
            }
        }
        setError(null);
        return true;
    }
    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        onCompare();
    }
    return (
        <form onSubmit={submit} className="space-y-4">
            {vehicles.map(v => (
                <div key={v.id} className="card bg-base-200 p-4 space-y-2">
                    <div className="flex gap-2">
                        <input
                            className="input input-bordered flex-1"
                            value={v.name}
                            onChange={e => update(v.id, { name: e.target.value })}
                            placeholder="Name"
                        />
                        <input
                            type="number"
                            className="input input-bordered w-40"
                            value={v.purchasePrice}
                            onChange={e => update(v.id, { purchasePrice: Number(e.target.value) })}
                            placeholder="Price"
                        />
                    </div>
                    {v.type === 'ICE' && (
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                className="input input-sm input-bordered"
                                value={(v as ICEVehicle).fuelPricePerLiter}
                                onChange={e =>
                                    update(v.id, { fuelPricePerLiter: Number(e.target.value) })
                                }
                                placeholder="Fuel THB/L"
                            />
                            <input
                                type="number"
                                className="input input-sm input-bordered"
                                value={(v as ICEVehicle).fuelEfficiencyKmPerLiter}
                                onChange={e =>
                                    update(v.id, {
                                        fuelEfficiencyKmPerLiter: Number(e.target.value),
                                    })
                                }
                                placeholder="Km/L"
                            />
                            <input
                                type="number"
                                className="input input-sm input-bordered"
                                value={(v as ICEVehicle).monthlyKm || ''}
                                onChange={e => update(v.id, { monthlyKm: Number(e.target.value) })}
                                placeholder="Monthly km"
                            />
                        </div>
                    )}
                    {v.type === 'EV' && (
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                className="input input-sm input-bordered"
                                value={(v as EVVehicle).energyConsumptionKwhPer100km || ''}
                                onChange={e =>
                                    update(v.id, {
                                        energyConsumptionKwhPer100km: Number(e.target.value),
                                    })
                                }
                                placeholder="kWh/100km"
                            />
                            <input
                                type="number"
                                className="input input-sm input-bordered"
                                value={(v as EVVehicle).electricityPricePerKwh}
                                onChange={e =>
                                    update(v.id, { electricityPricePerKwh: Number(e.target.value) })
                                }
                                placeholder="THB/kWh"
                            />
                            <input
                                type="number"
                                className="input input-sm input-bordered"
                                value={(v as EVVehicle).monthlyKm || ''}
                                onChange={e => update(v.id, { monthlyKm: Number(e.target.value) })}
                                placeholder="Monthly km"
                            />
                        </div>
                    )}
                </div>
            ))}
            {error && <div className="text-error text-sm">{error}</div>}
            <div className="flex gap-2">
                <button type="button" onClick={addEV} className="btn btn-outline btn-sm">
                    Add EV
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                    Compare
                </button>
            </div>
        </form>
    );
}
