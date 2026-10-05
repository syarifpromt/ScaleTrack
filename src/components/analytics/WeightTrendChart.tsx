'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimePeriod } from '@/app/history/page';

interface PeriodChartConfig {
  dataKeyName: string;
  data: Array<{
    label: string;
    beras: number;
    daging: number;
    sembako: number;
    total: number;
  }>;
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
    barSubtitle: 'Distribusi bobot per kategori barang pada jam operasional hari ini',
    lineSubtitle: 'Fluktuasi volume penimbangan per interval waktu 2 jam hari ini',
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
    barSubtitle: 'Komposisi volume bobot per kategori barang selama 7 hari terakhir',
    lineSubtitle: 'Kurva tren fluktuasi total bobot timbangan harian minggu ini',
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
    barSubtitle: 'Akumulasi bobot per kategori barang selama 4 minggu bulan berjalan',
    lineSubtitle: 'Tren pertumbuhan volume timbangan per minggu bulan ini',
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
    barSubtitle: 'Rekap tahunan volume komoditas barang per bulan tahun 2026',
    lineSubtitle: 'Tren performa akumulasi volume timbangan 12 bulan sepanjang tahun',
    dominantInfo: 'Kategori Dominan: Beras (47.9%)',
    peakInfo: 'Bulan Puncak: Desember (10.000 kg)',
    avgInfo: 'Rata-rata: 8.700 kg / bulan',
  },
};

interface WeightTrendChartProps {
  period?: TimePeriod;
}

export function WeightTrendChart({ period = 'today' }: WeightTrendChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const config = chartConfigByPeriod[period] || chartConfigByPeriod.today;

  return (
    <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
      {/* Header & Type Switcher */}
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
              {chartType === 'bar' ? config.barSubtitle : config.lineSubtitle}
            </p>
          </div>
        </div>

        {/* Switcher: Grafik Batang vs Grafik Garis */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              chartType === 'bar'
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik Batang</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              chartType === 'line'
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Grafik Garis</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={config.data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
              
              <Bar dataKey="beras" name="Beras" stackId="a" fill="#2563eb" barSize={period === 'year' ? 18 : 32} />
              <Bar dataKey="daging" name="Daging & Protein" stackId="a" fill="#10b981" barSize={period === 'year' ? 18 : 32} />
              <Bar dataKey="sembako" name="Sembako Lainnya" stackId="a" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={period === 'year' ? 18 : 32} />
            </BarChart>
          ) : (
            <AreaChart data={config.data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
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
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

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
  );
}

export default WeightTrendChart;

