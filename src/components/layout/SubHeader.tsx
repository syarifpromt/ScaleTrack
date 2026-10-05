'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Activity } from 'lucide-react';

export function SubHeader() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }) + ' WIB');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 lg:left-64 z-0 flex h-10 items-center justify-between border-b border-gray-200 bg-gray-50/80 px-6 backdrop-blur-sm font-mono text-[11px] text-gray-600">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded bg-gray-200/50 px-2 py-0.5">
          <Activity className="h-3 w-3 text-blue-500" />
          <span>TIMBANGAN DIGITAL BEBAS</span>
        </div>
        <div className="h-3 w-px bg-gray-300"></div>
        <div className="flex items-center gap-1.5 rounded bg-gray-200/50 px-2 py-0.5">
          <span>KAPASITAS: MAKS 5.0 KG</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
          </span>
          <span className="text-emerald-700 font-semibold">Terkoneksi</span>
        </div>
        <div className="h-3 w-px bg-gray-300"></div>
        <div className="flex items-center gap-1.5">
          <Wifi className="h-3 w-3 text-blue-600" />
          <span>Sinyal Kuat</span>
        </div>
        <div className="h-3 w-px bg-gray-300"></div>
        <div className="w-20 text-right font-medium" suppressHydrationWarning>
          {time || '10:42:18 WIB'}
        </div>
      </div>
    </div>
  );
}

export default SubHeader;
