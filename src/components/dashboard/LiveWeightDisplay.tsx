'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import { Scale, ArrowRight, RotateCcw, Volume2, VolumeX, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { useScaleEngine } from '@/hooks/useScaleEngine';
import { formatAdaptiveWeight } from '@/lib/utils';
import { unlockScaleAudio, playStableSound } from '@/lib/scale-sounds';

export function LiveWeightDisplay() {
  const [baseLoad, setBaseLoad] = useState<number>(0.000);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Browser audio unlock on first user interaction
  useEffect(() => {
    const unlock = () => {
      unlockScaleAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const handleToggleSound = useCallback(() => {
    if (!soundEnabled) {
      unlockScaleAudio();
      playStableSound();
    }
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled]);

  // Realistic load simulation: dynamic fluctuation (~1.2s) + stabilization (~1.0s) = ~2.2s total Orange phase
  const baseLoadRef = useRef<number>(0.000);
  const targetLoadRef = useRef<number>(0.000);
  const rafRef = useRef<number | null>(null);

  const cancelLoadAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const applyLoad = useCallback((value: number) => {
    baseLoadRef.current = value;
    setBaseLoad(value);
  }, []);

  const placeLoad = useCallback((rawTarget: number) => {
    cancelLoadAnimation();

    const target = Math.max(0, Number(rawTarget.toFixed(3)));
    targetLoadRef.current = target;

    // Lifting the item off: drop to zero immediately
    if (target <= 0.005) {
      applyLoad(0);
      return;
    }

    const maxCap = 5.000;
    let from = baseLoadRef.current;
    let delta = target - from;

    // Jika mengklik beban yang sama, beri efek dinamis seakan barang ditaruh ulang
    if (Math.abs(delta) < 0.005) {
      from = Math.max(0, target - 0.120);
      delta = target - from;
    }

    const animationDurationMs = 1200;
    const start = performance.now();
    const amplitude = Math.max(0.015, Math.min(0.045, Math.abs(delta) * 0.15));

    const step = (now: number) => {
      const elapsed = now - start;

      if (elapsed < animationDurationMs) {
        const p = elapsed / animationDurationMs;
        const base = from + delta * (1 - Math.pow(1 - p, 2.6));
        const fluctuation = amplitude * Math.sin(p * Math.PI * 5) * Math.pow(1 - p, 1.8);

        let value = base + fluctuation;
        if (target <= maxCap) {
          value = Math.min(value, maxCap);
        }
        value = Math.max(0, value);

        applyLoad(Number(value.toFixed(4)));
        rafRef.current = requestAnimationFrame(step);
      } else {
        applyLoad(target);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [applyLoad, cancelLoadAnimation]);

  useEffect(() => cancelLoadAnimation, [cancelLoadAnimation]);

  const {
    netWeight,
    isStable,
    isOverload,
    handleZero,
    maxCapacityKg
  } = useScaleEngine(baseLoad, {
    maxCapacityKg: 5.000,
    minWeightTriggerKg: 0.010,
    stabilityToleranceKg: 0.001,
    stabilityDurationMs: 1000,
    soundEnabled
  });

  const adaptiveWeight = formatAdaptiveWeight(netWeight);
  const loadPercent = Math.min(100, Math.max(0, (netWeight / maxCapacityKg) * 100));
  const isWeighing = !isOverload && !isStable && netWeight > 0.010;

  return (
    <div className="card h-full flex flex-col justify-between bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2 bg-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Timbangan Digital</h2>
            <p className="text-[11px] text-gray-500">Kapasitas Maksimal {maxCapacityKg.toFixed(1)} kg</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className={clsx(
              "px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
              soundEnabled ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200"
            )}
            title={soundEnabled ? "Suara notifikasi aktif" : "Suara dimatikan"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Suara' : 'Mute'}</span>
          </button>

          <Link 
            href="/weighing" 
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>Stasiun Timbang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Compact Clean Screen Display */}
      <div className="p-5 flex-1 flex flex-col justify-center items-center">
        <div className="w-full rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center border border-slate-200/90 bg-slate-50/80 shadow-2xs">
          {/* Big Digital Weight Number: Locked height h-[72px] sm:h-[80px] */}
          <div className="h-[72px] sm:h-[80px] flex items-center justify-center my-1">
            <div className="flex items-baseline gap-2">
              <span className={clsx(
                "font-black transition-colors duration-200",
                isOverload
                  ? "text-4xl sm:text-5xl font-black tracking-normal text-rose-600 whitespace-nowrap"
                  : "text-5xl sm:text-6xl font-sans font-black tracking-tight tabular-nums",
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
                <span className={clsx(
                  "text-2xl font-bold transition-colors",
                  isStable ? "text-emerald-600" : isWeighing ? "text-amber-500" : "text-gray-400"
                )}>
                  {adaptiveWeight.unit}
                </span>
              )}
            </div>
          </div>

          {/* Status Badge: Locked height h-8 placed below the weight number */}
          <div className="h-8 flex items-center mt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 shadow-2xs">
              {isOverload ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-rose-600">⚠ Kelebihan Beban (&gt; 5 kg)</span>
                </>
              ) : isStable ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700">Selesai Menimbang</span>
                </>
              ) : isWeighing ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-amber-600">Sedang Menimbang...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-gray-600">Standby</span>
                </>
              )}
            </div>
          </div>

          {/* Indikator Bar Kapasitas Maksimal */}
          <div className="w-full mt-3 pt-3 border-t border-gray-200/70 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono text-gray-500">
              <span>0.00 kg</span>
              <span className={clsx(
                "font-bold uppercase tracking-wider text-[10px]",
                isOverload ? "text-rose-600 font-bold" : isStable ? "text-emerald-700" : isWeighing ? "text-amber-600" : "text-gray-700"
              )}>
                Kapasitas: {isOverload ? '100% (OVERLOAD)' : `${loadPercent.toFixed(0)}%`} (Maks {maxCapacityKg.toFixed(1)} kg)
              </span>
              <span>{maxCapacityKg.toFixed(1)} kg</span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300/60">
              <div 
                className={clsx(
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
          </div>
        </div>
      </div>

      {/* Compact Quick Actions / Mini Simulator */}
      <div className="p-3.5 px-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-500 font-medium">Uji Cepat:</span>
          <button
            onClick={() => placeLoad(0.500)}
            className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg font-bold shadow-2xs transition cursor-pointer"
          >
            500 g
          </button>
          <button
            onClick={() => placeLoad(1.000)}
            className="py-1 px-2.5 bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300 rounded-lg font-bold shadow-2xs transition cursor-pointer"
          >
            1 kg
          </button>
          <button
            onClick={() => placeLoad(5.500)}
            className="py-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg font-bold shadow-2xs transition cursor-pointer"
            title="Uji coba overload > 5 kg"
          >
            5.5 kg (Overload)
          </button>
          <button
            onClick={() => placeLoad(0.000)}
            className="py-1 px-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <ArrowUpCircle className="w-3 h-3" />
            <span>Angkat (0 kg)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZero}
            className="py-1 px-3 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg font-bold shadow-2xs transition cursor-pointer flex items-center gap-1"
            title="Reset sensor ke nol (Zero)"
          >
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>Zero</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveWeightDisplay;
