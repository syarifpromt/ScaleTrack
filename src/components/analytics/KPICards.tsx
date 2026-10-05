import React from 'react';
import { Sigma, RefreshCcw, Target } from 'lucide-react';

export function KPICards() {
  const kpis = [
    {
      title: 'TOTAL BERAT TERTIMBANG',
      value: '1,842.50',
      unit: 'kg',
      trend: '+8.4% vs periode sebelumnya',
      icon: <Sigma className="w-6 h-6 text-primary" />,
    },
    {
      title: 'TOTAL SIKLUS PENIMBANGAN',
      value: '1,480',
      unit: 'kali',
      trend: '99.8% sukses tanpa interupsi',
      icon: <RefreshCcw className="w-6 h-6 text-primary" />,
    },
    {
      title: 'RATA-RATA BERAT / SIKLUS',
      value: '1.245',
      unit: 'kg',
      trend: 'σ = 0.012 kg standar deviasi stabil',
      icon: <Sigma className="w-6 h-6 text-primary" />,
    },
    {
      title: 'AKURASI TOLERANSI',
      value: '98.7',
      unit: '%',
      trend: 'Dalam ambang deviasi ±0.5%',
      icon: <Target className="w-6 h-6 text-primary" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="card p-5 bg-white relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{kpi.title}</h3>
            <div className="p-2 bg-surface-container rounded-lg group-hover:scale-110 transition-transform">
              {kpi.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="font-mono text-3xl font-semibold text-on-surface">{kpi.value}</span>
            <span className="text-on-surface-variant text-sm font-medium">{kpi.unit}</span>
          </div>
          <p className="text-xs text-outline">{kpi.trend}</p>
        </div>
      ))}
    </div>
  );
}

export default KPICards;
