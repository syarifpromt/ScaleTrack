'use client';

import React from 'react';
import { Printer, Scale, AlertTriangle } from 'lucide-react';

interface ActionButtonsProps {
  onComplete: () => void;
  isStable?: boolean;
  isOverload?: boolean;
  isZero?: boolean;
  isWeighing?: boolean;
  isConnected?: boolean;
}

export function ActionButtons({
  onComplete,
  isStable = false,
  isOverload = false,
  isZero = true,
  isWeighing = false,
  isConnected = true,
}: ActionButtonsProps) {
  // Tombol Selesai aktif jika timbangan sudah terhubung, stabil, ada barang (>0), dan tidak overload
  const isReadyToComplete = isConnected && isStable && !isZero && !isOverload;

  return (
    <div className="w-full">
      {!isConnected ? (
        <button
          type="button"
          disabled
          className="w-full p-4 flex items-center justify-center gap-2.5 bg-rose-50 border border-rose-200 rounded-2xl font-bold text-sm text-rose-700 opacity-90 cursor-not-allowed"
        >
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span>Timbangan Terputus — Hubungkan di Pengaturan atau Header</span>
        </button>
      ) : isOverload ? (
        <button
          type="button"
          disabled
          className="w-full p-4 flex items-center justify-center gap-2.5 bg-rose-50 border border-rose-200 rounded-2xl font-bold text-sm text-rose-600 opacity-80 cursor-not-allowed"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Beban Melebihi Batas (&gt; 5 kg) — Kurangi Beban</span>
        </button>
      ) : isReadyToComplete ? (
        <button
          onClick={onComplete}
          type="button"
          title="Klik atau tekan [SPACE] untuk menyelesaikan transaksi dan mencetak struk"
          className="w-full p-4 flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer ring-4 ring-emerald-400/60 animate-pulse"
        >
          <Printer className="w-5 h-5 text-white shrink-0" />
          <span>Selesai & Cetak Struk</span>
        </button>
      ) : isWeighing ? (
        <button
          type="button"
          disabled
          className="w-full p-4 flex items-center justify-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl font-bold text-sm text-amber-700 opacity-90 cursor-wait"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <span>Menunggu Timbangan Selesai...</span>
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="w-full p-4 flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 rounded-2xl font-semibold text-sm text-gray-400 cursor-not-allowed"
        >
          <Scale className="w-4 h-4 text-gray-400" />
          <span>Letakkan Barang untuk Mulai Menimbang</span>
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
