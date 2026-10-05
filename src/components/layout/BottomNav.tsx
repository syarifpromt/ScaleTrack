'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Scale, FileText, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Timbang', href: '/weighing', icon: Scale },
  { name: 'Statistik', href: '/history', icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white pb-safe lg:hidden">
      <div className="flex h-16 w-full justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center w-full',
                isActive ? 'text-[#2563eb]' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <item.icon className="mb-1 h-6 w-6" />
              <span className={clsx('text-[10px]', isActive && 'font-semibold')}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
