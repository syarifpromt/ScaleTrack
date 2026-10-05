'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Scale, FileText, BarChart3, HelpCircle, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';
import clsx from 'clsx';

const navItems = [
  { name: 'Menu Utama', href: '/', icon: LayoutDashboard },
  { name: 'Stasiun Timbang', href: '/weighing', icon: Scale },
  { name: 'Statistik & Riwayat', href: '/history', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-gray-200 bg-white shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Logo width={32} height={32} showStatus={false} />
      </div>
      
      {/* Quick Navigation Links */}
      <div className="px-4 py-4">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Menu Navigasi
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className={clsx('h-5 w-5', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Friendly Operator Guide at Sidebar bottom */}
      <div className="mt-auto p-4 m-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Cara Mudah Menimbang:</span>
        </div>
        <ol className="text-[12px] text-blue-950 space-y-1.5 leading-tight">
          <li className="flex items-start gap-1.5">
            <span className="bg-blue-200 text-blue-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Pilih jenis produk</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="bg-blue-200 text-blue-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Taruh barang di timbangan</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="bg-blue-200 text-blue-800 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Tunggu hijau & tekan <strong>SIMPAN</strong></span>
          </li>
        </ol>
      </div>
    </aside>
  );
}

export default Sidebar;
