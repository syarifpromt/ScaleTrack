'use client';

import React, { useState } from 'react';
import { Package, DollarSign, Award, ShoppingBag, ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimePeriod = 'today' | 'week' | 'month' | 'year';

interface ProductSales {
  name: string;
  category: string;
  transactionsCount: number;
  totalWeightKg: number;
  pricePerKg: number;
  revenue: number;
}

interface PeriodSalesData {
  periodLabel: string;
  totalTransactions: number;
  totalWeightKg: number;
  totalRevenue: number;
  topProduct: {
    name: string;
    weightKg: number;
    revenue: number;
  };
  trendRevenue: string;
  products: ProductSales[];
}

const salesDataByPeriod: Record<TimePeriod, PeriodSalesData> = {
  today: {
    periodLabel: 'Hari Ini (5 Okt 2026)',
    totalTransactions: 142,
    totalWeightKg: 189.5,
    totalRevenue: 28450000,
    topProduct: {
      name: 'Beras Premium',
      weightKg: 85.0,
      revenue: 1402500,
    },
    trendRevenue: '+8.4% vs kemarin',
    products: [
      {
        name: 'Beras Premium',
        category: 'Sembako',
        transactionsCount: 54,
        totalWeightKg: 85.0,
        pricePerKg: 16500,
        revenue: 1402500,
      },
      {
        name: 'Daging Sapi Segar',
        category: 'Daging',
        transactionsCount: 32,
        totalWeightKg: 45.0,
        pricePerKg: 135000,
        revenue: 6075000,
      },
      {
        name: 'Telur Ayam Ras',
        category: 'Pangan',
        transactionsCount: 28,
        totalWeightKg: 35.5,
        pricePerKg: 29000,
        revenue: 1029500,
      },
      {
        name: 'Gula Pasir Kristal',
        category: 'Sembako',
        transactionsCount: 28,
        totalWeightKg: 24.0,
        pricePerKg: 17500,
        revenue: 420000,
      },
    ],
  },
  week: {
    periodLabel: 'Minggu Ini (29 Sep - 5 Okt)',
    totalTransactions: 890,
    totalWeightKg: 1450.0,
    totalRevenue: 198500000,
    topProduct: {
      name: 'Beras Premium',
      weightKg: 620.0,
      revenue: 10230000,
    },
    trendRevenue: '+14.1% vs minggu lalu',
    products: [
      {
        name: 'Beras Premium',
        category: 'Sembako',
        transactionsCount: 336,
        totalWeightKg: 620.0,
        pricePerKg: 16500,
        revenue: 10230000,
      },
      {
        name: 'Daging Sapi Segar',
        category: 'Daging',
        transactionsCount: 215,
        totalWeightKg: 310.0,
        pricePerKg: 135000,
        revenue: 41850000,
      },
      {
        name: 'Telur Ayam Ras',
        category: 'Pangan',
        transactionsCount: 180,
        totalWeightKg: 280.0,
        pricePerKg: 29000,
        revenue: 8120000,
      },
      {
        name: 'Gula Pasir Kristal',
        category: 'Sembako',
        transactionsCount: 159,
        totalWeightKg: 240.0,
        pricePerKg: 17500,
        revenue: 4200000,
      },
    ],
  },
  month: {
    periodLabel: 'Bulan Ini (Oktober 2026)',
    totalTransactions: 3650,
    totalWeightKg: 5820.0,
    totalRevenue: 792400000,
    topProduct: {
      name: 'Beras Premium',
      weightKg: 2450.0,
      revenue: 40425000,
    },
    trendRevenue: '+19.2% vs bulan lalu',
    products: [
      {
        name: 'Beras Premium',
        category: 'Sembako',
        transactionsCount: 1376,
        totalWeightKg: 2450.0,
        pricePerKg: 16500,
        revenue: 40425000,
      },
      {
        name: 'Daging Sapi Segar',
        category: 'Daging',
        transactionsCount: 880,
        totalWeightKg: 1250.0,
        pricePerKg: 135000,
        revenue: 168750000,
      },
      {
        name: 'Telur Ayam Ras',
        category: 'Pangan',
        transactionsCount: 744,
        totalWeightKg: 1120.0,
        pricePerKg: 29000,
        revenue: 32480000,
      },
      {
        name: 'Gula Pasir Kristal',
        category: 'Sembako',
        transactionsCount: 650,
        totalWeightKg: 1000.0,
        pricePerKg: 17500,
        revenue: 17500000,
      },
    ],
  },
  year: {
    periodLabel: 'Tahun Ini (2026)',
    totalTransactions: 42800,
    totalWeightKg: 69240.0,
    totalRevenue: 9420500000,
    topProduct: {
      name: 'Beras Premium',
      weightKg: 29500.0,
      revenue: 486750000,
    },
    trendRevenue: '+24.6% vs tahun 2025',
    products: [
      {
        name: 'Beras Premium',
        category: 'Sembako',
        transactionsCount: 16512,
        totalWeightKg: 29500.0,
        pricePerKg: 16500,
        revenue: 486750000,
      },
      {
        name: 'Daging Sapi Segar',
        category: 'Daging',
        transactionsCount: 10560,
        totalWeightKg: 15200.0,
        pricePerKg: 135000,
        revenue: 2052000000,
      },
      {
        name: 'Telur Ayam Ras',
        category: 'Pangan',
        transactionsCount: 8928,
        totalWeightKg: 13540.0,
        pricePerKg: 29000,
        revenue: 392660000,
      },
      {
        name: 'Gula Pasir Kristal',
        category: 'Sembako',
        transactionsCount: 6800,
        totalWeightKg: 11000.0,
        pricePerKg: 17500,
        revenue: 192500000,
      },
    ],
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SalesProfitSection() {
  const [period, setPeriod] = useState<TimePeriod>('today');
  const [showDetailTable, setShowDetailTable] = useState<boolean>(true);

  const data = salesDataByPeriod[period];
  const avgWeightPerTx = (data.totalWeightKg / (data.totalTransactions || 1)).toFixed(2);

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Rekap Penjualan Barang</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Pantau volume barang yang ditimbang dan total omset penjualan secara real-time
          </p>
        </div>

        {/* Time Period Filter Pills: 1 Hari, Seminggu, Sebulan, Setahun */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80">
          <button
            onClick={() => setPeriod('today')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              period === 'today'
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              period === 'week'
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Seminggu
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              period === 'month'
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Sebulan
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              period === 'year'
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Setahun
          </button>
        </div>
      </div>

      {/* 4 Clean Unified Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Berat Terjual */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/90 flex flex-col justify-between hover:border-blue-200 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Berat Terjual
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                {data.totalWeightKg.toLocaleString('id-ID')}
              </span>
              <span className="text-base font-bold text-blue-600">kg</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Rata-rata {avgWeightPerTx} kg / transaksi
            </p>
          </div>
        </div>

        {/* Card 2: Total Omset Penjualan */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/90 flex flex-col justify-between hover:border-emerald-200 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Omset Penjualan
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold tracking-tight text-emerald-600">
              {formatRupiah(data.totalRevenue)}
            </div>
            <p className="text-xs text-emerald-700 mt-1 font-medium flex items-center gap-1">
              <span>↗ {data.trendRevenue}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Total Transaksi */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/90 flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Transaksi
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                {data.totalTransactions}
              </span>
              <span className="text-xs font-semibold text-gray-400">transaksi</span>
            </div>
            <p className="text-xs text-purple-700 mt-1 font-medium">
              Semua transaksi sukses
            </p>
          </div>
        </div>

        {/* Card 4: Produk Terlaris */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/90 flex flex-col justify-between hover:border-amber-200 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Produk Terlaris
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-xl font-extrabold tracking-tight text-gray-900 truncate">
              {data.topProduct.name}
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Terjual: <strong>{data.topProduct.weightKg} kg</strong> ({formatRupiah(data.topProduct.revenue)})
            </p>
          </div>
        </div>
      </div>

      {/* Rincian Produk yang Terjual */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Rincian Penjualan per Barang ({data.periodLabel})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Daftar barang yang ditimbang dan berhasil terjual
            </p>
          </div>
          <button
            onClick={() => setShowDetailTable(!showDetailTable)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <span>{showDetailTable ? 'Sembunyikan' : 'Tampilkan'} Rincian</span>
            {showDetailTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showDetailTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 uppercase font-semibold">
                  <th className="px-5 py-3">Nama Barang</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3 text-right">Frekuensi Transaksi</th>
                  <th className="px-5 py-3 text-right">Total Berat (kg)</th>
                  <th className="px-5 py-3 text-right">Harga Jual / kg</th>
                  <th className="px-5 py-3 text-right">Total Omset Penjualan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.products.map((prod, index) => (
                  <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                        {index + 1}
                      </span>
                      {prod.name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-gray-700">
                      {prod.transactionsCount} kali
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-blue-700">
                      {prod.totalWeightKg.toFixed(1)} kg
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-gray-700">
                      {formatRupiah(prod.pricePerKg)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-emerald-600">
                      {formatRupiah(prod.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold">
                  <td className="px-5 py-3.5" colSpan={2}>
                    TOTAL ({data.products.length} Jenis Barang)
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono">
                    {data.totalTransactions} kali
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-blue-300">
                    {data.totalWeightKg.toFixed(1)} kg
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-400">-</td>
                  <td className="px-5 py-3.5 text-right font-mono text-emerald-400 text-sm font-black">
                    {formatRupiah(data.totalRevenue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesProfitSection;
