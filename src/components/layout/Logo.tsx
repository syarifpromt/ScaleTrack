'use client';

import React from 'react';
import { Scale } from 'lucide-react';

interface LogoProps {
  width?: number;
  height?: number;
  showStatus?: boolean;
  compact?: boolean;
}

export function Logo({ showStatus = false, compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Sleek Minimalist Scale Icon */}
      <div className="relative w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/20 shrink-0">
        <Scale className="w-5 h-5 text-white stroke-[2.2]" />
        {showStatus && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      {/* Clean Brand Lockup */}
      {!compact && (
        <div className="flex flex-col justify-center">
          <div className="text-[17px] font-extrabold tracking-tight leading-tight text-gray-900 flex items-center">
            <span>Scale</span>
            <span className="text-blue-600 ml-0.5">Track</span>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-gray-400 leading-none mt-0.5">
            by Kelompok 23
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
