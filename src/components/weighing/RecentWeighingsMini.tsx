'use client';

import React from 'react';
import { cn, formatAdaptiveWeight } from '@/lib/utils';
import { Clock } from 'lucide-react';
import Link from 'next/link';

interface WeighingRecord {
  id: number;
  time: string;
  weight: number;
  isPass: boolean;
  productName: string;
}

const mockHistory: WeighingRecord[] = [
  { id: 141, time: '11:39 WIB', weight: 1.250, isPass: true, productName: 'Beras Premium' },
  { id: 140, time: '11:37 WIB', weight: 0.350, isPass: true, productName: 'Daging Sapi Segar' },
  { id: 139, time: '11:34 WIB', weight: 0.500, isPass: true, productName: 'Telur Ayam Ras' },
];

export function RecentWeighingsMini() {
  return (
    <div className="card p-5 flex flex-col gap-3 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2 text-gray-800">
          <Clock className="w-4 h-4 text-blue-600" />
          Riwayat 3 Penimbangan Terakhir
        </h3>
        <Link href="/history" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          Lihat Semua →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {mockHistory.map(record => (
          <div key={record.id} className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/80 flex flex-col justify-between gap-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">#{record.id}</span>
              <span>{record.time}</span>
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className="font-bold text-base text-gray-900 font-mono">
                {formatAdaptiveWeight(record.weight).full}
              </span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                record.isPass ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              )}>
                {record.isPass ? '✓ Pas' : '⚠ Periksa'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentWeighingsMini;
