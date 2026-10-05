'use client';

import React, { useState } from 'react';
import { Search, Download, Table as TableIcon, Printer, Calendar, ChevronDown, Filter } from 'lucide-react';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Semua Kategori');

  const categories = [
    'Semua Kategori',
    'Sembako',
    'Daging & Protein',
    'Pangan',
    'Bahan Pokok',
    'Bumbu & Rempah',
    'Buah & Sayur',
    'Lainnya',
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
      {/* Baris 1: Pencarian & Aksi Export */}
      <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50/70 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs sm:text-sm font-medium placeholder-gray-400 transition"
            placeholder="Cari ID transaksi (#WT-9801), nama barang, atau nama operator..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pt-1 lg:pt-0">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer shadow-2xs whitespace-nowrap">
            <Download size={14} className="text-gray-500" />
            <span>CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer shadow-2xs whitespace-nowrap">
            <TableIcon size={14} className="text-emerald-600" />
            <span>Excel</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer shadow-xs whitespace-nowrap">
            <Printer size={14} />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Baris 2: Filter Tanggal, Kategori & Total */}
      <div className="flex flex-wrap items-center justify-between gap-3.5 pt-3.5 border-t border-gray-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
            <Filter size={14} className="text-blue-600" />
            <span>Filter Data:</span>
          </div>

          {/* Date Picker Button */}
          <button className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition cursor-pointer">
            <Calendar size={13} className="text-blue-600" />
            <span>Hari Ini (05 Okt 2026)</span>
          </button>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>

          {category !== 'Semua Kategori' && (
            <button
              onClick={() => setCategory('Semua Kategori')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer ml-1"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-gray-500 bg-gray-100/90 px-3 py-1.5 rounded-lg border border-gray-200/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Buffer Live: <strong className="text-gray-800 font-sans">142 Data</strong></span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
