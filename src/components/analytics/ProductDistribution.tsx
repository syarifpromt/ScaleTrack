'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Globe } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';

interface DistributionItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const distributionByPeriod: Record<TimePeriod, {
  dominantName: string;
  dominantPercentage: number;
  items: DistributionItem[];
}> = {
  today: {
    dominantName: 'Beras',
    dominantPercentage: 45.0,
    items: [
      { name: 'Beras Premium', value: 83.1, percentage: 45, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 55.4, percentage: 30, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 27.7, percentage: 15, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 18.5, percentage: 10, color: '#94a3b8' },
    ],
  },
  week: {
    dominantName: 'Beras',
    dominantPercentage: 48.7,
    items: [
      { name: 'Beras Premium', value: 829.1, percentage: 49, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 510.9, percentage: 30, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 238.4, percentage: 14, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 124.6, percentage: 7, color: '#94a3b8' },
    ],
  },
  month: {
    dominantName: 'Beras',
    dominantPercentage: 48.6,
    items: [
      { name: 'Beras Premium', value: 3600.0, percentage: 49, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 2490.0, percentage: 33, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 890.5, percentage: 12, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 430.0, percentage: 6, color: '#94a3b8' },
    ],
  },
  year: {
    dominantName: 'Beras',
    dominantPercentage: 47.9,
    items: [
      { name: 'Beras Premium', value: 42600.0, percentage: 48, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 28500.0, percentage: 32, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 11400.0, percentage: 13, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 6440.0, percentage: 7, color: '#94a3b8' },
    ],
  },
};

interface ProductDistributionProps {
  period?: TimePeriod;
}

export function ProductDistribution({ period = 'today' }: ProductDistributionProps) {
  const current = distributionByPeriod[period] || distributionByPeriod.today;

  return (
    <div className="card bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <span className="font-sans font-bold text-[11px] text-gray-400 uppercase tracking-wider mb-1 block">KOMPOSISI PENJUALAN</span>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-sans font-bold text-base text-gray-900">Distribusi Produk</h3>
        </div>
      </div>

      <div className="relative h-[220px] w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={current.items}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {current.items.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toLocaleString('id-ID')} kg`, 'Berat']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase">DOMINAN</span>
          <span className="font-bold text-lg text-blue-600 leading-tight">{current.dominantName}</span>
          <span className="text-xs font-semibold text-gray-600">{current.dominantPercentage}%</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {current.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700 font-medium truncate max-w-[130px]" title={item.name}>{item.name}</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="text-gray-500 text-xs tabular-nums">{item.value.toLocaleString('id-ID')} kg</span>
              <span className="font-sans font-bold text-gray-800 w-8 tabular-nums">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDistribution;
