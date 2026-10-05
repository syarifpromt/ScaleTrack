'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SyncBannerProps {
  show: boolean;
  onDismiss: () => void;
  id: number;
}

export function SyncBanner({ show, onDismiss, id }: SyncBannerProps) {
  if (!show) return null;

  return (
    <div className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-3 rounded-lg border border-tertiary-fixed-dim flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-tertiary" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-semibold text-sm">SYNC LOG | Penimbangan #{id} berhasil disimpan ke Supabase PostgreSQL!</span>
          <span className="text-xs font-mono opacity-80 hidden sm:inline border-l border-on-tertiary-fixed/20 pl-2">24ms • 11:42:09 WIB</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold bg-tertiary-fixed-dim/50 px-2 py-1 rounded hidden sm:inline-block">AUTO-COMMIT ON</span>
        <button onClick={onDismiss} className="hover:bg-tertiary-fixed-dim p-1 rounded-full transition-colors" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default SyncBanner;
