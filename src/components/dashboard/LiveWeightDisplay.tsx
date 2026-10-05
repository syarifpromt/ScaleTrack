'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Scale, ArrowRight, RotateCcw, ArrowUpCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useScaleEngine } from '@/hooks/useScaleEngine';
import { formatAdaptiveWeight } from '@/lib/utils';

export function LiveWeightDisplay() {
  const [baseLoad, setBaseLoad] = useState<number>(0.000);
  const [jitter, setJitter] = useState<number>(0);

  // Subtle sensor noise simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (baseLoad <= 0.005) {
        setJitter(0);
        return;
      }
      const noise = (Math.random() - 0.5) * 0.001;
      setJitter(noise);
    }, 150);

    return () => clearInterval(interval);
  }, [baseLoad]);

  const rawSensorWeight = baseLoad > 0.005 ? Math.max(0, baseLoad + jitter) : 0;

  const {
    netWeight,
    isStable,
    isOverload,
    handleTare,
    handleZero,
    maxCapacityKg
  } = useScaleEngine(rawSensorWeight, {
    maxCapacityKg: 5.000,
    minWeightTriggerKg: 0.020,
    stabilityToleranceKg: 0.001,
    stabilityDurationMs: 1200,
    soundEnabled: false
  });

  const adaptiveWeight = formatAdaptiveWeight(netWeight);
  const loadPercent = Math.min(100, Math.max(0, (netWeight / maxCapacityKg) * 100));

  return (
    <div className="card h-full flex flex-col justify-between bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Timbangan Digital</h2>
            <p className="text-[11px] text-gray-500">Kapasitas Maksimal {maxCapacityKg.toFixed(1)} kg</p>
          </div>
        </div>

        <Link 
          href="/weighing" 
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          <span>Buka Stasiun Timbang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Compact Clean Screen Display */}
      <div className="p-5 flex-1 flex flex-col justify-center items-center">
        <div className={clsx(
          "w-full rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 border shadow-2xs",
          isOverload
            ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/30"
            : isStable
            ? "bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/30"
            : "bg-slate-50/80 border-slate-200/90"
        )}>
          {/* Status Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={clsx(
              "w-2 h-2 rounded-full",
              isOverload ? "bg-rose-500" : isStable ? "bg-emerald-500" : netWeight > 0.02 ? "bg-amber-500 animate-ping" : "bg-gray-400"
            )} />
            <span className="text-xs font-semibold text-gray-600">
              {isOverload ? 'Kelebihan Beban (> 5 kg)' : isStable ? 'Stabil (Fiks)' : netWeight > 0.02 ? 'Sedang Menimbang...' : 'Timbangan Kosong'}
            </span>
          </div>

          {/* Big Digital Weight Number */}
          <div className="flex items-baseline gap-2 my-1">
            <span className={clsx(
              "font-mono font-black text-5xl sm:text-6xl tracking-tight tabular-nums transition-colors duration-200",
              isOverload
                ? "text-rose-600"
                : isStable
                ? "text-emerald-600"
                : "text-gray-900"
            )}>
              {isOverload ? 'OVERLOAD' : adaptiveWeight.value}
            </span>
            {!isOverload && (
              <span className={clsx(
                "text-2xl font-bold transition-colors",
                isStable ? "text-emerald-600" : "text-gray-400"
              )}>
                {adaptiveWeight.unit}
              </span>
            )}
          </div>

          {/* Indikator Bar Kapasitas Maksimal */}
          <div className="w-full mt-3 pt-3 border-t border-gray-200/70 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono text-gray-500">
              <span>0.00 kg</span>
              <span className={clsx(
                "font-bold uppercase tracking-wider text-[10px]",
                isOverload ? "text-rose-600 font-bold" : isStable ? "text-emerald-700" : "text-gray-700"
              )}>
                Kapasitas: {isOverload ? '100% (OVERLOAD)' : `${loadPercent.toFixed(0)}%`} (Maks {maxCapacityKg.toFixed(1)} kg)
              </span>
              <span>{maxCapacityKg.toFixed(1)} kg</span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300/60">
              <div 
                className={clsx(
                  "h-full transition-all duration-200 rounded-full",
                  isOverload 
                    ? "bg-rose-500 w-full" 
                    : isStable 
                    ? "bg-emerald-500" 
                    : loadPercent > 80 
                    ? "bg-amber-500" 
                    : "bg-blue-600"
                )}
                style={{ width: isOverload ? '100%' : `${loadPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compact Quick Actions / Mini Simulator */}
      <div className="p-3.5 px-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-medium">Uji Cepat:</span>
          <button
            onClick={() => setBaseLoad(prev => prev > 0 ? 0 : 0.500)}
            className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg font-bold shadow-2xs transition cursor-pointer"
          >
            {baseLoad > 0 ? 'Kosongkan (0 kg)' : '+500 gram'}
          </button>
          <button
            onClick={() => setBaseLoad(1.000)}
            className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg font-bold shadow-2xs transition cursor-pointer"
          >
            1 kg
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZero}
            className="py-1 px-3 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg font-bold shadow-2xs transition cursor-pointer flex items-center gap-1"
            title="Reset sensor ke nol (Zero)"
          >
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>Zero (0)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveWeightDisplay;
