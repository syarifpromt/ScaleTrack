'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';

interface PeakHoursProps {
  period?: TimePeriod;
}

const peakConfigByPeriod: Record<TimePeriod, {
  subtitle: string;
  slots: Array<{
    time: string;
    label: string;
    count: number;
    percentage: number;
    isPeak: boolean;
  }>;
  cycleTime: string;
}> = {
  today: {
    subtitle: 'Konsentrasi frekuensi siklus penimbangan per interval kerja harian',
    slots: [
      { time: '08:00 - 10:00', label: 'Pagi', count: 28, percentage: 66, isPeak: false },
      { time: '10:00 - 12:00', label: 'Siang', count: 42, percentage: 100, isPeak: true },
      { time: '13:00 - 15:00', label: 'Siang', count: 31, percentage: 73, isPeak: false },
      { time: '15:00 - 17:00', label: 'Sore', count: 35, percentage: 83, isPeak: false },
      { time: '17:00 - 20:00', label: 'Malam', count: 16, percentage: 38, isPeak: false },
    ],
    cycleTime: '3.8 detik / transaksi',
  },
  week: {
    subtitle: 'Rata-rata frekuensi penimbangan harian selama seminggu',
    slots: [
      { time: '08:00 - 10:00', label: 'Pagi', count: 215, percentage: 72, isPeak: false },
      { time: '10:00 - 12:00', label: 'Siang', count: 298, percentage: 100, isPeak: true },
      { time: '13:00 - 15:00', label: 'Siang', count: 220, percentage: 74, isPeak: false },
      { time: '15:00 - 17:00', label: 'Sore', count: 245, percentage: 82, isPeak: false },
      { time: '17:00 - 20:00', label: 'Malam', count: 112, percentage: 38, isPeak: false },
    ],
    cycleTime: '4.1 detik / transaksi',
  },
  month: {
    subtitle: 'Distribusi beban operasional kumulatif dalam 1 bulan',
    slots: [
      { time: '08:00 - 10:00', label: 'Pagi', count: 980, percentage: 74, isPeak: false },
      { time: '10:00 - 12:00', label: 'Siang', count: 1320, percentage: 100, isPeak: true },
      { time: '13:00 - 15:00', label: 'Siang', count: 960, percentage: 73, isPeak: false },
      { time: '15:00 - 17:00', label: 'Sore', count: 1100, percentage: 83, isPeak: false },
      { time: '17:00 - 20:00', label: 'Malam', count: 480, percentage: 36, isPeak: false },
    ],
    cycleTime: '4.2 detik / transaksi',
  },
  year: {
    subtitle: 'Distribusi beban penimbangan sepanjang tahun 2026',
    slots: [
      { time: '08:00 - 10:00', label: 'Pagi', count: 11800, percentage: 75, isPeak: false },
      { time: '10:00 - 12:00', label: 'Siang', count: 15650, percentage: 100, isPeak: true },
      { time: '13:00 - 15:00', label: 'Siang', count: 11400, percentage: 73, isPeak: false },
      { time: '15:00 - 17:00', label: 'Sore', count: 12900, percentage: 82, isPeak: false },
      { time: '17:00 - 20:00', label: 'Malam', count: 5400, percentage: 35, isPeak: false },
    ],
    cycleTime: '4.0 detik / transaksi',
  },
};

export function PeakHours({ period = 'today' }: PeakHoursProps) {
  const current = peakConfigByPeriod[period] || peakConfigByPeriod.today;

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
                <span className="font-sans font-bold text-gray-700 text-xs tabular-nums">{slot.count.toLocaleString('id-ID')} siklus</span>
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
        <p className="text-xs text-gray-500 font-medium">Rata-rata cycle time: <span className="font-bold text-gray-900">{current.cycleTime}</span></p>
      </div>
    </div>
  );
}

export default PeakHours;
