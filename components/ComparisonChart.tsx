'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import type { VehicleResultSummary } from '../lib/types';
import { formatCurrencyTHB } from '../lib/currency';

const COLORS = ['#60a5fa', '#34d399', '#fbbf24'];

export function ComparisonChart({ results, mode }: { results: VehicleResultSummary[]; mode: 'line' | 'stacked' | 'pie'; }) {
  if (!results.length) return null;
  const horizon = results[0].yearly.length;
  if (mode === 'line') {
    const data = Array.from({ length: horizon }, (_, i) => {
      const year = i + 1;
      const entry: any = { year };
      results.forEach(r => { entry[r.name] = r.yearly[i].cumulativeTotal; });
      return entry;
    });
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={v => formatCurrencyTHB(Number(v))} />
            <Legend />
            {results.map((r, idx) => (
              <Line key={r.vehicleId} type="monotone" dataKey={r.name} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (mode === 'stacked') {
    const data = results.map(r => ({
      name: r.name,
      fuel: r.totalFuelOrElectricity,
      maintenance: r.totalMaintenance,
      loan: r.totalLoanPayments,
      depreciation: r.totalCost - (r.totalFuelOrElectricity + r.totalMaintenance + r.totalLoanPayments - r.resaleOffset)
    }));
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={v => formatCurrencyTHB(Number(v))} />
            <Legend />
            <Bar dataKey="fuel" stackId="a" fill="#60a5fa" />
            <Bar dataKey="maintenance" stackId="a" fill="#34d399" />
            <Bar dataKey="loan" stackId="a" fill="#fbbf24" />
            <Bar dataKey="depreciation" stackId="a" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (mode === 'pie') {
    const focus = results[0];
    const pieData = [
      { name: 'Fuel/Electric', value: focus.totalFuelOrElectricity },
      { name: 'Maintenance', value: focus.totalMaintenance },
      { name: 'Loan', value: focus.totalLoanPayments },
      { name: 'Depreciation', value: focus.totalCost - (focus.totalFuelOrElectricity + focus.totalMaintenance + focus.totalLoanPayments - focus.resaleOffset) }
    ];
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip formatter={v => formatCurrencyTHB(Number(v))} />
            <Legend />
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
              {pieData.map((e, i) => (
                <Cell key={e.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return null;
}
