'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { Globe } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';
import { cn } from '@/lib/utils';

interface DistributionItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const distributionByPeriod: Record<TimePeriod, {
  dominantName: string;
  dominantPercentage: number;
  dominantWeight: number;
  items: DistributionItem[];
}> = {
  today: {
    dominantName: 'Beras Premium',
    dominantPercentage: 45.0,
    dominantWeight: 83.1,
    items: [
      { name: 'Beras Premium', value: 83.1, percentage: 45, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 55.4, percentage: 30, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 27.7, percentage: 15, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 18.5, percentage: 10, color: '#94a3b8' },
    ],
  },
  week: {
    dominantName: 'Beras Premium',
    dominantPercentage: 48.7,
    dominantWeight: 829.1,
    items: [
      { name: 'Beras Premium', value: 829.1, percentage: 49, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 510.9, percentage: 30, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 238.4, percentage: 14, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 124.6, percentage: 7, color: '#94a3b8' },
    ],
  },
  month: {
    dominantName: 'Beras Premium',
    dominantPercentage: 48.6,
    dominantWeight: 3600.0,
    items: [
      { name: 'Beras Premium', value: 3600.0, percentage: 49, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 2490.0, percentage: 33, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 890.5, percentage: 12, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 430.0, percentage: 6, color: '#94a3b8' },
    ],
  },
  year: {
    dominantName: 'Beras Premium',
    dominantPercentage: 47.9,
    dominantWeight: 42600.0,
    items: [
      { name: 'Beras Premium', value: 42600.0, percentage: 48, color: '#2563eb' },
      { name: 'Daging Sapi Segar', value: 28500.0, percentage: 32, color: '#10B981' },
      { name: 'Telur Ayam Ras', value: 11400.0, percentage: 13, color: '#8b5cf6' },
      { name: 'Gula Pasir & Lainnya', value: 6440.0, percentage: 7, color: '#94a3b8' },
    ],
  },
};

// Custom Sector with smooth scale pop-out on click
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g style={{ outline: 'none' }}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15))',
          cursor: 'pointer',
          outline: 'none',
        }}
      />
    </g>
  );
};

interface ProductDistributionProps {
  period?: TimePeriod;
}

export function ProductDistribution({ period = 'today' }: ProductDistributionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const current = distributionByPeriod[period] || distributionByPeriod.today;

  const onPieClick = (_: any, index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const selectedItem = activeIndex !== null ? current.items[activeIndex] : null;

  return (
    <div className="card bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-sans font-bold text-[11px] text-gray-400 uppercase tracking-wider mb-1 block">
            KOMPOSISI PENJUALAN
          </span>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-sans font-bold text-base text-gray-900">Distribusi Produk</h3>
          </div>
        </div>
      </div>

      {/* Pie Chart Canvas with Clean Click-to-Zoom */}
      <div className="relative h-[220px] w-full flex-grow cursor-pointer select-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ outline: 'none' }}>
            <Pie
              data={current.items}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
              dataKey="value"
              {...({
                activeIndex: activeIndex !== null ? activeIndex : undefined,
                activeShape: renderActiveShape,
              } as any)}
              onClick={onPieClick}
              stroke="#ffffff"
              strokeWidth={2}
              style={{ outline: 'none' }}
            >
              {current.items.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="transition-all duration-300 hover:opacity-90"
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toLocaleString('id-ID')} kg`, 'Berat']}
              contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Dynamic Visual Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {selectedItem ? (
            <div className="flex flex-col items-center transition-all duration-300">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                KOMPOSISI
              </span>
              <span className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 max-w-[120px]">
                {selectedItem.name}
              </span>
              <span className="text-lg font-black text-blue-600 tabular-nums">
                {selectedItem.percentage}%
              </span>
              <span className="text-[11px] font-semibold text-gray-500 tabular-nums">
                {selectedItem.value.toLocaleString('id-ID')} kg
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center transition-all duration-300">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                DOMINAN
              </span>
              <span className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 max-w-[120px]">
                {current.dominantName}
              </span>
              <span className="text-lg font-black text-blue-600 tabular-nums">
                {current.dominantPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-gray-500 tabular-nums">
                {current.dominantWeight.toLocaleString('id-ID')} kg
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Legend List */}
      <div className="mt-4 flex flex-col gap-1.5">
        {current.items.map((item, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(isSelected ? null : idx)}
              className={cn(
                "flex items-center justify-between text-xs sm:text-sm p-2 rounded-xl transition-all cursor-pointer text-left border",
                isSelected
                  ? "bg-blue-50/90 border-blue-300 shadow-2xs scale-[1.01]"
                  : "hover:bg-gray-50 border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-transform" 
                  style={{ backgroundColor: item.color, transform: isSelected ? 'scale(1.3)' : 'scale(1)' }} 
                />
                <span className={cn("font-medium truncate max-w-[130px]", isSelected ? "font-bold text-blue-900" : "")} title={item.name}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-gray-500 text-xs tabular-nums">{item.value.toLocaleString('id-ID')} kg</span>
                <span className={cn("font-sans font-bold w-8 tabular-nums", isSelected ? "text-blue-700" : "text-gray-800")}>
                  {item.percentage}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductDistribution;
