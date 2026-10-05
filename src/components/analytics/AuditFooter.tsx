import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function AuditFooter() {
  return (
    <div className="mt-8 bg-surface border-t border-outline-variant/40 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-tertiary" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-on-surface">Integritas Log Penimbangan ESP32</h4>
          <p className="text-xs text-on-surface-variant">1,480 catatan tersinkronisasi sempurna ke database cloud via buffer FIFO lokal.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs font-medium text-on-surface-variant">LAST AUDIT: 14:02:18 WIB</span>
        <button className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors">
          Audit Log Lengkap
        </button>
      </div>
    </div>
  );
}

export default AuditFooter;
