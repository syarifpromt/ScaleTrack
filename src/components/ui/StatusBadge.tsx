import React from 'react';
import { clsx } from 'clsx';

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'info' | 'stable';
  text: string;
  size?: 'compact' | 'normal';
  className?: string;
}

export function StatusBadge({ status, text, size = 'normal', className }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'online':
      case 'stable':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          dot: 'bg-green-500',
          pulse: 'bg-green-500/50',
        };
      case 'offline':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          dot: 'bg-red-500',
          pulse: 'bg-red-500/50',
        };
      case 'warning':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          dot: 'bg-amber-500',
          pulse: 'bg-amber-500/50',
        };
      case 'info':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          dot: 'bg-blue-500',
          pulse: 'bg-blue-500/50',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          dot: 'bg-gray-500',
          pulse: 'bg-gray-500/50',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        styles.bg,
        styles.text,
        size === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <span className="relative flex h-2 w-2 mr-2">
        <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', styles.pulse)}></span>
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', styles.dot)}></span>
      </span>
      {text}
    </div>
  );
}

export default StatusBadge;
