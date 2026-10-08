'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';
import { useTransactions } from '@/lib/transactions-store';
import { computePeakHours } from '@/lib/transactions-analytics';

interface PeakHoursProps {
  period?: TimePeriod;
}

export function PeakHours({ period = 'today' }: PeakHoursProps) {
  const { transactions } = useTransactions();
  const current = computePeakHours(transactions, period);

  return (
    <div className="card bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <span className="font-sans font-bold text-[11px] text-gray-400 uppercase tracking-wider mb-1 block">BEBAN OPERASIONAL</span>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-sans font-bold text-base text-gray-900">Aktivitas Jam Sibuk</h3>
        </div>
        <p className="text-xs text-gray-500">{current.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3.5 flex-grow justify-center">
        {current.slots.map((slot, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex justify-between items-end text-xs sm:text-sm">
              <span className="font-semibold text-gray-800">
                {slot.time} <span className="text-gray-400 text-xs font-normal">{slot.label && `(${slot.label})`}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-gray-700 text-xs tabular-nums">{slot.count.toLocaleString('id-ID')} transaksi</span>
                {slot.isPeak && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">PUNCAK</span>
                )}
              </div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${slot.isPeak ? 'bg-blue-600' : 'bg-blue-400'}`}
                style={{ width: `${slot.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 font-medium">Status Operasional: <span className="font-bold text-gray-900">{current.cycleTime}</span></p>
      </div>
    </div>
  );
}

export default PeakHours;
