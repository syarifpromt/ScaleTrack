import { type ClassValue, clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatWeight(weight: number, unit: string = 'kg'): string {
  return `${weight.toFixed(2)} ${unit}`;
}

export function formatAdaptiveWeight(weightKg: number): { value: string; unit: string; full: string } {
  if (weightKg >= 1.000) {
    const value = weightKg.toFixed(3);
    return {
      value,
      unit: 'kg',
      full: `${value} kg`
    };
  }
  // For < 1.000 kg, display in grams
  const grams = Math.round(weightKg * 1000);
  return {
    value: grams.toString(),
    unit: 'gram',
    full: `${grams} gram`
  };
}

export function formatDateTime(date: string): string {
  try {
    return format(parseISO(date), 'dd MMM yyyy, HH:mm:ss', { locale: id });
  } catch (e) {
    return date;
  }
}

export function formatTime(date: string): string {
  try {
    return format(parseISO(date), 'HH:mm:ss', { locale: id });
  } catch (e) {
    return date;
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'text-tertiary bg-tertiary-container/20';
    case 'warning':
      return 'text-yellow-700 bg-yellow-100';
    case 'rejected':
      return 'text-error bg-error-container';
    default:
      return 'text-secondary bg-surface-container';
  }
}

export function getDeviceStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
      return 'text-tertiary bg-tertiary-container/20';
    case 'offline':
      return 'text-secondary bg-surface-container-high';
    case 'error':
      return 'text-error bg-error-container';
    default:
      return 'text-outline bg-surface-container';
  }
}
