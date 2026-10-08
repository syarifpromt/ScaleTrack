'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScaleDisplay } from '@/components/weighing/ScaleDisplay';
import { Product } from '@/lib/products-store';
import { WeighingActiveProductCard } from '@/components/weighing/WeighingActiveProductCard';
import { BatchMetadata } from '@/components/weighing/BatchMetadata';
import { ActionButtons } from '@/components/weighing/ActionButtons';
import { RecentWeighingsMini, WeighingRecord } from '@/components/weighing/RecentWeighingsMini';
import { SyncBanner } from '@/components/weighing/SyncBanner';
import { ReceiptModal, ReceiptData } from '@/components/weighing/ReceiptModal';
import { useScaleEngine } from '@/hooks/useScaleEngine';
import { unlockScaleAudio, playStableSound } from '@/lib/scale-sounds';

const initialSelectedProduct: Product = {
  id: '1',
  name: 'Beras Premium',
  pricePerKg: 16500,
  category: 'Sembako',
};

import { saveTransaction, useTransactions } from '@/lib/transactions-store';
import { useScaleConnection } from '@/lib/device-store';
import { supabase } from '@/lib/supabase';

export default function WeighingStationPage() {
  const { isScaleConnected } = useScaleConnection();
  const { transactions } = useTransactions();
  const [showSync, setShowSync] = useState(false);
  const [syncId, setSyncId] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live Recent Weighings (Synchronized with real transactions)
  const recentRecords: WeighingRecord[] = transactions.slice(0, 5).map((t, idx) => ({
    id: idx + 1,
    time: t.time.includes(',') ? t.time.split(',')[1].trim() : t.time,
    weight: t.weightKg,
    isPass: t.status !== 'rejected',
    productName: t.productName,
  }));

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

  // Current Raw Sensor Weight (combines base load and jitter, 0 if scale disconnected)
  const rawSensorWeight = isScaleConnected && baseLoad > 0.005 ? Math.max(0, baseLoad + simulatedJitter) : 0;

  // Live ESP32 Sensor Reading Listener (Polling /api/scale/reading)
  const [isEspLive, setIsEspLive] = useState<boolean>(false);
  const [espDeviceName, setEspDeviceName] = useState<string>('ESP32 Simulasi (HX711)');
  const lastEspTimestampRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/scale/reading', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        setIsEspLive(Boolean(data.isLive));
        if (data.device) {
          setEspDeviceName(data.device);
        }

        // If active signal with fresh timestamp arrived from ESP32
        if (data.isLive && data.timestamp > lastEspTimestampRef.current) {
          lastEspTimestampRef.current = data.timestamp;
          cancelLoadAnimation();
          applyLoad(Number(data.weightKg));
        }
      } catch {
        // Ignore network hiccups
      }
    }, 400);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [applyLoad, cancelLoadAnimation]);

  // Supabase Realtime WebSocket Listener (Zero-latency push stream dari Cloud)
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;

    const channel = supabase
      .channel('supabase_realtime_scale')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_weights',
        },
        (payload) => {
          const row = payload.new as { weight?: number; is_stable?: boolean; updated_at?: string };
          if (row && typeof row.weight === 'number') {
            cancelLoadAnimation();
            applyLoad(Number(row.weight));
            setIsEspLive(true);
            setEspDeviceName('ESP32 IoT Load Cell (Supabase Cloud)');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applyLoad, cancelLoadAnimation]);

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

  // Receipt Modal State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  // Action: Selesai Menimbang (Buka Struk Transaksi)
  const handleComplete = useCallback(() => {
    if (!isScaleConnected || isOverload || isZero || !isStable) {
      return;
    }

    const calculatedTotal = Math.round(netWeight * (selectedProduct.pricePerKg || 0));
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now) + ' WIB';

    const newReceipt: ReceiptData = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      time: formattedDate,
      productName: selectedProduct.name,
      category: selectedProduct.category,
      weightKg: Number(netWeight.toFixed(3)),
      pricePerKg: selectedProduct.pricePerKg || 0,
      totalPrice: calculatedTotal,
      operator: 'Operator Dummy',
      deviceName: 'Timbangan Utama (SCALE-001)',
    };

    const shortTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    const newRecord: WeighingRecord = {
      id: Number(Date.now().toString().slice(-4)),
      time: shortTime,
      weight: Number(netWeight.toFixed(3)),
      isPass: true,
      productName: selectedProduct.name,
    };

    setReceiptData(newReceipt);
    setIsReceiptOpen(true);
    setSyncId(prev => prev + 1);
    setShowSync(true);

    // Simpan permanen ke database REST API
    saveTransaction({
      id: newReceipt.id,
      timestamp: now.toISOString(),
      time: formattedDate,
      productName: newReceipt.productName,
      category: newReceipt.category,
      weightKg: newReceipt.weightKg,
      pricePerKg: newReceipt.pricePerKg,
      totalPrice: newReceipt.totalPrice,
      operator: newReceipt.operator,
      deviceName: newReceipt.deviceName,
      status: 'accepted',
    });

    setTimeout(() => {
      setShowSync(false);
    }, 3500);
  }, [isOverload, isZero, isStable, netWeight, selectedProduct]);

  // Transaksi Baru: reset beban timbangan
  const handleNewTransaction = useCallback(() => {
    placeLoad(0);
    setIsReceiptOpen(false);
  }, [placeLoad]);

  // Keyboard Shortcuts: SPACE/Enter/F9 (Selesai), T (Tare), Z (Zero)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (!isScaleConnected) return;

      if (e.key === ' ' || e.key === 'F9' || e.key === 'Enter') {
        e.preventDefault();
        handleComplete();
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
  }, [handleComplete, handleTare, handleZero, isScaleConnected]);

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
              isConnected={isScaleConnected}
              onToggleSound={handleToggleSound}
              onSimulateWeight={placeLoad}
              onAddWeight={addLoad}
              onJiggle={triggerJiggle}
              onZero={handleZero}
              onTare={handleTare}
              isEspLive={isEspLive}
              espDeviceName={espDeviceName}
            />

            <ActionButtons 
              onComplete={handleComplete} 
              isStable={isStable}
              isOverload={isOverload}
              isZero={isZero}
              isWeighing={!isZero && !isStable && !isOverload}
              isConnected={isScaleConnected}
            />

            <RecentWeighingsMini records={recentRecords} />
          </div>

          {/* Right Column: Active Product Card & Operator Session Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <WeighingActiveProductCard 
              selectedProduct={selectedProduct}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
            <BatchMetadata />
          </div>
        </div>

        {/* Modal Struk Transaksi */}
        <ReceiptModal 
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          receiptData={receiptData}
          onNewTransaction={handleNewTransaction}
        />
      </div>
    </div>
  );
}
