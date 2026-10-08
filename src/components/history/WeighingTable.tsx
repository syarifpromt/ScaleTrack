'use client';

import React, { useState } from 'react';
import { Receipt, ChevronLeft, ChevronRight, Inbox, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TimePeriod } from '@/app/history/page';
import { useTransactions, clearAllTransactions } from '@/lib/transactions-store';
import { filterTransactionsByPeriod } from '@/lib/transactions-analytics';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface WeighingTableProps {
  period?: TimePeriod;
  searchQuery?: string;
  categoryFilter?: string;
}

export const WeighingTable = ({
  period = 'today',
  searchQuery = '',
  categoryFilter = 'Semua Kategori',
}: WeighingTableProps) => {
  const { transactions, loading } = useTransactions();
  const [page, setPage] = useState(1);
  const [isClearing, setIsClearing] = useState(false);
  const pageSize = 10;

  // 1. Filter by period
  const periodFiltered = filterTransactionsByPeriod(transactions, period);

  // 2. Filter by search query & category
  const filtered = periodFiltered.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.id.toLowerCase().includes(q) ||
      item.productName.toLowerCase().includes(q) ||
      item.operator.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchCategory =
      categoryFilter === 'Semua Kategori' || item.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleClear = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat transaksi? Data yang dihapus tidak dapat dikembalikan.')) {
      setIsClearing(true);
      await clearAllTransactions();
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar if transactions exist */}
      {transactions.length > 0 && (
        <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-xs">
          <div className="text-gray-500">
            Ditemukan <strong className="text-gray-900 font-bold">{totalCount}</strong> riwayat penimbangan
          </div>
          <button
            onClick={handleClear}
            disabled={isClearing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 transition font-bold cursor-pointer disabled:opacity-50"
            title="Hapus semua riwayat penimbangan"
          >
            <Trash2 size={13} />
            <span>{isClearing ? 'Menghapus...' : 'Kosongkan Semua Riwayat'}</span>
          </button>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
              <th className="px-5 py-4 w-14 text-center">No</th>
              <th className="px-6 py-4">Waktu & Tanggal</th>
              <th className="px-6 py-4">ID Transaksi</th>
              <th className="px-6 py-4 min-w-[200px]">Nama Barang / Produk</th>
              <th className="px-6 py-4 text-right">Total Berat</th>
              <th className="px-6 py-4 text-right">Harga / kg</th>
              <th className="px-6 py-4 text-right">Total Harga</th>
              <th className="px-6 py-4 min-w-[160px]">Operator / Kasir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 shadow-2xs">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Belum Ada Riwayat Transaksi</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {transactions.length === 0
                          ? 'Riwayat transaksi masih kosong. Lakukan penimbangan di Stasiun Timbang untuk mulai mencatat transaksi.'
                          : 'Tidak ada transaksi yang cocok dengan filter atau pencarian saat ini.'}
                      </p>
                    </div>
                    {transactions.length === 0 && (
                      <Link
                        href="/weighing"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs mt-2"
                      >
                        <span>Buka Stasiun Timbang</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  {/* No */}
                  <td className="px-5 py-4 text-center font-bold text-gray-400">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>

                  {/* Waktu */}
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap font-medium">
                    {row.time}
                  </td>

                  {/* ID Transaksi */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100/90 text-xs">
                      <Receipt className="w-3.5 h-3.5 text-blue-500" />
                      #{row.id}
                    </span>
                  </td>

                  {/* Nama Produk & Kategori */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm leading-tight">
                      {row.productName}
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {row.category}
                      </span>
                    </div>
                  </td>

                  {/* Total Berat */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-sm font-extrabold text-blue-700 tabular-nums font-sans">
                      {row.weightKg.toFixed(3)}
                    </span>
                    <span className="text-xs font-semibold text-blue-500 ml-1">kg</span>
                  </td>

                  {/* Harga / kg */}
                  <td className="px-6 py-4 text-right text-gray-600 whitespace-nowrap tabular-nums font-semibold text-xs font-sans">
                    {formatRupiah(row.pricePerKg)}
                  </td>

                  {/* Total Harga */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-sm font-black text-emerald-700 tabular-nums font-sans">
                      {formatRupiah(row.totalPrice)}
                    </span>
                  </td>

                  {/* Operator */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200">
                        {row.operator ? row.operator.charAt(0) : 'O'}
                      </div>
                      <span className="text-gray-800 font-semibold text-xs">{row.operator}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {paginatedRows.length > 0 && (
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold text-xs">
                <td className="px-6 py-4 text-center" colSpan={4}>
                  TOTAL RINGKASAN ({paginatedRows.length} Baris Ditampilkan)
                </td>
                <td className="px-6 py-4 text-right text-blue-300 font-extrabold text-sm tabular-nums font-sans">
                  {paginatedRows.reduce((acc, curr) => acc + curr.weightKg, 0).toFixed(3)} kg
                </td>
                <td className="px-6 py-4 text-right text-slate-400">-</td>
                <td className="px-6 py-4 text-right text-emerald-400 text-sm font-black tabular-nums font-sans">
                  {formatRupiah(paginatedRows.reduce((acc, curr) => acc + curr.totalPrice, 0))}
                </td>
                <td className="px-6 py-4 text-slate-300">-</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Integrated Footer Bar: Pagination & Status */}
      {totalCount > 0 && (
        <div className="p-4 sm:p-5 px-6 border-t border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Menampilkan <strong className="text-gray-900">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}</strong> dari{' '}
              <strong className="text-gray-900">{totalCount.toLocaleString('id-ID')}</strong> transaksi penimbangan
            </span>
          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 px-2 rounded-lg border border-gray-200 hover:bg-white text-gray-500 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1 font-sans text-xs">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer font-semibold ${
                        currentPage === pNum
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'hover:bg-white text-gray-700'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 px-2 rounded-lg border border-gray-200 hover:bg-white text-gray-500 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeighingTable;
