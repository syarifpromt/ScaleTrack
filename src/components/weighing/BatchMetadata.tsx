'use client';

import React from 'react';
import { UserCheck, Receipt, CheckCircle } from 'lucide-react';

export function BatchMetadata() {
  return (
    <div className="card p-5 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-base">Info Sesi Kasir Timbang</h3>
        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Kasir Aktif
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
          <span className="text-gray-500 font-medium">Operator / Kasir</span>
          <span className="font-bold text-gray-900 text-sm">Budi Santoso</span>
          <span className="text-gray-400 text-[11px]">Shift 1 (Pagi)</span>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
          <span className="text-gray-500 font-medium">Mode Penimbangan</span>
          <span className="font-bold text-blue-700 text-sm">Timbangan Digital</span>
          <span className="text-gray-400 text-[11px]">Hitung Otomatis</span>
        </div>
      </div>

      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
        <Receipt className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Cara Kerja Timbangan Eceran:</span>
          <span className="text-blue-800 text-[11px] leading-relaxed">
            Pilih barang ➔ Taruh barang di timbangan ➔ Layar otomatis menghitung total harga (Berat × Harga/kg) ➔ Tekan <strong>[SPASI]</strong> untuk simpan transaksi.
          </span>
        </div>
      </div>
    </div>
  );
}

export default BatchMetadata;
