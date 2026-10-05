import React from 'react';
import { Battery, CheckCircle2, Wifi, Zap } from 'lucide-react';

export function HardwareDiagnostics() {
  return (
    <div className="card h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
        <h2 className="text-sm font-bold text-gray-900">
          Status Alat Timbangan
        </h2>
        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
          Siap Digunakan
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <StatusRow 
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            label="Kondisi Sensor Timbangan" 
            value="Normal & Akurat" 
            desc="Siap menimbang" 
          />
          <StatusRow 
            icon={<Wifi className="w-4 h-4 text-blue-600" />}
            label="Koneksi Perangkat" 
            value="Terhubung Stabil" 
            desc="Sinyal Bagus" 
          />
          <StatusRow 
            icon={<Battery className="w-4 h-4 text-emerald-600" />}
            label="Daya Baterai" 
            value="94%" 
            desc="Baterai Penuh" 
          />
          <StatusRow 
            icon={<Zap className="w-4 h-4 text-amber-600" />}
            label="Status Kalibrasi" 
            value="Terkalibrasi" 
            desc="Standar Pabrik" 
          />
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
          💡 <strong>Tips Perawatan:</strong> Pastikan meja timbangan rata dan tidak tersenggol saat menimbang agar hasil selalu akurat.
        </div>
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="bg-white p-1.5 rounded-lg shadow-2xs border border-gray-200">
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-900">{label}</div>
          <div className="text-[11px] text-gray-500">{desc}</div>
        </div>
      </div>
      <span className="text-xs font-bold text-gray-800">{value}</span>
    </div>
  );
}

export default HardwareDiagnostics;
