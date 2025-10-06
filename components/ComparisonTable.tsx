'use client';
import type { VehicleResultSummary } from '../lib/types';
import { formatCurrencyTHB } from '../lib/currency';

export function ComparisonTable({ results }: { results: VehicleResultSummary[] }) {
  if (!results.length) return <div className="text-sm opacity-70">No results yet.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra table-sm">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Total Cost</th>
            <th>Cost/km</th>
            <th>Fuel/Electric</th>
            <th>Maint.</th>
            <th>Loan</th>
            <th>Resale</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.vehicleId}>
              <td>{r.name}</td>
              <td>{formatCurrencyTHB(r.totalCost)}</td>
              <td>{r.costPerKm != null ? formatCurrencyTHB(r.costPerKm) : '—'}</td>
              <td>{formatCurrencyTHB(r.totalFuelOrElectricity)}</td>
              <td>{formatCurrencyTHB(r.totalMaintenance)}</td>
              <td>{formatCurrencyTHB(r.totalLoanPayments)}</td>
              <td>{r.resaleOffset ? '-' + formatCurrencyTHB(r.resaleOffset) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
