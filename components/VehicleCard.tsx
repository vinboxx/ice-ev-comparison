'use client';
import type { Vehicle } from '../lib/types';
import { formatCurrencyTHB } from '../lib/currency';

export function VehicleCard({ v }: { v: Vehicle }) {
    return (
        <div className="border rounded p-3 text-sm space-y-1">
            <div className="font-medium flex items-center gap-2">
                <span className="badge badge-neutral">{v.type}</span>
                {v.name}
            </div>
            <div className="opacity-70">{formatCurrencyTHB(v.purchasePrice)}</div>
        </div>
    );
}
