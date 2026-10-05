import { useState, useEffect, useRef, useCallback } from 'react';

// Web Audio API confirmation beep sound
export function playChimeBeep(frequency = 987.77, duration = 0.12) { // B5 chime
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.debug('Audio error or blocked by autoplay policy:', err);
  }
}

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

  // Stability detector loop
  useEffect(() => {
    // 1. If Overload, zero, or negative -> Not stable
    if (isOverload || isNegative || netWeight < minWeightTriggerKg) {
      setIsStable(false);
      setStabilityProgress(0);
      setLockedStableWeight(null);
      stableStartTimeRef.current = null;
      wasStableRef.current = false;
      referenceWeightRef.current = netWeight;
      return;
    }

    // 2. Check if current net weight deviates from reference weight
    const deviation = Math.abs(netWeight - referenceWeightRef.current);

    if (deviation > stabilityToleranceKg) {
      // Weight is moving / unstable: reset timer
      referenceWeightRef.current = netWeight;
      stableStartTimeRef.current = Date.now();
      setIsStable(false);
      wasStableRef.current = false;
      setLockedStableWeight(null);
      setStabilityProgress(10);
    } else {
      // Weight stays within tolerance band
      if (!stableStartTimeRef.current) {
        stableStartTimeRef.current = Date.now();
      }

      const elapsed = Date.now() - stableStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / stabilityDurationMs) * 100));
      setStabilityProgress(progress);

      if (elapsed >= stabilityDurationMs) {
        if (!wasStableRef.current) {
          wasStableRef.current = true;
          setIsStable(true);
          setLockedStableWeight(referenceWeightRef.current);
          if (soundEnabled) {
            playChimeBeep();
          }
        }
      }
    }
  }, [netWeight, isOverload, isNegative, minWeightTriggerKg, stabilityToleranceKg, stabilityDurationMs, soundEnabled]);

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
