'use client';

import React from 'react';
import { Printer, CheckCircle2, X, RotateCcw } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { cn, formatAdaptiveWeight } from '@/lib/utils';
import { usePrinterConnection } from '@/lib/device-store';

export interface ReceiptData {
  id: string;
  time: string;
  productName: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  operator: string;
  deviceName: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  onNewTransaction?: () => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, ' ');
}

export function ReceiptModal({
  isOpen,
  onClose,
  receiptData,
  onNewTransaction,
}: ReceiptModalProps) {
  const { isPrinterConnected, activePrinter } = usePrinterConnection();

  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    if (!isPrinterConnected) return;
    window.print();
  };

  const handleNext = () => {
    onClose();
    if (onNewTransaction) {
      onNewTransaction();
    }
  };

  const adaptiveWeight = formatAdaptiveWeight(receiptData.weightKg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-bold text-gray-900 text-sm">Transaksi Selesai</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-lg transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Receipt Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Printable Receipt Card */}
          <div id="printable-receipt" className="bg-[#fafbfd] border-2 border-dashed border-gray-300 rounded-2xl p-5 space-y-4 text-gray-800 shadow-2xs">
            {/* Receipt Header */}
            <div className="text-center pb-3 border-b border-dashed border-gray-300 space-y-1.5">
              <div className="flex justify-center py-1">
                <Logo showStatus={false} />
              </div>
              <p className="text-[11px] font-medium text-gray-500">Stasiun Penimbangan Digital Pintar</p>
              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1 font-sans tabular-nums">
                <span>No: <strong className="text-gray-700">{receiptData.id}</strong></span>
                <span>{receiptData.time}</span>
              </div>
            </div>

            {/* Operator & Scale Info */}
            <div className="grid grid-cols-2 text-xs py-1 text-gray-600 border-b border-dashed border-gray-200 font-sans">
              <div>
                <span className="text-[11px] text-gray-400 block">Operator:</span>
                <span className="font-bold text-gray-800">{receiptData.operator}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-400 block">Stasiun:</span>
                <span className="font-semibold text-gray-700">{receiptData.deviceName}</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-2 py-1 border-b border-dashed border-gray-300">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-black text-base text-gray-900 leading-tight">
                    {receiptData.productName}
                  </h5>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {receiptData.category}
                  </span>
                </div>
              </div>

              {/* Rincian Berat & Tarif per kg */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 space-y-1.5 font-sans">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Berat Bersih (Netto):</span>
                  <span className="font-bold text-gray-900 tabular-nums text-sm">
                    {adaptiveWeight.full}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Harga per kg:</span>
                  <span className="font-bold text-gray-700 tabular-nums">
                    {formatRupiah(receiptData.pricePerKg)} / kg
                  </span>
                </div>
              </div>
            </div>

            {/* Total Pembayaran */}
            <div className="pt-1 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-extrabold text-sm uppercase tracking-wider text-gray-600">Total Bayar:</span>
                <span className="text-2xl font-black text-emerald-700 font-sans tabular-nums">
                  {formatRupiah(receiptData.totalPrice)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terverifikasi Stabil & Akurat</span>
              </div>
            </div>

            {/* Receipt Footer Note */}
            <div className="text-center pt-3 border-t border-dashed border-gray-300 text-[10px] text-gray-400 leading-relaxed font-sans">
              <p>Terima kasih atas transaksi Anda.</p>
              <p>Barang telah ditimbang dengan sensor digital terkalibrasi.</p>
              <p className="font-mono mt-1 tracking-widest text-[9px] text-gray-300">*** SCALETRACK SYSTEM ***</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2.5 shrink-0">
          {!isPrinterConnected && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>Printer terputus. Hubungkan di Pengaturan atau klik tombol Header jika ingin mencetak struk fisik.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Tombol Cetak Struk */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={!isPrinterConnected}
              className={cn(
                "w-full sm:flex-1 py-3 px-4 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-sm",
                isPrinterConnected
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98"
                  : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-80"
              )}
              title={isPrinterConnected ? "Cetak Struk Transaksi" : "Printer sedang terputus"}
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinterConnected ? 'Cetak Struk' : 'Printer Terputus'}</span>
            </button>

            {/* Tombol Transaksi Baru / Selesai */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:flex-1 py-3 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-gray-400" />
              <span>Selesai & Transaksi Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;

