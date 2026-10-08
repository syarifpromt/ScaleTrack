'use client';

import React from 'react';
import Link from 'next/link';
import { Filter, Eye, Scale, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { useTransactions } from '@/lib/transactions-store';

export function RecentWeighingsTable() {
  const { transactions } = useTransactions();
  const recentWeighings = transactions.slice(0, 5);

  return (
    <div className="card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-heading font-bold text-gray-900">5 Penimbangan Terakhir</h2>
          <p className="text-xs text-gray-500 mt-1">Data riwayat transaksi penimbangan kasir real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/history" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            Buka Riwayat Lengkap &rarr;
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-3 font-medium">Waktu</th>
              <th className="px-6 py-3 font-medium">ID Transaksi / Produk</th>
              <th className="px-6 py-3 font-medium text-right">Berat (kg)</th>
              <th className="px-6 py-3 font-medium text-right">Total Harga</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Operator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentWeighings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <Scale className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">Belum Ada Riwayat Penimbangan</p>
                    <p className="text-xs text-gray-400">
                      Lakukan penimbangan barang di stasiun timbang untuk mencatat data transaksi kasir secara live.
                    </p>
                    <Link
                      href="/weighing"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-2xs mt-1"
                    >
                      <span>Mulai Menimbang</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              recentWeighings.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-sans">
                    {tx.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-bold text-blue-600 font-sans">#{tx.id}</div>
                    <div className="text-sm font-bold text-gray-900 truncate max-w-[170px]">{tx.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans font-black text-gray-900 text-right tabular-nums">
                    {tx.weightKg.toFixed(3)} <span className="text-xs font-medium text-gray-400">kg</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans font-bold text-emerald-700 text-right tabular-nums">
                    Rp {tx.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={tx.status === 'rejected' ? 'offline' : 'stable'} 
                      text={tx.status === 'rejected' ? 'Ditolak' : 'Selesai'} 
                      size="compact" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold text-gray-600">
                    {tx.operator}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentWeighingsTable;
