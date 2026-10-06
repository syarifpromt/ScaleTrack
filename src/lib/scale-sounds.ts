// Shared Web Audio sound effects for the weighing station.
// A single AudioContext is reused (browsers cap the number of contexts and
// block ones created outside a user gesture), and resumed on demand.

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedCtx) sharedCtx = new AudioCtx();
    if (sharedCtx.state === 'suspended') {
      void sharedCtx.resume();
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

/**
 * Call once from a user gesture (click / key press) so later sounds that are
 * triggered automatically (stable / overload) are not blocked by autoplay policy.
 */
export function unlockScaleAudio() {
  getAudioContext();
}

interface ToneStep {
  freq: number;
  start: number; // seconds from now
  duration: number; // seconds
  type?: OscillatorType;
  volume?: number; // peak gain 0..1
}

function playTones(steps: ToneStep[]) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  for (const step of steps) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t0 = now + step.start;
    const t1 = t0 + step.duration;
    const peak = step.volume ?? 0.35;

    osc.type = step.type ?? 'sine';
    osc.frequency.setValueAtTime(step.freq, t0);

    // Short attack / release so there are no clicks
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);
    gain.gain.setValueAtTime(peak, Math.max(t0 + 0.015, t1 - 0.04));
    gain.gain.exponentialRampToValueAtTime(0.0001, t1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t1 + 0.02);
  }
}

/** Weighing finished (weight is stable): pleasant rising "ding-ding" (~0.4s). */
export function playStableSound() {
  playTones([
    { freq: 880, start: 0, duration: 0.14, type: 'sine', volume: 0.4 }, // A5
    { freq: 1318.5, start: 0.16, duration: 0.24, type: 'sine', volume: 0.4 }, // E6
  ]);
}

/** Overload warning: harsh, urgent triple beep (~0.7s). */
export function playOverloadSound() {
  playTones([
    { freq: 440, start: 0, duration: 0.18, type: 'square', volume: 0.22 },
    { freq: 330, start: 0.24, duration: 0.18, type: 'square', volume: 0.22 },
    { freq: 440, start: 0.48, duration: 0.22, type: 'square', volume: 0.22 },
  ]);
}

