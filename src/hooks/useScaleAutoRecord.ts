import { useState, useEffect, useRef, useCallback } from 'react';

// Web Audio API confirmation beep sound generator
export function playBeepSound(frequency = 880, duration = 0.15, type: OscillatorType = 'sine') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Quick ramp up and down for soft pleasant click-free industrial beep
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.debug('Audio not allowed yet or not supported:', err);
  }
}

export interface AutoRecordOptions {
  minWeightTrigger?: number; // Minimum weight to start listening (e.g. 0.050 kg)
  stabilityDurationMs?: number; // How long weight must stay still (e.g. 1500ms)
  stabilityToleranceKg?: number; // Max allowed drift to consider stable (e.g. 0.004 kg)
  enabled?: boolean;
  enableSound?: boolean;
  onRecord?: (weight: number) => void;
}

export function useScaleAutoRecord(
  currentWeight: number,
  options: AutoRecordOptions = {}
) {
  const {
    minWeightTrigger = 0.100,
    stabilityDurationMs = 1500,
    stabilityToleranceKg = 0.004,
    enabled = true,
    enableSound = true,
    onRecord
  } = options;

  const [stabilityProgress, setStabilityProgress] = useState(0); // 0 to 100%
  const [isLocked, setIsLocked] = useState(false); // Locked after recording until item removed
  const [lastRecordedWeight, setLastRecordedWeight] = useState<number | null>(null);
  const [justRecorded, setJustRecorded] = useState(false);

  const stableStartTimeRef = useRef<number | null>(null);
  const referenceWeightRef = useRef<number>(currentWeight);
  const isLockedRef = useRef<boolean>(false);
  isLockedRef.current = isLocked;

  const handleRecord = useCallback((weight: number) => {
    if (enableSound) {
      playBeepSound(1046.5, 0.18); // High clean C6 chime
    }
    setLastRecordedWeight(weight);
    setJustRecorded(true);
    setIsLocked(true);
    setStabilityProgress(100);

    if (onRecord) {
      onRecord(weight);
    }

    setTimeout(() => {
      setJustRecorded(false);
    }, 2500);
  }, [enableSound, onRecord]);

  useEffect(() => {
    if (!enabled) {
      setStabilityProgress(0);
      stableStartTimeRef.current = null;
      return;
    }

    // Check if scale has been unloaded / returned to zero to re-arm
    if (isLockedRef.current) {
      if (currentWeight < minWeightTrigger * 0.5) {
        setIsLocked(false);
        setStabilityProgress(0);
        stableStartTimeRef.current = null;
      }
      return;
    }

    // If weight is below minimum threshold, idle
    if (currentWeight < minWeightTrigger) {
      setStabilityProgress(0);
      stableStartTimeRef.current = null;
      referenceWeightRef.current = currentWeight;
      return;
    }

    // Check stability against reference weight
    const diff = Math.abs(currentWeight - referenceWeightRef.current);

    if (diff > stabilityToleranceKg) {
      // Weight moved / changed - reset timer and set new reference
      referenceWeightRef.current = currentWeight;
      stableStartTimeRef.current = Date.now();
      setStabilityProgress(5);
    } else {
      // Weight is stable within tolerance
      if (!stableStartTimeRef.current) {
        stableStartTimeRef.current = Date.now();
      }

      const elapsed = Date.now() - stableStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / stabilityDurationMs) * 100));
      setStabilityProgress(progress);

      if (elapsed >= stabilityDurationMs && !isLockedRef.current) {
        handleRecord(currentWeight);
      }
    }
  }, [currentWeight, enabled, minWeightTrigger, stabilityDurationMs, stabilityToleranceKg, handleRecord]);

  return {
    stabilityProgress,
    isLocked,
    justRecorded,
    lastRecordedWeight,
    resetLock: () => {
      setIsLocked(false);
      setStabilityProgress(0);
      stableStartTimeRef.current = null;
    }
  };
}
