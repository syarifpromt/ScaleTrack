import { useState, useEffect, useRef, useCallback } from 'react';
import { playStableSound, playOverloadSound } from '@/lib/scale-sounds';

// Interval between repeated overload alarms (ms) while the scale stays overloaded
const OVERLOAD_ALARM_INTERVAL_MS = 1500;

export interface ScaleEngineConfig {
  maxCapacityKg?: number;       // default: 5.000 kg
  minWeightTriggerKg?: number;  // default: 0.020 kg (di bawah ini dianggap timbangan kosong)
  stabilityToleranceKg?: number;// default: 0.001 kg (1 gram / 10mg scale threshold)
  stabilityDurationMs?: number; // default: 1200 ms
  soundEnabled?: boolean;
}

export function useScaleEngine(
  rawSensorWeight: number,
  config: ScaleEngineConfig = {}
) {
  const {
    maxCapacityKg = 5.000,
    minWeightTriggerKg = 0.020,
    stabilityToleranceKg = 0.001,
    stabilityDurationMs = 1200,
    soundEnabled = true,
  } = config;

  // Zero & Tare states
  const [zeroOffset, setZeroOffset] = useState<number>(0);
  const [tareWeight, setTareWeight] = useState<number>(0);

  // Gross & Net Calculations
  const grossWeight = Number((rawSensorWeight - zeroOffset).toFixed(3));
  const netWeight = Number((grossWeight - tareWeight).toFixed(3));

  // Overload & Zero statuses
  const isOverload = grossWeight > maxCapacityKg;
  const isNegative = netWeight < -0.005;
  const isZero = Math.abs(netWeight) < 0.002;

  // Stability Detection states
  const [isStable, setIsStable] = useState<boolean>(false);
  const [stabilityProgress, setStabilityProgress] = useState<number>(0);
  const [lockedStableWeight, setLockedStableWeight] = useState<number | null>(null);

  const stableStartTimeRef = useRef<number | null>(null);
  const referenceWeightRef = useRef<number>(netWeight);
  const wasStableRef = useRef<boolean>(false);

  // Stability detector loop with timer
  useEffect(() => {
    // 1. If Overload, zero, or negative -> Not stable
    if (isOverload || isNegative || netWeight < minWeightTriggerKg) {
      setIsStable(false);
      setStabilityProgress(0);
      setLockedStableWeight(null);
      wasStableRef.current = false;
      referenceWeightRef.current = netWeight;
      return;
    }

    // 2. Check if current net weight deviates from reference weight
    const deviation = Math.abs(netWeight - referenceWeightRef.current);

    if (deviation > stabilityToleranceKg) {
      // Weight is moving / unstable: reset timer
      referenceWeightRef.current = netWeight;
      setIsStable(false);
      wasStableRef.current = false;
      setLockedStableWeight(null);
      setStabilityProgress(20);
    }

    // 3. Schedule stable resolution after stabilityDurationMs of constancy
    const timer = setTimeout(() => {
      setIsStable(true);
      setStabilityProgress(100);
      setLockedStableWeight(netWeight);
      if (!wasStableRef.current) {
        wasStableRef.current = true;
        if (soundEnabled) {
          playStableSound();
        }
      }
    }, stabilityDurationMs);

    return () => clearTimeout(timer);
  }, [netWeight, isOverload, isNegative, minWeightTriggerKg, stabilityToleranceKg, stabilityDurationMs, soundEnabled]);

  // Overload alarm: sound immediately, then repeat while still overloaded.
  // Stops automatically when the load is removed or sound is muted.
  useEffect(() => {
    if (!isOverload || !soundEnabled) return;

    playOverloadSound();
    const interval = setInterval(playOverloadSound, OVERLOAD_ALARM_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isOverload, soundEnabled]);


  // Actions: Tare, Zero, Clear Tare
  const handleTare = useCallback(() => {
    if (grossWeight > 0.005) {
      setTareWeight(grossWeight);
      setIsStable(false);
      setStabilityProgress(0);
    }
  }, [grossWeight]);

  const handleZero = useCallback(() => {
    setZeroOffset(rawSensorWeight);
    setTareWeight(0);
    setIsStable(false);
    setStabilityProgress(0);
  }, [rawSensorWeight]);

  const handleClearTare = useCallback(() => {
    setTareWeight(0);
  }, []);

  return {
    grossWeight,
    tareWeight,
    netWeight: isStable && lockedStableWeight !== null ? lockedStableWeight : netWeight,
    rawNetWeight: netWeight,
    isStable,
    stabilityProgress,
    isOverload,
    isNegative,
    isZero,
    handleTare,
    handleZero,
    handleClearTare,
    maxCapacityKg
  };
}
