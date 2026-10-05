import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Pagination = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
      <div className="text-xs text-gray-500">
        Menampilkan <span className="font-bold text-gray-800">1-10</span> dari <span className="font-bold text-gray-800">142</span> catatan penimbangan
      </div>
      
      <div className="flex items-center gap-1.5">
        <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs">
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1 font-mono text-xs">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-2xs">
            1
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer">
            2
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer">
            3
          </button>
          <span className="w-7 h-7 flex items-center justify-center text-gray-400">
            <MoreHorizontal size={14} />
          </span>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer">
            15
          </button>
        </div>

        <button className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer shadow-2xs">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
