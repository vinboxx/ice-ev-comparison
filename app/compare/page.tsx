'use client';
import { useState } from 'react';
import { Header } from '../../components/Header';
import { VehicleForm } from '../../components/VehicleForm';
import { ComparisonTable } from '../../components/ComparisonTable';
import { ComparisonChart } from '../../components/ComparisonChart';
import type { Vehicle } from '../../lib/types';
import { compare } from '../../lib/calculations';

export default function ComparePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([{
    id: 'ice-default', name: 'ICE Vehicle', type: 'ICE', purchasePrice: 600000, fuelPricePerLiter: 30, fuelEfficiencyKmPerLiter: 12, monthlyKm: 1000
  } as any, {
    id: 'ev-default', name: 'EV Vehicle', type: 'EV', purchasePrice: 700000, electricityPricePerKwh: 5.5, energyConsumptionKwhPer100km: 14, monthlyKm: 1000
  } as any]);
  const [results, setResults] = useState<any[]>([]);
  const [mode, setMode] = useState<'line' | 'stacked' | 'pie'>('line');
  const [horizon, setHorizon] = useState(5);

  function runCompare() {
    const output = compare({ vehicles, horizonYears: horizon, annualKm: 12000 });
    setResults(output.results);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grid md:grid-cols-2 gap-6 p-4 flex-1">
        <div className="space-y-4">
          <VehicleForm vehicles={vehicles} setVehicles={setVehicles} onCompare={runCompare} />
          <div className="flex gap-2 items-center">
            <label className="text-sm opacity-70">Horizon</label>
            <select className="select select-bordered select-xs" value={horizon} onChange={e => setHorizon(Number(e.target.value))}>
              {[1,2,3,5,10].map(y => <option key={y} value={y}>{y}y</option>)}
            </select>
            <div className="join join-horizontal ml-auto">
              <button onClick={() => setMode('line')} className={`btn btn-xs ${mode==='line'?'btn-active':''}`}>Line</button>
              <button onClick={() => setMode('stacked')} className={`btn btn-xs ${mode==='stacked'?'btn-active':''}`}>Stacked</button>
              <button onClick={() => setMode('pie')} className={`btn btn-xs ${mode==='pie'?'btn-active':''}`}>Pie</button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <ComparisonTable results={results as any} />
          <ComparisonChart results={results as any} mode={mode} />
        </div>
      </main>
    </div>
  );
}
