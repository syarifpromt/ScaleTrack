'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface ToleranceMeterProps {
  currentWeight: number;
  targetWeight: number;
  tolerance: number;
  maxWeight: number;
}

export function ToleranceMeter({ currentWeight, targetWeight, tolerance, maxWeight }: ToleranceMeterProps) {
  const percentage = Math.min(Math.max((currentWeight / maxWeight) * 100, 0), 100);
  const targetPercent = (targetWeight / maxWeight) * 100;
  
  const diff = currentWeight - targetWeight;
  const isPass = Math.abs(diff) <= tolerance;
  const isOver = diff > tolerance;
  const isUnder = diff < -tolerance;

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-gray-700">Toleransi Berat (Maks {maxWeight.toFixed(1)} kg)</span>
        </div>
        <span className="font-semibold text-gray-500">
          Target: <strong className="text-gray-900">{targetWeight.toFixed(3)} kg</strong>
        </span>
      </div>
      
      {/* Progress Track */}
      <div className="relative h-6 w-full bg-gray-100 rounded-full overflow-hidden">
        {/* Fill bar */}
        <div 
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            isPass ? "bg-emerald-500" : isOver ? "bg-amber-500" : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Target indicator marker line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10"
          style={{ left: `${targetPercent}%` }}
          title={`Target ${targetWeight} kg`}
        />
      </div>
      
      {/* Bottom labels */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>0 kg</span>
        <span className={cn(
          "font-bold text-xs px-2 py-0.5 rounded-md",
          isPass ? "text-emerald-700 bg-emerald-50" : isOver ? "text-amber-700 bg-amber-50" : "text-blue-700 bg-blue-50"
        )}>
          {isPass ? '✓ Pas di Target' : isOver ? 'Lebih dari Target' : 'Kurang dari Target'}
        </span>
        <span>{maxWeight.toFixed(1)} kg</span>
      </div>
    </div>
  );
}

export default ToleranceMeter;
