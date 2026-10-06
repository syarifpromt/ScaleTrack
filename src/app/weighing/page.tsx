'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScaleDisplay } from '@/components/weighing/ScaleDisplay';
import { ProductSelector, Product } from '@/components/weighing/ProductSelector';
import { BatchMetadata } from '@/components/weighing/BatchMetadata';
import { ActionButtons } from '@/components/weighing/ActionButtons';
import { RecentWeighingsMini } from '@/components/weighing/RecentWeighingsMini';
import { SyncBanner } from '@/components/weighing/SyncBanner';
import { useScaleEngine } from '@/hooks/useScaleEngine';
import { unlockScaleAudio, playStableSound } from '@/lib/scale-sounds';

const initialSelectedProduct: Product = {
  id: '1',
  name: 'Beras Premium',
  pricePerKg: 16500,
  category: 'Sembako',
};

export default function WeighingStationPage() {
  const [showSync, setShowSync] = useState(false);
  const [syncId, setSyncId] = useState(142);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Browsers block audio until the user interacts with the page once.
  // Unlock it on the first click / key press so automatic alerts can play.
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

  // Toggle sound; when turning it on, play a short preview so the operator can check volume
  const handleToggleSound = useCallback(() => {
    if (!soundEnabled) {
      unlockScaleAudio();
      playStableSound();
    }
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled]);


  // Selected Active Product for free-weight pricing
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialSelectedProduct);

  // Simulation state: Base load placed on scale (kg) - start at 0 kg (standby)
  const [baseLoad, setBaseLoad] = useState<number>(0.000);
  const [simulatedJitter, setSimulatedJitter] = useState<number>(0);
  const [isJiggling, setIsJiggling] = useState<boolean>(false);

  // Realistic load placement: dynamic oscillation and rise curve (~1.2s fluctuation + ~1.0s settle = ~2.2s total Orange phase)
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

    // Jika pengguna mengklik tombol beban yang sama untuk menguji ulang,
    // buat kejutan dinamis (drop sebentar & rebound) seakan barang diangkat lalu ditaruh ulang
    if (Math.abs(delta) < 0.005) {
      from = Math.max(0, target - 0.120);
      delta = target - from;
    }

    // Durasi pergerakan & getaran beban di atas tatakan timbangan (~1200ms)
    // Ditambah durasi verifikasi sensor useScaleEngine (~1000ms) = total ~2.2 detik (Orange -> Hijau)
    const animationDurationMs = 1200;
    const start = performance.now();

    // Amplitudo fluktuasi sensor saat barang ditaruh (antara 15g s/d 45g)
    const amplitude = Math.max(0.015, Math.min(0.045, Math.abs(delta) * 0.15));

    const step = (now: number) => {
      const elapsed = now - start;

      if (elapsed < animationDurationMs) {
        const p = elapsed / animationDurationMs;
        // Kurva menanjak dinamis (ease-out)
        const base = from + delta * (1 - Math.pow(1 - p, 2.6));
        // Fluktuasi sensor naik-turun yang meredam
        const fluctuation = amplitude * Math.sin(p * Math.PI * 5) * Math.pow(1 - p, 1.8);

        let value = base + fluctuation;
        // Jika target beban normal, pastikan tidak melewati batas maksimal saat berayun
        if (target <= maxCap) {
          value = Math.min(value, maxCap);
        }
        value = Math.max(0, value);

        applyLoad(Number(value.toFixed(4)));
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Fase fluktuasi selesai: kunci tepat di target beban
        applyLoad(target);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [applyLoad, cancelLoadAnimation]);

  const addLoad = useCallback((amount: number) => {
    placeLoad(targetLoadRef.current + amount);
  }, [placeLoad]);

  useEffect(() => cancelLoadAnimation, [cancelLoadAnimation]);


  // Sensor jitter: only applies high vibration when user clicks "Goyang Sensor" (isJiggling)
  useEffect(() => {
    if (!isJiggling) {
      setSimulatedJitter(0);
      return;
    }
    const interval = setInterval(() => {
      const heavyJitter = (Math.random() - 0.5) * 0.040;
      setSimulatedJitter(heavyJitter);
    }, 100);

    return () => clearInterval(interval);
  }, [isJiggling]);

  // Current Raw Sensor Weight (combines base load and jitter)
  const rawSensorWeight = baseLoad > 0.005 ? Math.max(0, baseLoad + simulatedJitter) : 0;

  // Scale Engine Hook (5.000 kg capacity, 10mg stability threshold, 1.2s stability time)
  const {
    netWeight,
    grossWeight,
    tareWeight,
    isStable,
    isOverload,
    isZero,
    stabilityProgress,
    handleTare,
    handleZero,
    maxCapacityKg
  } = useScaleEngine(rawSensorWeight, {
    maxCapacityKg: 5.000,
    minWeightTriggerKg: 0.010, // mulai membaca dari 10 gram
    stabilityToleranceKg: 0.001, // ±10mg / 1g
    stabilityDurationMs: 1000,   // 1.0 detik stabilisasi konstan setelah getaran beban mereda (~2.2s total Orange phase)
    soundEnabled
  });

  // Action: Save Weighing (Manual Trigger)
  const handleSave = useCallback(() => {
    if (isOverload || isZero || !isStable) {
      return;
    }
    setSyncId(prev => prev + 1);
    setShowSync(true);

    setTimeout(() => {
      setShowSync(false);
    }, 3500);
  }, [isOverload, isZero, isStable]);

  // Keyboard Shortcuts: SPACE/F9 (Save), T (Tare), Z (Zero)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ' || e.key === 'F9') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleTare();
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleZero();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleTare, handleZero]);

  // Simulate shaking scale
  const triggerJiggle = () => {
    setIsJiggling(true);
    setTimeout(() => {
      setIsJiggling(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-12">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-4">
        
        <SyncBanner 
          show={showSync} 
          onDismiss={() => setShowSync(false)} 
          id={syncId} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Industrial Display & Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ScaleDisplay 
              netWeight={netWeight}
              grossWeight={grossWeight}
              tareWeight={tareWeight}
              productName={selectedProduct.name}
              pricePerKg={selectedProduct.pricePerKg || 0}
              isStable={isStable}
              isOverload={isOverload}
              isZero={isZero}
              stabilityProgress={stabilityProgress}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onSimulateWeight={placeLoad}
              onAddWeight={addLoad}
              onJiggle={triggerJiggle}
              onZero={handleZero}
              onTare={handleTare}
            />

            <ActionButtons 
              onSave={handleSave} 
              onTare={handleTare}
              onZero={handleZero}
              isStable={isStable}
              isOverload={isOverload}
              isZero={isZero}
            />

            <RecentWeighingsMini />
          </div>

          {/* Right Column: SKU Selector & Metadata (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <ProductSelector 
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
            <BatchMetadata />
          </div>
        </div>
      </div>
    </div>
  );
}
