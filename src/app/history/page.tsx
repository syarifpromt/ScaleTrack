'use client';

import React, { useState, useEffect } from 'react';
import { History, BarChart3, Table as TableIcon, Calendar, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/history/SearchBar';
import AggregatedMetrics from '@/components/history/AggregatedMetrics';
import WeighingTable from '@/components/history/WeighingTable';
import WeightTrendChart from '@/components/analytics/WeightTrendChart';
import ProductDistribution from '@/components/analytics/ProductDistribution';
import PeakHours from '@/components/analytics/PeakHours';

export type TimePeriod = 'today' | 'week' | 'month' | 'year';

export default function HistoryAndAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'table'>('analytics');
  const [period, setPeriod] = useState<TimePeriod>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto pb-16">
        <div className="h-24 bg-white rounded-2xl border border-gray-200/80 shadow-xs animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="h-36 bg-white rounded-2xl border border-gray-200/80 shadow-xs animate-pulse" />
          <div className="h-36 bg-white rounded-2xl border border-gray-200/80 shadow-xs animate-pulse" />
          <div className="h-36 bg-white rounded-2xl border border-gray-200/80 shadow-xs animate-pulse" />
        </div>
        <div className="h-96 bg-white rounded-2xl border border-gray-200/80 shadow-xs animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* 1. Header & Period Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-sans">
              Statistik & Riwayat Penimbangan
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Grafik analisis tren volume penimbangan, omset penjualan, serta arsip riwayat transaksi lengkap
            </p>
          </div>
        </div>

        {/* 4 Time Period Filter Pills */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80 self-start lg:self-auto">
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

      {/* 2. 3 Clean Metric Cards */}
      <AggregatedMetrics period={period} />

      {/* 3. Internal Navigation Tab Switcher (Grafik di Kiri, Riwayat di Kanan) */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
            activeTab === 'analytics'
              ? "bg-blue-600 text-white shadow-xs shadow-blue-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-200"
          )}
        >
          <BarChart3 size={16} />
          <span>Grafik & Analisis Statistik</span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
            activeTab === 'table'
              ? "bg-blue-600 text-white shadow-xs shadow-blue-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-200"
          )}
        >
          <TableIcon size={16} />
          <span>Tabel Riwayat Transaksi</span>
        </button>
      </div>

      {/* 4. Tab Content Area */}
      {activeTab === 'analytics' ? (
        <div className="space-y-6">
          {/* Daily Weight Volume Chart */}
          <WeightTrendChart period={period} />

          {/* 2 Supporting Telemetry Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProductDistribution period={period} />
            <PeakHours period={period} />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Search & Filter Control Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />

          {/* Main Table & Integrated Pagination */}
          <WeighingTable
            period={period}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
          />
        </div>
      )}
    </div>
  );
}
