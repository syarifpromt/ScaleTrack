'use client';

import React from 'react';
import { cn, formatAdaptiveWeight } from '@/lib/utils';
import { Scale, Volume2, VolumeX, ArrowUpCircle, Plus, Minus, Tag, Banknote, RotateCcw } from 'lucide-react';

interface ScaleDisplayProps {
  netWeight: number;
  grossWeight: number;
  tareWeight: number;
  productName: string;
  pricePerKg: number;
  isStable: boolean;
  isOverload: boolean;
  isZero: boolean;
  stabilityProgress: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSimulateWeight: (weight: number) => void;
  onAddWeight?: (amountKg: number) => void;
  onJiggle: () => void;
  onZero?: () => void;
  onTare?: () => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ScaleDisplay({
  netWeight,
  grossWeight,
  tareWeight,
  productName,
  pricePerKg,
  isStable,
  isOverload,
  isZero,
  stabilityProgress,
  soundEnabled,
  onToggleSound,
  onSimulateWeight,
  onAddWeight,
  onJiggle,
  onZero,
  onTare
}: ScaleDisplayProps) {
  const maxCapacityKg = 5.000;
  const loadPercent = Math.min(100, Math.max(0, (netWeight / maxCapacityKg) * 100));
  const totalPrice = Math.round(netWeight * pricePerKg);
  const adaptiveWeight = formatAdaptiveWeight(netWeight);
  // Sedang menimbang: ada beban, belum stabil, bukan overload
  const isWeighing = !isOverload && !isStable && netWeight > 0.02;

  return (
    <div className="card p-5 sm:p-6 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Timbangan Digital</h2>
            <p className="text-xs text-gray-500">Hitung otomatis total harga berdasarkan berat</p>
          </div>
        </div>

        {/* Sound toggle button */}
        <button
          onClick={onToggleSound}
          className={cn(
            "px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
            soundEnabled ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
          )}
          title={soundEnabled ? "Suara aktif" : "Suara dimatikan"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Suara' : 'Mute'}</span>
        </button>
      </div>

      {/* Main Clean Light Viewport Screen */}
      <div className={cn(
        "rounded-2xl p-6 sm:p-7 flex flex-col gap-5 transition-all duration-500 border shadow-xs",
        isOverload
          ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/30"
          : isStable
          ? "bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/30"
          : isWeighing
          ? "bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/30"
          : "bg-slate-50/80 border-slate-200/90"
      )}>
        {/* Active Product & Price Info */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Tag className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-base font-bold text-gray-900 uppercase truncate">
              {productName || 'Pilih Produk'}
            </span>
          </div>

          <div className="text-xs text-gray-600 font-mono shrink-0">
            Harga: <strong className="text-emerald-700 text-sm font-bold">{formatRupiah(pricePerKg)} / kg</strong>
          </div>
        </div>

        {/* 2 Clean Computation Boxes: Berat Barang & Total Harga (Symmetric & Zero-Layout-Shift) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {/* Box 1: Berat Barang */}
          <div className={cn(
            "flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 min-w-0 shadow-2xs",
            isOverload
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : isStable
              ? "bg-white border-emerald-300 ring-1 ring-emerald-400/30"
              : isWeighing
              ? "bg-white border-amber-300 ring-1 ring-amber-400/30"
              : "bg-white border-gray-200"
          )}>
            {/* Header: h-6 */}
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 h-6">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Berat Barang</span>
            </div>

            {/* Angka Digital Berat: Locked height h-[72px] sm:h-[80px] to prevent any layout shifts */}
            <div className="h-[72px] sm:h-[80px] flex items-center min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "font-black transition-colors duration-300",
                  isOverload
                    ? "text-3xl sm:text-4xl font-black tracking-normal text-rose-600 whitespace-nowrap"
                    : "text-5xl sm:text-6xl font-mono tracking-tight tabular-nums",
                  !isOverload && (
                    isStable
                      ? "text-emerald-600"
                      : isWeighing
                      ? "text-amber-500"
                      : "text-gray-900"
                  )
                )}>
                  {isOverload ? 'OVERLOAD' : adaptiveWeight.value}
                </span>
                {!isOverload && (
                  <span className={cn(
                    "text-2xl font-bold transition-colors duration-300 shrink-0",
                    isStable ? "text-emerald-600" : isWeighing ? "text-amber-500" : "text-gray-500"
                  )}>
                    {adaptiveWeight.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Indikator Status Menimbang: Locked height h-8 */}
            <div className="h-8 flex items-center">
              <div className={cn(
                "flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 w-fit",
                isOverload
                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                  : isStable
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : isWeighing
                  ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                  : "bg-gray-100 text-gray-500"
              )}>
                {isOverload ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>⚠ Kelebihan Beban (&gt; 5 kg)</span>
                  </>
                ) : isStable ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>✓ Selesai Menimbang</span>
                  </>
                ) : isWeighing ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span>Sedang Menimbang...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>Standby</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Box 2: Total Harga */}
          <div className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-emerald-200/90 bg-emerald-50/80 shadow-2xs min-w-0">
            {/* Header: h-6 */}
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 h-6">
              <Banknote className="w-4 h-4 text-emerald-700" />
              <span>Total Harga</span>
            </div>

            {/* Angka Total Harga: Locked height h-[72px] sm:h-[80px] */}
            <div className="h-[72px] sm:h-[80px] flex items-center min-w-0">
              <div className="text-3xl sm:text-4xl font-mono font-black tracking-tight tabular-nums text-emerald-800 truncate">
                {isOverload ? 'Rp 0' : formatRupiah(totalPrice)}
              </div>
            </div>

            {/* Subtitle / Footer: Locked height h-8 */}
            <div className="h-8 flex items-center">
              <span className="text-[11px] text-emerald-700 font-medium">
                {isOverload ? 'Kelebihan beban — harga dinonaktifkan' : 'Dihitung live: Berat × Harga/kg'}
              </span>
            </div>
          </div>
        </div>

        {/* Load Sensor Bar (0 to 5.0 kg) & Zero Button underneath */}
        <div className="pt-2 border-t border-gray-200/80 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[11px] font-mono text-gray-500">
            <span>0.00 kg</span>
            <span className={cn(
              "font-bold uppercase tracking-wider",
              isOverload ? "text-rose-600 font-bold" : isStable ? "text-emerald-700" : isWeighing ? "text-amber-600" : "text-gray-700"
            )}>
              KAPASITAS SENSOR: {isOverload ? '100% (OVERLOAD)' : `${loadPercent.toFixed(0)}%`} (MAKS {maxCapacityKg.toFixed(1)} KG)
            </span>
            <span>{maxCapacityKg.toFixed(1)} kg</span>
          </div>
          
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300/60">
            <div 
              className={cn(
                "h-full transition-all duration-200 rounded-full",
                isOverload 
                  ? "bg-rose-500 w-full" 
                  : isStable 
                  ? "bg-emerald-500" 
                  : isWeighing
                  ? "bg-amber-500"
                  : loadPercent > 80 
                  ? "bg-amber-500" 
                  : "bg-blue-600"
              )}
              style={{ width: isOverload ? '100%' : `${loadPercent}%` }}
            />
          </div>

          {/* Ergonomic Zero Action directly below capacity bar */}
          {onZero && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 font-mono">
                Shortcut keyboard: Tekan <strong className="text-gray-600">[Z]</strong>
              </span>
              <button
                onClick={onZero}
                type="button"
                className="px-4 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                title="Reset timbangan ke nol (Shortcut: Z)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>Nol-kan Timbangan (Zero)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Control Section */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col gap-3">
        {/* Row 1: Beban Fiks Langsung */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <span>Contoh Beban:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onSimulateWeight(0.200)}
                className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
              >
                200 g
              </button>
              <button
                onClick={() => onSimulateWeight(0.350)}
                className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
              >
                350 g
              </button>
              <button
                onClick={() => onSimulateWeight(0.500)}
                className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
              >
                500 g
              </button>
              <button
                onClick={() => onSimulateWeight(1.000)}
                className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
              >
                1 kg
              </button>
              <button
                onClick={() => onSimulateWeight(2.500)}
                className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
              >
                2.5 kg
              </button>
              <button
                onClick={() => onSimulateWeight(5.000)}
                className="py-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
              >
                5 kg (Maks)
              </button>
              <button
                onClick={() => onSimulateWeight(5.500)}
                className="py-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg shadow-2xs text-xs font-bold transition cursor-pointer"
                title="Uji coba simulasi kelebihan beban (Overload > 5.0 kg)"
              >
                5.5 kg (Overload)
              </button>
            </div>
          </div>

          <button
            onClick={() => onSimulateWeight(0.000)}
            className="py-1.5 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            Angkat Barang (0 kg)
          </button>
        </div>

        {/* Row 2: Tambah Beban Bertahap (+50g, +100g, +500g, +1kg) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <span>Tambah Beban:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onAddWeight ? onAddWeight(0.050) : onSimulateWeight(netWeight + 0.050)}
                className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-bold transition flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 50 g
              </button>
              <button
                onClick={() => onAddWeight ? onAddWeight(0.100) : onSimulateWeight(netWeight + 0.100)}
                className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-bold transition flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 100 g
              </button>
              <button
                onClick={() => onAddWeight ? onAddWeight(0.500) : onSimulateWeight(netWeight + 0.500)}
                className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-bold transition flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 500 g
              </button>
              <button
                onClick={() => onAddWeight ? onAddWeight(1.000) : onSimulateWeight(netWeight + 1.000)}
                className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-bold transition flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 1 kg
              </button>
              <button
                onClick={() => onAddWeight ? onAddWeight(-0.100) : onSimulateWeight(Math.max(0, netWeight - 0.100))}
                disabled={netWeight < 0.100}
                className="py-1.5 px-2 bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold transition flex items-center gap-0.5 cursor-pointer"
              >
                <Minus className="w-3 h-3" /> 100 g
              </button>
            </div>
          </div>

          <button
            onClick={onJiggle}
            className="text-xs px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold transition cursor-pointer"
            title="Uji coba sensor goyang"
          >
            👋 Goyang Sensor
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScaleDisplay;
