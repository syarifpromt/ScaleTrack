import React from 'react';
import { RefreshCw, Server } from 'lucide-react';

export const SyncStatusBar = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs text-gray-500">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-gray-800">Sinkronisasi Realtime Aktif</span>
      </div>
      
      <div className="flex items-center gap-1.5 text-gray-400">
        <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
        <span>Terakhir diperbarui otomatis</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px]">
        <Server size={12} className="text-blue-500" />
        <span>IoT Digital Scale: ONLINE (Sensor Stabil)</span>
      </div>
    </div>
  );
};

export default SyncStatusBar;
