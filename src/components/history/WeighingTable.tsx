'use client';

import React from 'react';
import { Receipt, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { TimePeriod } from '@/app/history/page';

interface TransactionRow {
  id: string;
  time: string;
  productName: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  operator: string;
}

const transactionsByPeriod: Record<TimePeriod, {
  totalCount: number;
  rows: TransactionRow[];
}> = {
  today: {
    totalCount: 142,
    rows: [
      { id: 'WT-9801', time: '05 Okt 2026, 08:32 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 1.250, pricePerKg: 16500, totalPrice: 20625, operator: 'Razka' },
      { id: 'WT-9800', time: '05 Okt 2026, 08:29 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 2.500, pricePerKg: 16500, totalPrice: 41250, operator: 'Tama' },
      { id: 'WT-9799', time: '05 Okt 2026, 08:15 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 0.750, pricePerKg: 135000, totalPrice: 101250, operator: 'Haikal' },
      { id: 'WT-9798', time: '05 Okt 2026, 07:55 WIB', productName: 'Telur Ayam Ras', category: 'Pangan', weightKg: 1.500, pricePerKg: 29000, totalPrice: 43500, operator: 'Razka' },
      { id: 'WT-9797', time: '05 Okt 2026, 07:42 WIB', productName: 'Gula Pasir Kristal', category: 'Sembako', weightKg: 3.000, pricePerKg: 17500, totalPrice: 52500, operator: 'Tama' },
      { id: 'WT-9796', time: '05 Okt 2026, 07:30 WIB', productName: 'Tepung Terigu Segitiga', category: 'Bahan Pokok', weightKg: 2.000, pricePerKg: 14000, totalPrice: 28000, operator: 'Haikal' },
      { id: 'WT-9795', time: '05 Okt 2026, 07:18 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 1.200, pricePerKg: 135000, totalPrice: 162000, operator: 'Razka' },
      { id: 'WT-9794', time: '05 Okt 2026, 07:05 WIB', productName: 'Bawang Merah Brebes', category: 'Bumbu & Rempah', weightKg: 0.500, pricePerKg: 38000, totalPrice: 19000, operator: 'Tama' },
      { id: 'WT-9793', time: '05 Okt 2026, 06:52 WIB', productName: 'Kentang Dieng Super', category: 'Buah & Sayur', weightKg: 1.800, pricePerKg: 22000, totalPrice: 39600, operator: 'Haikal' },
      { id: 'WT-9792', time: '05 Okt 2026, 06:40 WIB', productName: 'Minyak Goreng Curah', category: 'Sembako', weightKg: 2.000, pricePerKg: 16000, totalPrice: 32000, operator: 'Razka' },
    ],
  },
  week: {
    totalCount: 1048,
    rows: [
      { id: 'WT-9801', time: '05 Okt 2026, 08:32 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 1.250, pricePerKg: 16500, totalPrice: 20625, operator: 'Razka' },
      { id: 'WT-9650', time: '04 Okt 2026, 17:15 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 4.500, pricePerKg: 135000, totalPrice: 607500, operator: 'Tama' },
      { id: 'WT-9482', time: '03 Okt 2026, 14:20 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 5.000, pricePerKg: 16500, totalPrice: 82500, operator: 'Haikal' },
      { id: 'WT-9310', time: '02 Okt 2026, 11:45 WIB', productName: 'Telur Ayam Ras', category: 'Pangan', weightKg: 3.200, pricePerKg: 29000, totalPrice: 92800, operator: 'Razka' },
      { id: 'WT-9120', time: '01 Okt 2026, 16:30 WIB', productName: 'Minyak Goreng Curah', category: 'Sembako', weightKg: 2.500, pricePerKg: 16000, totalPrice: 40000, operator: 'Tama' },
      { id: 'WT-8940', time: '30 Sep 2026, 10:15 WIB', productName: 'Bawang Merah Brebes', category: 'Bumbu & Rempah', weightKg: 1.800, pricePerKg: 38000, totalPrice: 68400, operator: 'Haikal' },
      { id: 'WT-8760', time: '29 Sep 2026, 15:50 WIB', productName: 'Gula Pasir Kristal', category: 'Sembako', weightKg: 4.000, pricePerKg: 17500, totalPrice: 70000, operator: 'Razka' },
      { id: 'WT-8590', time: '29 Sep 2026, 09:25 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 2.100, pricePerKg: 135000, totalPrice: 283500, operator: 'Tama' },
      { id: 'WT-8410', time: '28 Sep 2026, 13:10 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 3.500, pricePerKg: 16500, totalPrice: 57750, operator: 'Haikal' },
      { id: 'WT-8230', time: '28 Sep 2026, 08:40 WIB', productName: 'Kentang Dieng Super', category: 'Buah & Sayur', weightKg: 2.200, pricePerKg: 22000, totalPrice: 48400, operator: 'Razka' },
    ],
  },
  month: {
    totalCount: 4620,
    rows: [
      { id: 'WT-9801', time: '05 Okt 2026, 08:32 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 1.250, pricePerKg: 16500, totalPrice: 20625, operator: 'Razka' },
      { id: 'WT-9200', time: '01 Okt 2026, 11:20 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 5.000, pricePerKg: 135000, totalPrice: 675000, operator: 'Tama' },
      { id: 'WT-8600', time: '25 Sep 2026, 14:40 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 4.800, pricePerKg: 16500, totalPrice: 79200, operator: 'Haikal' },
      { id: 'WT-8000', time: '20 Sep 2026, 09:15 WIB', productName: 'Telur Ayam Ras', category: 'Pangan', weightKg: 3.500, pricePerKg: 29000, totalPrice: 101500, operator: 'Razka' },
      { id: 'WT-7400', time: '15 Sep 2026, 16:50 WIB', productName: 'Minyak Goreng Curah', category: 'Sembako', weightKg: 4.000, pricePerKg: 16000, totalPrice: 64000, operator: 'Tama' },
      { id: 'WT-6800', time: '10 Sep 2026, 13:30 WIB', productName: 'Gula Pasir Kristal', category: 'Sembako', weightKg: 3.800, pricePerKg: 17500, totalPrice: 66500, operator: 'Haikal' },
      { id: 'WT-6200', time: '08 Sep 2026, 10:10 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 3.200, pricePerKg: 135000, totalPrice: 432000, operator: 'Razka' },
      { id: 'WT-5600', time: '05 Sep 2026, 15:25 WIB', productName: 'Bawang Merah Brebes', category: 'Bumbu & Rempah', weightKg: 2.000, pricePerKg: 38000, totalPrice: 76000, operator: 'Tama' },
      { id: 'WT-5000', time: '03 Sep 2026, 08:50 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 4.500, pricePerKg: 16500, totalPrice: 74250, operator: 'Haikal' },
      { id: 'WT-4400', time: '01 Sep 2026, 17:15 WIB', productName: 'Kentang Dieng Super', category: 'Buah & Sayur', weightKg: 3.000, pricePerKg: 22000, totalPrice: 66000, operator: 'Razka' },
    ],
  },
  year: {
    totalCount: 54890,
    rows: [
      { id: 'WT-9801', time: '05 Okt 2026, 08:32 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 1.250, pricePerKg: 16500, totalPrice: 20625, operator: 'Razka' },
      { id: 'WT-8200', time: '18 Agu 2026, 14:10 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 5.000, pricePerKg: 135000, totalPrice: 675000, operator: 'Tama' },
      { id: 'WT-7100', time: '22 Jul 2026, 10:45 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 4.800, pricePerKg: 16500, totalPrice: 79200, operator: 'Haikal' },
      { id: 'WT-6000', time: '14 Jun 2026, 16:20 WIB', productName: 'Telur Ayam Ras', category: 'Pangan', weightKg: 4.200, pricePerKg: 29000, totalPrice: 121800, operator: 'Razka' },
      { id: 'WT-4900', time: '08 Mei 2026, 11:35 WIB', productName: 'Minyak Goreng Curah', category: 'Sembako', weightKg: 5.000, pricePerKg: 16000, totalPrice: 80000, operator: 'Tama' },
      { id: 'WT-3800', time: '26 Apr 2026, 09:15 WIB', productName: 'Gula Pasir Kristal', category: 'Sembako', weightKg: 4.500, pricePerKg: 17500, totalPrice: 78750, operator: 'Haikal' },
      { id: 'WT-2700', time: '19 Mar 2026, 15:50 WIB', productName: 'Daging Sapi Segar', category: 'Daging', weightKg: 3.800, pricePerKg: 135000, totalPrice: 513000, operator: 'Razka' },
      { id: 'WT-1600', time: '02 Feb 2026, 13:25 WIB', productName: 'Bawang Merah Brebes', category: 'Bumbu & Rempah', weightKg: 2.500, pricePerKg: 38000, totalPrice: 95000, operator: 'Tama' },
      { id: 'WT-0800', time: '15 Jan 2026, 10:40 WIB', productName: 'Beras Premium', category: 'Sembako', weightKg: 5.000, pricePerKg: 16500, totalPrice: 82500, operator: 'Haikal' },
      { id: 'WT-0100', time: '03 Jan 2026, 08:15 WIB', productName: 'Kentang Dieng Super', category: 'Buah & Sayur', weightKg: 3.500, pricePerKg: 22000, totalPrice: 77000, operator: 'Razka' },
    ],
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface WeighingTableProps {
  period?: TimePeriod;
}

export const WeighingTable = ({ period = 'today' }: WeighingTableProps) => {
  const current = transactionsByPeriod[period] || transactionsByPeriod.today;
  const transactionData = current.rows;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
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
            {transactionData.map((row, index) => (
              <tr 
                key={row.id} 
                className="hover:bg-blue-50/50 transition-colors"
              >
                {/* No */}
                <td className="px-5 py-4 text-center font-bold text-gray-400">
                  {index + 1}
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
                  <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                    {row.weightKg.toFixed(3)}
                  </span>
                  <span className="text-xs font-semibold text-blue-500 ml-1">kg</span>
                </td>

                {/* Harga / kg */}
                <td className="px-6 py-4 text-right text-gray-600 whitespace-nowrap tabular-nums font-semibold text-xs">
                  {formatRupiah(row.pricePerKg)}
                </td>

                {/* Total Harga */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span className="text-sm font-black text-emerald-700 tabular-nums">
                    {formatRupiah(row.totalPrice)}
                  </span>
                </td>

                {/* Operator */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200">
                      {row.operator.charAt(0)}
                    </div>
                    <span className="text-gray-800 font-semibold text-xs">{row.operator}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900 text-white font-bold text-xs">
              <td className="px-6 py-4 text-center" colSpan={4}>
                TOTAL RINGKASAN ({transactionData.length} Sampel Transaksi Terpilih)
              </td>
              <td className="px-6 py-4 text-right text-blue-300 font-extrabold text-sm tabular-nums">
                {transactionData.reduce((acc, curr) => acc + curr.weightKg, 0).toFixed(3)} kg
              </td>
              <td className="px-6 py-4 text-right text-slate-400">-</td>
              <td className="px-6 py-4 text-right text-emerald-400 text-sm font-black tabular-nums">
                {formatRupiah(transactionData.reduce((acc, curr) => acc + curr.totalPrice, 0))}
              </td>
              <td className="px-6 py-4 text-slate-300">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Integrated Footer Bar: Pagination & Status */}
      <div className="p-4 sm:p-5 px-6 border-t border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Menampilkan <strong className="text-gray-900">1-{transactionData.length}</strong> dari <strong className="text-gray-900">{current.totalCount.toLocaleString('id-ID')}</strong> transaksi penimbangan</span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 px-2 rounded-lg border border-gray-200 hover:bg-white text-gray-500 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs">
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1 font-sans text-xs">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-2xs">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-700 transition-colors cursor-pointer font-semibold">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-700 transition-colors cursor-pointer font-semibold">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">
              <MoreHorizontal size={14} />
            </span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-700 transition-colors cursor-pointer font-semibold">
              {Math.ceil(current.totalCount / 10)}
            </button>
          </div>

          <button className="p-1.5 px-2 rounded-lg border border-gray-200 hover:bg-white text-gray-500 transition-colors cursor-pointer shadow-2xs">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeighingTable;
