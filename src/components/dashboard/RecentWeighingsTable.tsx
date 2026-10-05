import React from 'react';
import Link from 'next/link';
import { Filter, Eye } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { getMockWeighings } from '@/lib/mock-data';
import { formatTime } from '@/lib/utils';
import { clsx } from 'clsx';

export function RecentWeighingsTable() {
  const recentWeighings = getMockWeighings().slice(0, 5);

  return (
    <div className="card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-heading font-bold text-gray-900">5 Penimbangan Terakhir</h2>
          <p className="text-xs text-gray-500 mt-1">Data riwayat transaksi penimbangan kasir</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
          <Link href="/history" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Buka Riwayat Lengkap &rarr;
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-3 font-medium">Waktu</th>
              <th className="px-6 py-3 font-medium">SKU / Produk</th>
              <th className="px-6 py-3 font-medium">Berat (kg)</th>
              <th className="px-6 py-3 font-medium">Deviasi</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentWeighings.map((weighing) => {
              const deviationStr = weighing.deviation ? (weighing.deviation > 0 ? '+' : '') + (weighing.deviation * 1000).toFixed(1) + 'g' : '-';
              const isPositive = weighing.deviation && weighing.deviation > 0;
              const isNegative = weighing.deviation && weighing.deviation < 0;
              
              return (
                <tr key={weighing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {formatTime(weighing.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{weighing.product?.product_code || '-'}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{weighing.product?.product_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                    {weighing.net_weight.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    <span className={clsx(
                      isPositive ? 'text-blue-600' : isNegative ? 'text-amber-600' : 'text-gray-500'
                    )}>
                      {deviationStr}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={weighing.status === 'accepted' ? 'stable' : weighing.status === 'warning' ? 'warning' : 'offline'} 
                      text={weighing.status === 'accepted' ? 'Accepted' : weighing.status === 'warning' ? 'Warning' : 'Rejected'} 
                      size="compact" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentWeighingsTable;
