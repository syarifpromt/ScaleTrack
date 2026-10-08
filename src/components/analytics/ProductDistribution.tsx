'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
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

import { useTransactions } from '@/lib/transactions-store';
import { computeProductDistribution } from '@/lib/transactions-analytics';

interface ProductDistributionProps {
  period?: TimePeriod;
}

export function ProductDistribution({ period = 'today' }: ProductDistributionProps) {
  const { transactions } = useTransactions();
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const current = computeProductDistribution(transactions, period);

  // Trigger clockwise circular sweep animation on mount and whenever period changes
  useEffect(() => {
    setIsInitialLoad(true);
    setSelectedName(null);
    setHoveredName(null);

    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 950);

    return () => clearTimeout(timer);
  }, [period]);

  const handleToggle = (name?: string) => {
    if (!name) return;
    setSelectedName(prev => (prev === name ? null : name));
  };

  // Only trigger hover on genuine desktop mouse pointers, never on touchscreens
  const handleMouseEnter = (name: string) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredName(name);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredName(null);
    }
  };

  // Active item prioritizes hovered item (desktop preview), otherwise locked selected item
  const activeName = hoveredName || selectedName;

  const selectedItem = activeName 
    ? current.items.find(item => item.name === activeName) || null
    : null;

  // Custom Sector shape renderer: Physically enlarged + Spring GPU zoom animation
  const renderSliceShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index, name, payload } = props;
    const itemName = name || payload?.name || current.items[index]?.name;
    const isSelected = activeName === itemName;

    // Calculate radial offset vector (pushes slice outward gently by 3px in its mid angle direction)
    const RADIAN = Math.PI / 180;
    const midAngle = (startAngle + endAngle) / 2;
    const offsetX = isSelected ? Math.cos(-midAngle * RADIAN) * 3 : 0;
    const offsetY = isSelected ? Math.sin(-midAngle * RADIAN) * 3 : 0;

    return (
      <g
        className={isSelected ? "donut-slice-active" : "donut-slice-idle"}
        onMouseEnter={() => handleMouseEnter(itemName)}
        onClick={(e) => {
          e.stopPropagation();
          setHoveredName(null);
          handleToggle(itemName);
        }}
        style={{
          outline: 'none',
          cursor: 'pointer',
          pointerEvents: 'all',
          ['--slice-cx' as any]: `${cx}px`,
          ['--slice-cy' as any]: `${cy}px`,
          ['--offset-x' as any]: `${offsetX.toFixed(2)}px`,
          ['--offset-y' as any]: `${offsetY.toFixed(2)}px`,
          transformOrigin: `${cx}px ${cy}px`,
          transformBox: 'view-box',
          filter: isSelected ? 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.18))' : 'none',
        }}
      >
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={isSelected ? innerRadius - 1 : innerRadius}
          outerRadius={isSelected ? outerRadius + 4 : outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#ffffff"
          strokeWidth={isSelected ? 2.5 : 2}
          style={{ outline: 'none', pointerEvents: 'all', cursor: 'pointer' }}
        />
      </g>
    );
  };

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
      <div 
        className="relative h-[220px] w-full flex-grow cursor-pointer select-none touch-manipulation flex items-center justify-center"
        onMouseLeave={handleMouseLeave}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ outline: 'none' }} onMouseLeave={handleMouseLeave}>
            <Pie
              key={`pie-${period}`}
              data={current.items}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              shape={renderSliceShape}
              onMouseEnter={(entry: any, idx: number) => {
                const targetName = entry?.name || current.items[idx]?.name;
                if (targetName) handleMouseEnter(targetName);
              }}
              isAnimationActive={isInitialLoad}
              animationBegin={0}
              animationDuration={850}
              animationEasing="ease"
              onAnimationEnd={() => setIsInitialLoad(false)}
              style={{ outline: 'none', cursor: 'pointer' }}
            >
              {current.items.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{ outline: 'none', cursor: 'pointer', pointerEvents: 'all' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Dynamic Visual Readout - Smooth Reveal after Sweep */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-2",
          isInitialLoad && "center-smooth-reveal"
        )}>
          {current.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                DATA KOSONG
              </span>
              <span className="text-xs font-semibold text-gray-400">
                0 Transaksi
              </span>
            </div>
          ) : selectedItem ? (
            <div className="flex flex-col items-center justify-center transition-all duration-300">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                KOMPOSISI
              </span>
              <span className="font-bold text-xs text-gray-800 leading-tight truncate max-w-[104px]" title={selectedItem.name}>
                {selectedItem.name}
              </span>
              <span className="text-2xl font-black text-blue-600 tracking-tight leading-none my-1 tabular-nums">
                {selectedItem.percentage}%
              </span>
              <span className="text-[11px] font-semibold text-gray-500 tabular-nums leading-none">
                {selectedItem.value.toLocaleString('id-ID')} kg
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center transition-all duration-300">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                DOMINAN
              </span>
              <span className="font-bold text-xs text-gray-800 leading-tight truncate max-w-[104px]" title={current.dominantName}>
                {current.dominantName}
              </span>
              <span className="text-2xl font-black text-blue-600 tracking-tight leading-none my-1 tabular-nums">
                {current.dominantPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-gray-500 tabular-nums leading-none">
                {current.dominantWeight.toLocaleString('id-ID')} kg
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Legend List */}
      <div className="mt-4 flex flex-col gap-1.5">
        {current.items.length === 0 ? (
          <div className="py-4 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Belum ada produk yang ditimbang pada periode ini
          </div>
        ) : (
          current.items.map((item, idx) => {
          const isSelected = selectedName === item.name;
          return (
            <button
              key={idx}
              onClick={() => handleToggle(item.name)}
              className={cn(
                "flex items-center justify-between text-xs sm:text-sm p-2.5 rounded-xl transition-all cursor-pointer text-left border",
                isSelected
                  ? "bg-blue-50/90 border-blue-300 shadow-2xs scale-[1.01]"
                  : "hover:bg-gray-50 border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3 h-3 rounded-full transition-transform" 
                  style={{ 
                    backgroundColor: item.color, 
                    transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 8px ${item.color}` : 'none',
                  }} 
                />
                <span className={cn("font-medium truncate max-w-[130px]", isSelected ? "font-bold text-blue-900" : "")} title={item.name}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-right">
                <span className="text-gray-500 text-xs tabular-nums">{item.value.toLocaleString('id-ID')} kg</span>
                <span className={cn("font-sans font-bold w-8 tabular-nums", isSelected ? "text-blue-700 font-black text-sm" : "text-gray-800")}>
                  {item.percentage}%
                </span>
              </div>
            </button>
          );
        })
      )}
      </div>
    </div>
  );
}

export default ProductDistribution;
