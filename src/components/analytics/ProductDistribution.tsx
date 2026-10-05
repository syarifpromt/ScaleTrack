'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { Globe, ZoomIn, X, Sparkles } from 'lucide-react';
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

// Render enlarged active shape when clicked
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.2))',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
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

        {activeIndex !== null && (
          <button
            onClick={() => setActiveIndex(null)}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset Zoom</span>
          </button>
        )}
      </div>

      {/* Pie Chart Canvas with Click-to-Zoom */}
      <div className="relative h-[220px] w-full flex-grow cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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

        {/* Center Dynamic Zoom Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all">
          {selectedItem ? (
            <div className="text-center animate-in zoom-in-75 duration-200">
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> ZOOM IN
              </span>
              <span className="font-bold text-base text-gray-900 leading-tight block max-w-[110px] truncate" title={selectedItem.name}>
                {selectedItem.name}
              </span>
              <span className="text-sm font-black text-blue-600">{selectedItem.percentage}%</span>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">DOMINAN</span>
              <span className="font-bold text-lg text-blue-600 leading-tight block">{current.dominantName}</span>
              <span className="text-xs font-semibold text-gray-600">{current.dominantPercentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Legend List (Clicking row also zooms into slice) */}
      <div className="mt-4 flex flex-col gap-2">
        {current.items.map((item, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(isSelected ? null : idx)}
              className={cn(
                "flex items-center justify-between text-xs sm:text-sm p-2 rounded-xl transition-all cursor-pointer text-left border",
                isSelected
                  ? "bg-blue-50/80 border-blue-300 shadow-2xs scale-[1.02]"
                  : "hover:bg-gray-50 border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full transition-transform" 
                  style={{ backgroundColor: item.color, transform: isSelected ? 'scale(1.3)' : 'scale(1)' }} 
                />
                <span className="font-semibold truncate max-w-[130px]" title={item.name}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-gray-500 text-xs tabular-nums">{item.value.toLocaleString('id-ID')} kg</span>
                <span className="font-sans font-bold text-gray-900 w-9 tabular-nums">{item.percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductDistribution;
