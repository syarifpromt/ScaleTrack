'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  Brush,
} from 'recharts';
import { BarChart3, TrendingUp, ZoomIn, X, Sparkles, DollarSign, Package, ArrowUpRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimePeriod } from '@/app/history/page';

interface PeriodChartItem {
  label: string;
  beras: number;
  daging: number;
  sembako: number;
  total: number;
}

interface PeriodChartConfig {
  dataKeyName: string;
  data: PeriodChartItem[];
  yDomain: [number, number];
  unit: string;
  barSubtitle: string;
  lineSubtitle: string;
  dominantInfo: string;
  peakInfo: string;
  avgInfo: string;
}

const chartConfigByPeriod: Record<TimePeriod, PeriodChartConfig> = {
  today: {
    dataKeyName: 'label',
    data: [
      { label: '08:00', beras: 18, daging: 12, sembako: 8, total: 38 },
      { label: '10:00', beras: 28, daging: 22, sembako: 10, total: 60 },
      { label: '12:00', beras: 20, daging: 15, sembako: 8, total: 43 },
      { label: '14:00', beras: 24, daging: 18, sembako: 9, total: 51 },
      { label: '16:00', beras: 32, daging: 25, sembako: 11, total: 68 },
      { label: '18:00', beras: 22, daging: 16, sembako: 7, total: 45 },
      { label: '20:00', beras: 10, daging: 8, sembako: 4, total: 22 },
    ],
    yDomain: [0, 80],
    unit: ' kg',
    barSubtitle: 'Distribusi bobot per kategori barang pada jam operasional hari ini (Klik bar untuk zoom)',
    lineSubtitle: 'Fluktuasi volume penimbangan per interval waktu 2 jam hari ini (Klik titik untuk zoom)',
    dominantInfo: 'Kategori Dominan: Beras (42.5%)',
    peakInfo: 'Jam Sibuk Puncak: 16:00 (68 kg)',
    avgInfo: 'Rata-rata: 46.7 kg / interval',
  },
  week: {
    dataKeyName: 'label',
    data: [
      { label: 'Senin', beras: 120, daging: 85, sembako: 45, total: 250 },
      { label: 'Selasa', beras: 135, daging: 90, sembako: 50, total: 275 },
      { label: 'Rabu', beras: 145, daging: 100, sembako: 55, total: 300 },
      { label: 'Kamis', beras: 165, daging: 128, sembako: 55, total: 348 },
      { label: 'Jumat', beras: 140, daging: 95, sembako: 40, total: 275 },
      { label: 'Sabtu', beras: 80, daging: 60, sembako: 25, total: 165 },
      { label: 'Minggu', beras: 45, daging: 30, sembako: 15, total: 90 },
    ],
    yDomain: [0, 400],
    unit: ' kg',
    barSubtitle: 'Komposisi volume bobot per kategori barang selama 7 hari terakhir (Klik bar untuk zoom)',
    lineSubtitle: 'Kurva tren fluktuasi total bobot timbangan harian minggu ini (Klik titik untuk zoom)',
    dominantInfo: 'Kategori Dominan: Beras (48.7%)',
    peakInfo: 'Hari Tertinggi: Kamis (348 kg)',
    avgInfo: 'Rata-rata: 243.3 kg / hari',
  },
  month: {
    dataKeyName: 'label',
    data: [
      { label: 'Minggu 1', beras: 780, daging: 520, sembako: 280, total: 1580 },
      { label: 'Minggu 2', beras: 890, daging: 610, sembako: 330, total: 1830 },
      { label: 'Minggu 3', beras: 940, daging: 670, sembako: 370, total: 1980 },
      { label: 'Minggu 4', beras: 990, daging: 690, sembako: 340, total: 2020 },
    ],
    yDomain: [0, 2500],
    unit: ' kg',
    barSubtitle: 'Akumulasi bobot per kategori barang selama 4 minggu bulan berjalan (Klik bar untuk zoom)',
    lineSubtitle: 'Tren pertumbuhan volume timbangan per minggu bulan ini (Klik titik untuk zoom)',
    dominantInfo: 'Kategori Dominan: Beras (48.6%)',
    peakInfo: 'Minggu Tertinggi: Minggu 4 (2.020 kg)',
    avgInfo: 'Rata-rata: 1.852 kg / minggu',
  },
  year: {
    dataKeyName: 'label',
    data: [
      { label: 'Jan', beras: 3400, daging: 2200, sembako: 1200, total: 6800 },
      { label: 'Feb', beras: 3600, daging: 2400, sembako: 1300, total: 7300 },
      { label: 'Mar', beras: 3900, daging: 2600, sembako: 1400, total: 7900 },
      { label: 'Apr', beras: 4100, daging: 2800, sembako: 1500, total: 8400 },
      { label: 'Mei', beras: 4500, daging: 3100, sembako: 1600, total: 9200 },
      { label: 'Jun', beras: 4300, daging: 2900, sembako: 1550, total: 8750 },
      { label: 'Jul', beras: 4200, daging: 2850, sembako: 1500, total: 8550 },
      { label: 'Agu', beras: 4400, daging: 3000, sembako: 1580, total: 8980 },
      { label: 'Sep', beras: 4050, daging: 2750, sembako: 1450, total: 8250 },
      { label: 'Okt', beras: 4600, daging: 3150, sembako: 1700, total: 9450 },
      { label: 'Nov', beras: 4350, daging: 2950, sembako: 1550, total: 8850 },
      { label: 'Des', beras: 4900, daging: 3300, sembako: 1800, total: 10000 },
    ],
    yDomain: [0, 12000],
    unit: ' kg',
    barSubtitle: 'Rekap tahunan volume komoditas barang per bulan tahun 2026 (Klik bar untuk zoom)',
    lineSubtitle: 'Tren performa akumulasi volume timbangan 12 bulan sepanjang tahun (Klik titik untuk zoom)',
    dominantInfo: 'Kategori Dominan: Beras (47.9%)',
    peakInfo: 'Bulan Puncak: Desember (10.000 kg)',
    avgInfo: 'Rata-rata: 8.700 kg / bulan',
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface WeightTrendChartProps {
  period?: TimePeriod;
}

export function WeightTrendChart({ period = 'today' }: WeightTrendChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedPoint, setSelectedPoint] = useState<PeriodChartItem | null>(null);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState<boolean>(false);

  const config = chartConfigByPeriod[period] || chartConfigByPeriod.today;

  // Est revenue based on commodity weights
  const calculateEstimatedRevenue = (item: PeriodChartItem) => {
    return (item.beras * 16500) + (item.daging * 135000) + (item.sembako * 18000);
  };

  const handleChartClick = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const clickedData = e.activePayload[0].payload as PeriodChartItem;
      setSelectedPoint(prev => (prev?.label === clickedData.label ? null : clickedData));
    }
  };

  return (
    <>
      <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6 relative overflow-hidden">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl border transition-colors",
              chartType === 'bar'
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
            )}>
              {chartType === 'bar' ? (
                <BarChart3 className="w-5 h-5" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 font-sans">
                {chartType === 'bar' ? 'Grafik Batang (Kategori Barang)' : 'Grafik Garis (Tren Total Volume)'}
              </h2>
              <p className="text-xs text-gray-500">
                {chartType === 'bar' ? config.barSubtitle.replace(' (Klik bar untuk zoom)', '') : config.lineSubtitle.replace(' (Klik titik untuk zoom)', '')}
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Switcher: Grafik Batang vs Grafik Garis */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => {
                  setChartType('bar');
                  setSelectedPoint(null);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  chartType === 'bar'
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Batang</span>
              </button>
              <button
                onClick={() => {
                  setChartType('line');
                  setSelectedPoint(null);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  chartType === 'line'
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Garis</span>
              </button>
            </div>

            {/* Fullscreen Zoom In Modal Trigger */}
            <button
              onClick={() => setIsFullscreenZoom(true)}
              title="Perbesar Layar Grafik Penuh"
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <Maximize2 className="w-4 h-4 text-gray-700" />
              <span className="hidden md:inline">Perbesar</span>
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-[320px] w-full cursor-pointer relative group select-none">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={config.data}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                onClick={handleChartClick}
                style={{ outline: 'none' }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                  dy={8} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  domain={config.yDomain} 
                  unit={config.unit}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(37, 99, 235, 0.04)', radius: 8 }}
                  formatter={(value: any, name: any) => [`${Number(value).toLocaleString('id-ID')} kg`, name]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', fontWeight: 600 }} />
                
                <Bar 
                  dataKey="beras" 
                  name="Beras" 
                  stackId="a" 
                  fill="#2563eb" 
                  barSize={period === 'year' ? 18 : 34} 
                  style={{ outline: 'none' }}
                >
                  {config.data.map((entry, idx) => {
                    const isSelected = selectedPoint?.label === entry.label;
                    const isAnySelected = selectedPoint !== null;
                    return (
                      <Cell
                        key={`beras-${idx}`}
                        fill="#2563eb"
                        opacity={isAnySelected ? (isSelected ? 1.0 : 0.3) : 1.0}
                        style={{ outline: 'none', transition: 'opacity 0.25s ease' }}
                      />
                    );
                  })}
                </Bar>
                <Bar 
                  dataKey="daging" 
                  name="Daging & Protein" 
                  stackId="a" 
                  fill="#10b981" 
                  barSize={period === 'year' ? 18 : 34} 
                  style={{ outline: 'none' }}
                >
                  {config.data.map((entry, idx) => {
                    const isSelected = selectedPoint?.label === entry.label;
                    const isAnySelected = selectedPoint !== null;
                    return (
                      <Cell
                        key={`daging-${idx}`}
                        fill="#10b981"
                        opacity={isAnySelected ? (isSelected ? 1.0 : 0.3) : 1.0}
                        style={{ outline: 'none', transition: 'opacity 0.25s ease' }}
                      />
                    );
                  })}
                </Bar>
                <Bar 
                  dataKey="sembako" 
                  name="Sembako Lainnya" 
                  stackId="a" 
                  fill="#8b5cf6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={period === 'year' ? 18 : 34} 
                  style={{ outline: 'none' }}
                >
                  {config.data.map((entry, idx) => {
                    const isSelected = selectedPoint?.label === entry.label;
                    const isAnySelected = selectedPoint !== null;
                    return (
                      <Cell
                        key={`sembako-${idx}`}
                        fill="#8b5cf6"
                        opacity={isAnySelected ? (isSelected ? 1.0 : 0.3) : 1.0}
                        style={{ outline: 'none', transition: 'opacity 0.25s ease' }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart
                data={config.data}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                onClick={handleChartClick}
                style={{ outline: 'none' }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                  dy={8} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  domain={config.yDomain} 
                  unit={config.unit}
                />
                <Tooltip
                  cursor={{ stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString('id-ID')} kg`, 'Total Berat']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', fontWeight: 600 }} />
                
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total Volume Berat (kg)"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8, strokeWidth: 2, stroke: '#059669' }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* INTERACTIVE CLICK-TO-ZOOM DRILL-DOWN PANEL */}
        {selectedPoint && (
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/90 border border-blue-200 rounded-2xl p-5 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Rincian Waktu</span>
                    <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded-md font-sans">
                      {selectedPoint.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Komposisi bobot barang dan estimasi transaksi pada titik ini
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPoint(null)}
                className="self-end sm:self-auto flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {/* Total Bobot */}
              <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span>Total Bobot</span>
                  <Package className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="mt-2">
                  <span className="text-xl sm:text-2xl font-black text-gray-900 font-sans tabular-nums">
                    {selectedPoint.total.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-blue-600 ml-1">kg</span>
                </div>
              </div>

              {/* Beras */}
              <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span>Beras</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                </div>
                <div className="mt-2">
                  <span className="text-xl sm:text-2xl font-black text-blue-700 font-sans tabular-nums">
                    {selectedPoint.beras.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-gray-400 ml-1">
                    ({Math.round((selectedPoint.beras / selectedPoint.total) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Daging */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span>Daging & Protein</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="mt-2">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 font-sans tabular-nums">
                    {selectedPoint.daging.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-gray-400 ml-1">
                    ({Math.round((selectedPoint.daging / selectedPoint.total) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Est. Omset */}
              <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span>Est. Nilai Transaksi</span>
                  <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-black text-purple-700 font-sans tabular-nums">
                    {formatRupiah(calculateEstimatedRevenue(selectedPoint))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
          {chartType === 'bar' ? (
            <>
              <span className="font-semibold text-blue-700">{config.dominantInfo}</span>
              <span className="text-gray-400">Diagram Batang Terakumulasi per Kategori</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-emerald-700">{config.peakInfo}</span>
              <span className="text-gray-400">{config.avgInfo}</span>
            </>
          )}
        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL DIALOG WITH BRUSH NAVIGATION */}
      {isFullscreenZoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-sans">
                    Mode Zoom In / Tampilan Penuh Grafik
                  </h3>
                  <p className="text-xs text-gray-500">
                    Gunakan slider navigator (Brush) di bawah grafik untuk memperbesar rentang waktu secara leluasa
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFullscreenZoom(false)}
                className="p-2 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 transition-colors cursor-pointer"
                title="Tutup Zoom Penuh"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Chart Body */}
            <div className="p-6 flex-grow flex flex-col gap-4 overflow-y-auto">
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={config.data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 13, fill: '#475569', fontWeight: 700 }} 
                        dy={8} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b' }} 
                        domain={config.yDomain} 
                        unit={config.unit}
                      />
                      <Tooltip
                        formatter={(value: any, name: any) => [`${Number(value).toLocaleString('id-ID')} kg`, name]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          padding: '10px 14px',
                          fontSize: '13px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '16px', fontWeight: 600 }} />
                      <Brush dataKey="label" height={30} stroke="#2563eb" fill="#eff6ff" />
                      
                      <Bar dataKey="beras" name="Beras" stackId="a" fill="#2563eb" barSize={36} />
                      <Bar dataKey="daging" name="Daging & Protein" stackId="a" fill="#10b981" barSize={36} />
                      <Bar dataKey="sembako" name="Sembako Lainnya" stackId="a" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                  ) : (
                    <AreaChart data={config.data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <defs>
                        <linearGradient id="modalColorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 13, fill: '#475569', fontWeight: 700 }} 
                        dy={8} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b' }} 
                        domain={config.yDomain} 
                        unit={config.unit}
                      />
                      <Tooltip
                        formatter={(value: any) => [`${Number(value).toLocaleString('id-ID')} kg`, 'Total Berat']}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          padding: '10px 14px',
                          fontSize: '13px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '16px', fontWeight: 600 }} />
                      <Brush dataKey="label" height={30} stroke="#10b981" fill="#ecfdf5" />
                      
                      <Area
                        type="monotone"
                        dataKey="total"
                        name="Total Volume Berat (kg)"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#modalColorTotal)"
                        dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#ffffff' }}
                        activeDot={{ r: 9, strokeWidth: 3 }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
              <span className="font-semibold text-blue-700">Skala Zoom Resolusi Tinggi</span>
              <button
                onClick={() => setIsFullscreenZoom(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Selesai / Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WeightTrendChart;

