'use client';

import React, { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';
import { Logo } from './Logo';

export function TopBar() {
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:left-64 shadow-xs">
      {/* Mobile Logo (< lg) */}
      <div className="lg:hidden flex items-center">
        <Logo showStatus={false} />
      </div>

      {/* Desktop Left: Single Device Status */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-800">
            Timbangan Digital (Online)
          </span>
        </div>
        <span className="text-xs text-gray-400">• Kapasitas Maksimal 5 kg</span>
      </div>

      {/* Right: Simple Clock & Operator Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span className="font-mono font-medium" suppressHydrationWarning>
            {mounted && time ? time : '10:00:00 WIB'}
          </span>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-gray-800">Razka</span>
            <span className="text-[11px] text-gray-400">Operator (Shift Pagi)</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
