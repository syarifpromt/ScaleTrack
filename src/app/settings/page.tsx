'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Scale,
  Printer,
  Usb,
  Bluetooth,
  Check,
  RefreshCw,
  Printer as PrinterIcon,
  CheckCircle2,
  X,
  Search,
  Radio,
  ArrowRight,
  Unlink,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScaleConnection, usePrinterConnection, DeviceInfo } from '@/lib/device-store';

type DeviceItem = DeviceInfo;

const FOUND_SCALES: DeviceItem[] = [
  {
    id: 'SCALE-ESP32',
    name: 'ESP32 IoT Load Cell (Cirkit Simulator)',
    type: 'wifi',
    portOrInterface: 'WiFi IoT Stream • /api/scale/reading',
    status: 'Siap Dihubungkan',
  },
  {
    id: 'SCALE-001',
    name: 'Timbangan Digital Utama (SCALE-001)',
    type: 'usb',
    portOrInterface: 'Port USB Serial CH340 (COM3)',
    status: 'Siap Dihubungkan',
  },
  {
    id: 'SCALE-002',
    name: 'CAS Digital Scale SW-II',
    type: 'bluetooth',
    portOrInterface: 'Bluetooth Wireless (BLE)',
    status: 'Siap Dihubungkan',
  },
  {
    id: 'SCALE-003',
    name: 'Sonic Indicator A12E Digital',
    type: 'usb',
    portOrInterface: 'Port USB RS-232 (COM1)',
    status: 'Siap Dihubungkan',
  },
];

const FOUND_PRINTERS: DeviceItem[] = [
  {
    id: 'PRT-01',
    name: 'POS-58 Thermal Receipt Printer',
    type: 'usb',
    portOrInterface: 'USB Port • Kertas 58mm',
    status: 'Siap Dihubungkan',
  },
  {
    id: 'PRT-02',
    name: 'Epson TM-T82X Thermal Printer',
    type: 'usb',
    portOrInterface: 'USB Port • Kertas 80mm',
    status: 'Siap Dihubungkan',
  },
  {
    id: 'PRT-03',
    name: 'Mini Bluetooth POS Thermal 58mm',
    type: 'bluetooth',
    portOrInterface: 'Bluetooth Wireless (SPP)',
    status: 'Siap Dihubungkan',
  },
  {
    id: 'PRT-04',
    name: 'Printer Default Sistem (Windows Spooler)',
    type: 'usb',
    portOrInterface: 'System Print Driver Bawaan',
    status: 'Siap Dihubungkan',
  },
];

