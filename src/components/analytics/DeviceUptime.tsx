'use client';

import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';

interface DeviceUptimeProps {
  period?: TimePeriod;
}

const deviceStatsByPeriod: Record<TimePeriod, {
  rateText: string;
  rateLabel: string;
  uptime: string;
  statusText: string;
}> = {
  today: {
    rateText: '142 tx/hari',
    rateLabel: 'Kecepatan',
    uptime: '99.8% Uptime',
    statusText: 'Siap Menimbang',
  },
  week: {
    rateText: '150 tx/hari',
    rateLabel: 'Rata-rata Harian',
    uptime: '99.9% Uptime',
    statusText: 'Normal Operasional',
  },
  month: {
    rateText: '154 tx/hari',
    rateLabel: 'Rata-rata Harian',
    uptime: '99.7% Uptime',
    statusText: 'Optimal',
  },
  year: {
    rateText: '4.574 tx/bln',
    rateLabel: 'Rata-rata Bulanan',
    uptime: '99.8% Uptime',
    statusText: 'Performa Tinggi',
  },
};

export function DeviceUptime({ period = 'today' }: DeviceUptimeProps) {
  const current = deviceStatsByPeriod[period] || deviceStatsByPeriod.today;

  return (
    <div className="card bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="font-sans font-bold text-[11px] text-gray-400 uppercase tracking-wider mb-1 block">
              STATUS PERANGKAT
            </span>
            <h3 className="font-bold text-base text-gray-900 font-sans">
              Kesehatan & Uptime Timbangan
            </h3>
          </div>
          <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            1 UNIT ONLINE
          </div>
        </div>

        {/* Single Device Telemetry Card */}
        <div className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-xs text-gray-900">Timbangan Digital Kasir</h4>
            </div>
            <span className="font-sans font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {current.uptime}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{current.rateLabel}</p>
              <p className="font-sans text-xs font-bold text-gray-900">{current.rateText}</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Suhu MCU</p>
              <p className="font-sans text-xs font-bold text-emerald-600">35.2°C</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Error Rate</p>
              <p className="font-sans text-xs font-bold text-emerald-600">0.00%</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>Stabilitas Sensor HX711</span>
              <span className="text-emerald-700 font-semibold">Sangat Akurat</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[95%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
        <span>Hardware: ESP32 + Loadcell</span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {current.statusText}
        </span>
      </div>
    </div>
  );
}

export default DeviceUptime;
