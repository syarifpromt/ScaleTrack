'use client';

import React from 'react';
import { UserCheck, Receipt, CheckCircle, Clock, Monitor, Keyboard, Scale, Hash } from 'lucide-react';
import { useTransactions } from '@/lib/transactions-store';

export function BatchMetadata() {
  const { transactions } = useTransactions();

  // Hitung transaksi hari ini yang ditangani kasir ini
  const todayTransactions = transactions.filter(t => {
    const d = new Date(t.timestamp);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const sessionTxCount = todayTransactions.length;
  const sessionTotalWeight = todayTransactions.reduce((acc, curr) => acc + (curr.weightKg || 0), 0);

  return (
    <div className="card p-5 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header Info Sesi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">Info Sesi Kasir Timbang</h3>
            <p className="text-[11px] text-gray-400">Terminal Pos Penimbangan Eceran</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Kasir Aktif
        </span>
      </div>

      {/* Profil Lengkap Kasir & Identitas Petugas */}
      <div className="p-3.5 bg-gradient-to-r from-gray-50 to-blue-50/40 rounded-xl border border-gray-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
              D
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-gray-900 text-sm">Operator Dummy</span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">DEMO</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              <span>Kasir & Operator Timbang</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 font-sans">
          <span className="text-[10px] text-gray-400 block font-medium">Jam Operasional</span>
          <span className="text-xs font-bold text-gray-700 flex items-center justify-end gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            07:00 - 15:00
          </span>
        </div>
      </div>

      {/* Detail Parameter Sesi: Perangkat, Mode, dan Statistik Real-time */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        {/* Terminal Stasiun */}
        <div className="p-3 bg-gray-50/90 rounded-xl border border-gray-200/70 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Monitor className="w-3.5 h-3.5 text-gray-500" />
            <span>Terminal Pos</span>
          </div>
          <span className="font-bold text-gray-900 text-xs">Pos Kasir 01</span>
          <span className="text-gray-500 text-[11px]">SCALE-001 (Bay A)</span>
        </div>

        {/* Mode Penimbangan */}
        <div className="p-3 bg-gray-50/90 rounded-xl border border-gray-200/70 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Scale className="w-3.5 h-3.5 text-blue-500" />
            <span>Mode Timbang</span>
          </div>
          <span className="font-bold text-blue-700 text-xs">Digital Pintar</span>
          <span className="text-gray-500 text-[11px]">Hitung Otomatis (Rp)</span>
        </div>

        {/* Performa Sesi Ini */}
        <div className="col-span-2 sm:col-span-1 p-3 bg-gray-50/90 rounded-xl border border-gray-200/70 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <Hash className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sesi Hari Ini</span>
          </div>
          <span className="font-bold text-emerald-700 text-xs tabular-nums font-sans">
            {sessionTxCount} Transaksi
          </span>
          <span className="text-gray-500 text-[11px] tabular-nums font-sans">
            Total {sessionTotalWeight.toFixed(2)} kg
          </span>
        </div>
      </div>

      {/* Petunjuk Operasional & Shortcut Kasir Cepat */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-950 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <Receipt className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-blue-900">Cara Kerja Timbangan Eceran:</span>
            <p className="text-blue-800 text-[11px] leading-relaxed mt-0.5">
              1. Pilih barang ➔ 2. Letakkan di timbangan ➔ 3. Layar otomatis menghitung total harga (Berat × Harga/kg) ➔ 4. Tekan tombol <strong>Selesai</strong> untuk struk.
            </p>
          </div>
        </div>

        {/* Shortcut Key Caps */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-blue-200/60 text-[11px]">
          <span className="text-blue-700 font-semibold flex items-center gap-1">
            <Keyboard className="w-3 h-3" /> Tombol Cepat:
          </span>
          <span className="px-1.5 py-0.5 bg-white text-blue-900 font-mono font-bold rounded border border-blue-200 shadow-2xs">
            SPASI / ENTER / F9
          </span>
          <span className="text-blue-600 font-medium">Selesai Transaksi</span>
          <span className="text-blue-300">•</span>
          <span className="px-1.5 py-0.5 bg-white text-blue-900 font-mono font-bold rounded border border-blue-200 shadow-2xs">
            T
          </span>
          <span className="text-blue-600 font-medium">Tare</span>
          <span className="text-blue-300">•</span>
          <span className="px-1.5 py-0.5 bg-white text-blue-900 font-mono font-bold rounded border border-blue-200 shadow-2xs">
            Z
          </span>
          <span className="text-blue-600 font-medium">Zero</span>
        </div>
      </div>
    </div>
  );
}

export default BatchMetadata;
