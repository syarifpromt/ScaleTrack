'use client';

import React from 'react';
import { Receipt, Package, DollarSign } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const metricsByPeriod: Record<TimePeriod, {
  totalTransactions: number;
  totalWeightKg: number;
  avgWeightPerTx: number;
  totalOmset: number;
  txSubtitle: string;
  weightSubtitle: string;
  omsetSubtitle: string;
}> = {
  today: {
    totalTransactions: 142,
    totalWeightKg: 184.65,
    avgWeightPerTx: 1.30,
    totalOmset: 28450000,
    txSubtitle: 'Semua penimbangan tercatat realtime',
    weightSubtitle: 'Rata-rata 1.30 kg / penimbangan',
    omsetSubtitle: '↗ +8.4% akumulasi hari ini',
  },
  week: {
    totalTransactions: 1048,
    totalWeightKg: 1703.00,
    avgWeightPerTx: 1.62,
    totalOmset: 195200000,
    txSubtitle: '7 hari operasional berjalan',
    weightSubtitle: 'Rata-rata 243.28 kg / hari',
    omsetSubtitle: '↗ +12.3% vs minggu lalu',
  },
  month: {
    totalTransactions: 4620,
    totalWeightKg: 7410.50,
    avgWeightPerTx: 1.60,
    totalOmset: 842600000,
    txSubtitle: 'Akumulasi 30 hari berjalan',
    weightSubtitle: 'Rata-rata 247.01 kg / hari',
    omsetSubtitle: '↗ +15.8% vs bulan lalu',
  },
  year: {
    totalTransactions: 54890,
    totalWeightKg: 88940.00,
    avgWeightPerTx: 1.62,
    totalOmset: 10150000000,
    txSubtitle: 'Akumulasi tahun berjalan 2026',
    weightSubtitle: 'Rata-rata 7.411 kg / bulan',
    omsetSubtitle: '↗ +24.1% vs tahun sebelumnya',
  },
};

interface AggregatedMetricsProps {
  period?: TimePeriod;
}

export const AggregatedMetrics = ({ period = 'today' }: AggregatedMetricsProps) => {
  const current = metricsByPeriod[period] || metricsByPeriod.today;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* Card 1: Total Transaksi Timbangan */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-200/90 flex flex-col justify-between hover:border-purple-300 transition-all">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Transaksi Timbangan
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans tabular-nums">
              {current.totalTransactions.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-semibold text-gray-400">transaksi</span>
          </div>
          <p className="text-xs text-purple-700 mt-1.5 font-medium">
            {current.txSubtitle}
          </p>
        </div>
      </div>

      {/* Card 2: Total Berat Ditimbang */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-200/90 flex flex-col justify-between hover:border-blue-300 transition-all">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Berat Ditimbang
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3.5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 font-sans tabular-nums">
              {current.totalWeightKg.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-base font-bold text-blue-600">kg</span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            {current.weightSubtitle}
          </p>
        </div>
      </div>

      {/* Card 3: Total Nilai Penjualan */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-200/90 flex flex-col justify-between hover:border-emerald-300 transition-all">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Nilai Penjualan
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3.5">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-600 font-sans tabular-nums truncate" title={formatRupiah(current.totalOmset)}>
            {formatRupiah(current.totalOmset)}
          </div>
          <p className="text-xs text-emerald-700 mt-1.5 font-medium">
            {current.omsetSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AggregatedMetrics;
