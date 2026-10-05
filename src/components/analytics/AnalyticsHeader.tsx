'use client';

import React, { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalyticsHeader() {
  const [activePeriod, setActivePeriod] = useState('Hari Ini');
  const periods = ['Hari Ini', 'Seminggu', 'Sebulan', 'Setahun'];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            TELEMETRY ANALYTICS // PRD SEC 14-24
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface-container-high rounded-full border border-outline-variant/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant font-medium">REALTIME ENGINE ACTIVE</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-[28px] font-bold font-heading">Statistik & Analitik Penimbangan</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-surface-container-high p-1 rounded-lg border border-outline-variant">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                activePeriod === period 
                  ? "bg-primary text-on-primary shadow-sm" 
                  : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
              )}
            >
              {period === 'Kustom' && <Calendar className="w-3.5 h-3.5" />}
              {period}
            </button>
          ))}
        </div>
        
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          EXPORT CSV/PDF
        </button>
      </div>
    </div>
  );
}

export default AnalyticsHeader;
