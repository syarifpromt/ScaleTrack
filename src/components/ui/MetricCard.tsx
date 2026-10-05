import React from 'react';
import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  progress?: number;
  progressColor?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  subtitle,
  progress,
  progressColor = 'bg-[var(--color-primary)]',
}: MetricCardProps) {
  return (
    <div className="card p-5 flex flex-col h-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
          {title}
        </h3>
        <div className="text-[var(--color-primary)]">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mt-auto">
        <span className="font-mono font-bold text-4xl text-[var(--color-on-surface)]">
          {value}
        </span>
        <span className="text-sm font-medium text-[var(--color-secondary)]">
          {unit}
        </span>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {trend && (
            <span
              className={clsx(
                'flex items-center font-medium',
                trend.positive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.positive ? (
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-[var(--color-secondary)] text-xs">
              {subtitle}
            </span>
          )}
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-4 w-full h-1.5 bg-[var(--color-surface-container-high)] rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-500', progressColor)}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default MetricCard;
