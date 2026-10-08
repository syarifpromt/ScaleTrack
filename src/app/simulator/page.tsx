'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Power,
  Wifi,
  Scale,
  Activity,
  Terminal as TerminalIcon,
  RotateCcw,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  text: string;
}

export default function LocalSimulatorPage() {
  const [isPowered, setIsPowered] = useState<boolean>(true);
  const [weightKg, setWeightKg] = useState<number>(1.000);
  const [hasJitter, setHasJitter] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [httpStatus, setHttpStatus] = useState<number | null>(200);
  const [pingLatency, setPingLatency] = useState<number>(2);
  const [txCount, setTxCount] = useState<number>(0);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const isPoweredRef = useRef(isPowered);
  const weightKgRef = useRef(weightKg);
  const hasJitterRef = useRef(hasJitter);

  isPoweredRef.current = isPowered;
  weightKgRef.current = weightKg;
  hasJitterRef.current = hasJitter;

  const addLog = useCallback((text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs((prev) => [...prev.slice(-80), { id: `${Date.now()}-${Math.random()}`, time, type, text }]);
  }, []);

  // Initial boot log
  useEffect(() => {
    addLog('ESP32-S3 Scale Controller v2.4 (Virtual Hardware) dimulai...', 'info');
    addLog('WiFi terkoneksi ke localhost (127.0.0.1:3000)', 'success');
    addLog('Sensor HX711 24-bit ADC terkalibrasi (1677.721 counts/g)', 'info');
  }, [addLog]);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Main Heartbeat / Transmit Loop (500ms)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isPoweredRef.current) return;

      const currentBaseWeight = weightKgRef.current;
      // Tambah jitter acak kecil jika fitur getaran aktif (±15g)
      const jitterAmount = hasJitterRef.current ? (Math.random() - 0.5) * 0.030 : 0;
      const finalKg = Math.max(0, Number((currentBaseWeight + jitterAmount).toFixed(3)));
      const grams = Number((finalKg * 1000).toFixed(1));
      const rawCount = Math.round(grams * 1677.721);

      const startTime = performance.now();
      try {
        const res = await fetch('/api/scale/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight_kg: finalKg,
            weight_g: grams,
            raw: rawCount,
            device: 'ESP32 IoT Load Cell (Simulator Lokal)',
          }),
        });

        const elapsed = Math.round(performance.now() - startTime);
        setPingLatency(elapsed);
        setHttpStatus(res.status);
        setTxCount((prev) => prev + 1);

        if (res.ok) {
          addLog(`[TX] Beban: ${finalKg.toFixed(3)} kg (${grams} g) -> 200 OK (${elapsed}ms)`, 'success');
        } else {
          addLog(`[ERR] HTTP Error: ${res.status}`, 'error');
        }
      } catch (err: unknown) {
        setHttpStatus(500);
        addLog(`[FAIL] Gagal menghubungi /api/scale/reading`, 'error');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [addLog]);

  // Toggle Power Handlers
  const handleTogglePower = async () => {
    const nextState = !isPowered;
    setIsPowered(nextState);

    if (!nextState) {
      addLog('Saklar dimatikan: ESP32 Power OFF. Heartbeat dihentikan.', 'warn');
      // Kirim sinyal power_off instan ke backend
      try {
        await fetch('/api/scale/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'power_off' }),
        });
        addLog('[SHUTDOWN] Sinyal Power OFF terkirim. Status ScaleTrack menjadi Terputus.', 'info');
      } catch {}
    } else {
      addLog('Saklar dinyalakan: ESP32 Booting up...', 'info');
      addLog('WiFi terhubung kembali. Memulai transmisi heartbeat...', 'success');
    }
  };

  const handleSetPresetWeight = (kg: number) => {
    setWeightKg(Number(kg.toFixed(3)));
    addLog(`Slider beban diubah ke ${kg.toFixed(3)} kg`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Simulator ESP32 IoT & Sensor HX711</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% LOKAL (OFFLINE)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulasi perangkat keras nyata tanpa perlu internet tunnel atau alat fisik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/weighing"
              target="_blank"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
              title="Buka Stasiun Timbang di tab baru untuk memantau beban secara berdampingan"
            >
              <span>Buka Stasiun Timbang</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/settings"
              target="_blank"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pengaturan Alat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Guide Card */}
        <div className="p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-2xl flex items-start gap-3 text-xs text-blue-200/90">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Cara Menguji Real-time:</strong> Buka halaman <strong>Stasiun Timbang</strong> di tab/jendela lain. Saat tombol <strong>Power ESP32</strong> dinyalakan dan slider beban digeser di sini, angka pada Stasiun Timbang akan langsung bergerak otomatis tanpa jeda! Saat Power dimatikan, status timbangan akan otomatis menjadi <strong>Terputus (Merah)</strong>.
          </div>
        </div>

        {/* Main Grid: Hardware Bench & Serial Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Hardware Control Bench (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. ESP32 Unit Hardware Box */}
            <div className="p-5 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
              
              {/* Circuit Pattern Accent */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Hardware Header & LEDs */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                    ESP32-S3 WROOM-1
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    GPIO 4 (DOUT) • GPIO 5 (SCK)
                  </span>
                </div>

                {/* Status Indicator LEDs */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className={`w-2 h-2 rounded-full ${isPowered ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-slate-700'}`} />
                    <span className={isPowered ? 'text-emerald-400' : 'text-slate-500'}>PWR</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className={`w-2 h-2 rounded-full ${isPowered ? 'bg-blue-400 animate-ping shadow-sm shadow-blue-400' : 'bg-slate-700'}`} />
                    <span className={isPowered ? 'text-blue-400' : 'text-slate-500'}>TX/RX</span>
                  </div>
                </div>
              </div>

              {/* Power Switch Section */}
              <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Power className={`w-4 h-4 ${isPowered ? 'text-emerald-400' : 'text-rose-500'}`} />
                    <span>Daya Perangkat (Power Supply)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isPowered
                      ? 'ESP32 aktif & mengirimkan detak sinyal (Heartbeat).'
                      : 'ESP32 mati total. ScaleTrack akan mendeteksi alat terputus.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePower}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md ${
                    isPowered
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isPowered ? 'Matikan (Power OFF)' : 'Nyalakan (Power ON)'}</span>
                </button>
              </div>

              {/* 2. Load Cell & HX711 Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Beban Sensor Load Cell (HX711)</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl font-black text-emerald-400 tracking-tight">
                      {weightKg.toFixed(3)}
                    </span>
                    <span className="text-sm font-bold text-slate-400">kg</span>
                    <span className="text-xs text-slate-500 font-mono ml-2">
                      ({Math.round(weightKg * 1000)} g)
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max="5.500"
                    step="0.005"
                    disabled={!isPowered}
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                    className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0.000 kg (Standby)</span>
                    <span>2.500 kg (Tengah)</span>
                    <span>5.000 kg (Maks)</span>
                    <span className="text-rose-400">5.500 kg (Overload)</span>
                  </div>
                </div>

                {/* Quick Presets Buttons */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pilihan Beban Cepat:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(0)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 0
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      Angkat (0 kg)
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(0.250)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 0.25
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      250 g
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(0.500)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 0.5
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      500 g
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(1.000)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 1
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      1.000 kg
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(2.000)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 2
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      2.000 kg
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(3.500)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 3.5
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      3.500 kg
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(5.000)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 5
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      5 kg (Maks)
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => handleSetPresetWeight(5.500)}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 ${
                        weightKg === 5.5
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border-rose-800/60'
                      }`}
                      title="Uji simulasi kelebihan beban (Overload alarm)"
                    >
                      5.5 kg (Overload)
                    </button>
                    <button
                      type="button"
                      disabled={!isPowered}
                      onClick={() => setHasJitter(!hasJitter)}
                      className={`col-span-2 p-2 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-30 flex items-center justify-center gap-1.5 ${
                        hasJitter
                          ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                          : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{hasJitter ? 'Getaran Sensor: ON' : 'Uji Goyang Sensor'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hardware Telemetry Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  <span>Protokol: <strong>HTTP REST</strong></span>
                  <span>Endpoint: <strong>/api/scale/reading</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Latency: <strong className="text-emerald-400">{pingLatency}ms</strong></span>
                  <span>Paket TX: <strong className="text-blue-400">{txCount}</strong></span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Live Serial Monitor (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col h-[520px] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            
            {/* Terminal Window Header */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-slate-300">
                  Virtual Serial Monitor (COM / 115200)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Bersihkan</span>
              </button>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1.5 bg-slate-950/70 select-text">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'warn'
                        ? 'text-amber-400'
                        : log.type === 'error'
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Terminal Footer */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Serial Connected</span>
              </div>
              <span>Baud: 115200 8-N-1</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