export default function SettingsPage() {
  // 1. Timbangan State (Sinkron Real-Time dengan TopBar/Header)
  const {
    isScaleConnected,
    activeScale,
    connect: connectScale,
    disconnect: disconnectScale,
  } = useScaleConnection();

  // 2. Printer State (Sinkron Real-Time dengan TopBar/Header)
  const {
    isPrinterConnected,
    activePrinter,
    paperWidth,
    connect: connectPrinter,
    disconnect: disconnectPrinter,
    setPaperWidth,
  } = usePrinterConnection();

  const [isPrintingTest, setIsPrintingTest] = useState<boolean>(false);
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);

  // Modal State Pencarian Perangkat
  const [deviceModalType, setDeviceModalType] = useState<'scale' | 'printer' | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);
  const [discoveredScales, setDiscoveredScales] = useState<DeviceItem[]>([]);

  // Pindai Timbangan Aktif Secara Dinamis
  const scanScales = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/scale/reading', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.isLive) {
          setDiscoveredScales([
            {
              id: 'SCALE-ESP32',
              name: 'ESP32 IoT Load Cell (Cirkit Simulator)',
              type: 'wifi',
              portOrInterface: `WiFi IoT Online • ${data.device || 'Sinyal Aktif'}`,
              status: 'Sinyal Terdeteksi • Siap Dihubungkan',
            },
          ]);
        } else {
          setDiscoveredScales([]);
        }
      } else {
        setDiscoveredScales([]);
      }
    } catch {
      setDiscoveredScales([]);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 700);
    }
  };

  // Buka Modal Cari Timbangan (Pindai sekali saat awal dibuka, selanjutnya dikontrol operator)
  const handleOpenSearchScale = () => {
    setDeviceModalType('scale');
    setConnectingDeviceId(null);
    scanScales();
  };

  // Buka Modal Cari Printer
  const handleOpenSearchPrinter = () => {
    setDeviceModalType('printer');
    setIsScanning(true);
    setConnectingDeviceId(null);

    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  // Klik Sambungkan Perangkat Terpilih
  const handleConnectDevice = (device: DeviceItem) => {
    setConnectingDeviceId(device.id);

    setTimeout(() => {
      if (deviceModalType === 'scale') {
        connectScale(device);
      } else if (deviceModalType === 'printer') {
        const newWidth = device.portOrInterface.includes('80mm') ? '80mm' : '58mm';
        connectPrinter(device, newWidth);
      }

      setConnectingDeviceId(null);
      setDeviceModalType(null);
    }, 1000);
  };

  // Putuskan Timbangan
  const handleDisconnectScale = () => {
    disconnectScale();
  };

  // Putuskan Printer
  const handleDisconnectPrinter = () => {
    disconnectPrinter();
  };

  // Cetak Struk Uji Coba
  const handlePrintTest = () => {
    setIsPrintingTest(true);
    setPrintSuccess(false);

    const is58 = paperWidth === '58mm';
    const printWindow = window.open('', '_blank', 'width=380,height=560');

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Test Cetak Struk - ScaleTrack</title>
          <style>
            @page {
              margin: 0;
              size: ${is58 ? '58mm auto' : '80mm auto'};
            }
            body {
              font-family: monospace;
              font-size: ${is58 ? '11px' : '12px'};
              line-height: 1.4;
              padding: 12px;
              color: #000;
              max-width: ${is58 ? '58mm' : '80mm'};
              margin: 0 auto;
            }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .flex-between { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
            .title { font-size: ${is58 ? '13px' : '15px'}; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <div class="title">SCALETRACK</div>
            <div>Stasiun Penimbangan Pintar</div>
            <div>*** UJI COBA PRINTER STRUK ***</div>
          </div>
          <div class="divider"></div>
          <div class="flex-between">
            <span>Perangkat:</span>
            <span>${activePrinter?.name || 'Thermal POS'}</span>
          </div>
          <div class="flex-between">
            <span>Tanggal:</span>
            <span>${new Date().toLocaleDateString('id-ID')}</span>
          </div>
          <div class="flex-between">
            <span>Waktu:</span>
            <span>${new Date().toLocaleTimeString('id-ID')} WIB</span>
          </div>
          <div class="flex-between">
            <span>Ukuran Kertas:</span>
            <span>${paperWidth}</span>
          </div>
          <div class="divider"></div>
          <div class="text-center bold">KONEKSI PRINTER BERHASIL</div>
          <div class="divider"></div>
          <div class="text-center" style="font-size: 10px;">
            Terima kasih. Printer siap digunakan untuk mencetak struk transaksi.
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsPrintingTest(false);
        setPrintSuccess(true);
        setTimeout(() => setPrintSuccess(false), 3000);
      }, 400);
    } else {
      window.print();
      setIsPrintingTest(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1050px] mx-auto pb-16">
      {/* Header Halaman Sederhana */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-sans">
              Pengaturan Perangkat
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Cari dan hubungkan timbangan digital serta printer struk kasir Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Grid 2 Card: Timbangan Digital & Printer Struk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: TIMBANGAN DIGITAL */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header Card Timbangan */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">Timbangan Digital</h2>
                  <p className="text-[11px] text-gray-400">Sensor Pembaca Berat</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs",
                isScaleConnected && activeScale
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  isScaleConnected && activeScale ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                )} />
                <span>{isScaleConnected && activeScale ? 'Terhubung' : 'Terputus'}</span>
              </span>
            </div>

            {/* Info Perangkat Terpilih */}
            {isScaleConnected && activeScale ? (
              <div className="p-4 bg-gray-50/90 rounded-xl border border-gray-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">Perangkat Aktif:</span>
                    <span className="font-bold text-gray-900 text-sm block">{activeScale.name}</span>
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                      {activeScale.type === 'usb' ? <Usb className="w-3.5 h-3.5" /> : <Bluetooth className="w-3.5 h-3.5" />}
                      {activeScale.portOrInterface}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Beban Sensor Real-time:</span>
                  <span className="font-black text-gray-900 font-sans tabular-nums text-sm">
                    0.000 kg
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50/80 rounded-xl border border-dashed border-gray-300 text-center space-y-1">
                <p className="text-xs font-bold text-gray-700">Belum Ada Timbangan Terhubung</p>
                <p className="text-[11px] text-gray-400">
                  Klik tombol di bawah untuk memindai timbangan yang siap disambungkan.
                </p>
              </div>
            )}
          </div>

          {/* Tombol Aksi Timbangan */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleOpenSearchScale}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{isScaleConnected ? 'Ganti / Cari Timbangan' : 'Hubungkan Timbangan'}</span>
            </button>

            {isScaleConnected && (
              <button
                type="button"
                onClick={handleDisconnectScale}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition border border-rose-200 cursor-pointer"
                title="Putuskan Koneksi"
              >
                <Unlink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: PRINTER STRUK KASIR */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header Card Printer */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">Printer Struk Kasir</h2>
                  <p className="text-[11px] text-gray-400">Thermal Receipt</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs",
                isPrinterConnected && activePrinter
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  isPrinterConnected && activePrinter ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                )} />
                <span>{isPrinterConnected && activePrinter ? 'Siap Cetak' : 'Terputus'}</span>
              </span>
            </div>

            {/* Info Printer Terpilih */}
            {isPrinterConnected && activePrinter ? (
              <div className="p-4 bg-gray-50/90 rounded-xl border border-gray-200/80 space-y-3">
                <div>
                  <span className="text-[11px] text-gray-400 block font-medium">Printer Aktif:</span>
                  <span className="font-bold text-gray-900 text-sm block">{activePrinter.name}</span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    {activePrinter.type === 'usb' ? <Usb className="w-3.5 h-3.5" /> : <Bluetooth className="w-3.5 h-3.5" />}
                    {activePrinter.portOrInterface}
                  </span>
                </div>

                {/* Pilihan Ukuran Kertas */}
                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Ukuran Kertas:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaperWidth('58mm')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer",
                        paperWidth === '58mm'
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      58 mm
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperWidth('80mm')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer",
                        paperWidth === '80mm'
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      80 mm
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50/80 rounded-xl border border-dashed border-gray-300 text-center space-y-1">
                <p className="text-xs font-bold text-gray-700">Belum Ada Printer Terhubung</p>
                <p className="text-[11px] text-gray-400">
                  Klik tombol di bawah untuk memindai printer struk kasir yang tersedia.
                </p>
              </div>
            )}
          </div>

          {/* Tombol Aksi Printer */}
          <div className="pt-2 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleOpenSearchPrinter}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>{isPrinterConnected ? 'Ganti / Cari Printer' : 'Hubungkan Printer'}</span>
              </button>

              {isPrinterConnected && (
                <button
                  type="button"
                  onClick={handleDisconnectPrinter}
                  className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition border border-rose-200 cursor-pointer"
                  title="Putuskan Printer"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              )}
            </div>

            {isPrinterConnected && (
              <button
                type="button"
                onClick={handlePrintTest}
                disabled={isPrintingTest}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-gray-200 disabled:opacity-50"
              >
                <PrinterIcon className="w-4 h-4 text-gray-600" />
                <span>{isPrintingTest ? 'Mencetak Sampel...' : 'Cetak Struk Uji Coba (Test Print)'}</span>
              </button>
            )}

            {printSuccess && (
              <div className="p-2 bg-emerald-50 rounded-lg text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Perintah cetak uji coba berhasil dikirim!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PENCARIAN & KONEKSI PERANGKAT */}
      {deviceModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60 shrink-0">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {deviceModalType === 'scale' ? 'Pencarian Timbangan Digital' : 'Pencarian Printer Struk'}
                </h3>
              </div>
              <button
                onClick={() => setDeviceModalType(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {isScanning ? (
                <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Memindai Perangkat...</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {deviceModalType === 'scale'
                        ? 'Mencari port USB Serial & Bluetooth timbangan yang aktif'
                        : 'Mencari printer thermal kasir USB & Bluetooth yang tersedia'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">
                      Pilih perangkat untuk menghubungkan:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (deviceModalType === 'scale') {
                          scanScales();
                        } else {
                          setIsScanning(true);
                          setTimeout(() => setIsScanning(false), 1000);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={cn("w-3 h-3", isScanning && "animate-spin")} />
                      <span>Pindai Ulang</span>
                    </button>
                  </div>

                  {/* Jika Mencari Timbangan dan Belum Ada Simulasi ESP32 Aktif: TAMPILKAN KOSONG */}
                  {deviceModalType === 'scale' && discoveredScales.length === 0 ? (
                    <div className="py-8 px-4 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
                        <Wifi className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800">Tidak Ada Perangkat Timbangan Ditemukan</p>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                          Sinyal perangkat belum terdeteksi. Silakan jalankan simulasi di Cirkit Designer (klik tombol <strong>Play ▶️</strong>) lalu klik <strong>Pindai Ulang</strong>.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={scanScales}
                        className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RefreshCw className={cn("w-3.5 h-3.5", isScanning && "animate-spin")} />
                        <span>Pindai Ulang Sekarang</span>
                      </button>
                    </div>
                  ) : (
                    /* List Device yang Ditemukan */
                    <div className="space-y-2">
                      {(deviceModalType === 'scale' ? discoveredScales : FOUND_PRINTERS).map((dev) => {
                        const isConnecting = connectingDeviceId === dev.id;
                        const isCurrentlyActive =
                          deviceModalType === 'scale'
                            ? activeScale?.id === dev.id && isScaleConnected
                            : activePrinter?.id === dev.id && isPrinterConnected;

                      return (
                        <div
                          key={dev.id}
                          className={cn(
                            "p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3",
                            isCurrentlyActive
                              ? "bg-blue-50/70 border-blue-300"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                              dev.type === 'wifi' ? "bg-emerald-100 text-emerald-700" : dev.type === 'usb' ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"
                            )}>
                              {dev.type === 'wifi' ? <Wifi className="w-4 h-4" /> : dev.type === 'usb' ? <Usb className="w-4 h-4" /> : <Bluetooth className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-gray-900 leading-tight">
                                {dev.name}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                {dev.portOrInterface}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isConnecting}
                            onClick={() => handleConnectDevice(dev)}
                            className={cn(
                              "py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs",
                              isCurrentlyActive
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                          >
                            {isConnecting ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Menghubungkan...</span>
                              </>
                            ) : isCurrentlyActive ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Terhubung</span>
                              </>
                            ) : (
                              <>
                                <span>Hubungkan</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
