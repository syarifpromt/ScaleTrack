'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScaleDisplay } from '@/components/weighing/ScaleDisplay';
import { ProductSelector, Product } from '@/components/weighing/ProductSelector';
import { BatchMetadata } from '@/components/weighing/BatchMetadata';
import { ActionButtons } from '@/components/weighing/ActionButtons';
import { RecentWeighingsMini } from '@/components/weighing/RecentWeighingsMini';
import { SyncBanner } from '@/components/weighing/SyncBanner';
import { useScaleEngine } from '@/hooks/useScaleEngine';

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

  // Selected Active Product for free-weight pricing
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialSelectedProduct);

  // Simulation state: Base load placed on scale (kg)
  const [baseLoad, setBaseLoad] = useState<number>(0.250); // Contoh awal: 250 gram
  const [simulatedJitter, setSimulatedJitter] = useState<number>(0);
  const [isJiggling, setIsJiggling] = useState<boolean>(false);

  // Background sensor jitter generator (±0.0005 kg subtle sensor noise)
  useEffect(() => {
    const interval = setInterval(() => {
      if (baseLoad <= 0.005) {
        setSimulatedJitter(0);
        return;
      }
      if (isJiggling) {
        // High vibration / moving load
        const heavyJitter = (Math.random() - 0.5) * 0.040;
        setSimulatedJitter(heavyJitter);
      } else {
        // Subtle natural sensor noise
        const tinyJitter = (Math.random() - 0.5) * 0.0008;
        setSimulatedJitter(tinyJitter);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [baseLoad, isJiggling]);

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
    stabilityDurationMs: 1200,   // 1.2 detik konstan
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
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              onSimulateWeight={(weight) => setBaseLoad(weight)}
              onAddWeight={(amount) => setBaseLoad(prev => Math.max(0, Number((prev + amount).toFixed(3))))}
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
