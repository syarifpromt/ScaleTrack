'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface ActionButtonsProps {
  onSave?: () => void;
  onTare?: () => void;
  onZero?: () => void;
  isStable?: boolean;
  isOverload?: boolean;
  isZero?: boolean;
}

export function ActionButtons({}: ActionButtonsProps) {
  return (
    <div className="w-full">
      {/* Action: Cetak Struk */}
      <button
        onClick={() => {
          alert('✓ Perintah cetak struk penimbangan berhasil dikirim!');
        }}
        type="button"
        title="Cetak struk label penimbangan"
        className="w-full p-3.5 flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl transition-all active:scale-[0.99] cursor-pointer shadow-2xs font-bold text-sm text-gray-800"
      >
        <Printer className="w-4 h-4 text-gray-600" />
        <span>Cetak Struk</span>
      </button>
    </div>
  );
}

export default ActionButtons;
