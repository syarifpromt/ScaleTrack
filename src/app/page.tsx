import React from 'react';
import { LiveWeightDisplay } from '@/components/dashboard/LiveWeightDisplay';
import { ActiveBatchCard } from '@/components/dashboard/ActiveBatchCard';
import { SalesProfitSection } from '@/components/dashboard/SalesProfitSection';
import { RecentWeighingsTable } from '@/components/dashboard/RecentWeighingsTable';
import { HardwareDiagnostics } from '@/components/dashboard/HardwareDiagnostics';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Top Shortcut Row: Status Timbangan & Produk Kasir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <LiveWeightDisplay />
        </div>
        <div className="lg:col-span-6">
          <ActiveBatchCard />
        </div>
      </div>

      {/* 2. Sales & Profit Monitoring Analytics */}
      <SalesProfitSection />

      {/* 3. Bottom Row: Riwayat Transaksi & Status Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentWeighingsTable />
        </div>
        <div className="lg:col-span-4">
          <HardwareDiagnostics />
        </div>
      </div>
    </div>
  );
}
