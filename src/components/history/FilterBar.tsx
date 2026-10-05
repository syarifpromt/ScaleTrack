import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export const FilterBar = () => {
  const [category, setCategory] = useState('Semua Kategori');
  
  const categories = ['Semua Kategori', 'Sembako', 'Daging & Protein', 'Pangan', 'Bahan Pokok', 'Bumbu & Rempah', 'Lainnya'];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-1">
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs cursor-pointer transition">
          <Calendar size={14} className="text-blue-600" />
          <span>Hari Ini: 05 Okt 2026</span>
        </button>
        
        <div className="relative group">
          <select 
            className="appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 cursor-pointer shadow-2xs transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
        
        <button 
          onClick={() => setCategory('Semua Kategori')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 cursor-pointer"
        >
          Reset Filter
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-full border border-gray-200 text-gray-600 text-xs font-mono font-medium">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span>Total 142 Catatan Tersimpan</span>
      </div>
    </div>
  );
};

export default FilterBar;
