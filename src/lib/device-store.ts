'use client';

import { useState, useEffect, useCallback } from 'react';

// ==================== COMMON TYPES ====================
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'usb' | 'bluetooth' | 'wifi';
  portOrInterface: string;
  status: string;
}

// ==================== SCALE STORE ====================
const SCALE_STATUS_KEY = 'scaletrack_scale_connected';
const ACTIVE_SCALE_KEY = 'scaletrack_active_scale';
const SCALE_EVENT = 'scaletrack_scale_status_changed';

const DEFAULT_SCALE: DeviceInfo = {
  id: 'SCALE-ESP32',
  name: 'ESP32 IoT Load Cell (Cirkit Simulator)',
  type: 'wifi',
  portOrInterface: 'WiFi IoT Stream • /api/scale/reading',
  status: 'Menunggu Koneksi',
};

let cachedScaleConnected = false;
let cachedActiveScale: DeviceInfo = DEFAULT_SCALE;

export function getInitialScaleConnected(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SCALE_STATUS_KEY);
    if (raw === null) return false;
    return raw === 'true';
  } catch {
    return false;
  }
}

export function getInitialActiveScale(): DeviceInfo {
  if (typeof window === 'undefined') return DEFAULT_SCALE;
  try {
    const raw = localStorage.getItem(ACTIVE_SCALE_KEY);
    if (!raw) return DEFAULT_SCALE;
    const parsed = JSON.parse(raw);
    return parsed && parsed.id ? parsed : DEFAULT_SCALE;
  } catch {
    return DEFAULT_SCALE;
  }
}

export function setScaleConnectionState(connected: boolean, device?: DeviceInfo) {
  cachedScaleConnected = connected;
  if (device) cachedActiveScale = device;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SCALE_STATUS_KEY, String(connected));
      if (device) {
        localStorage.setItem(ACTIVE_SCALE_KEY, JSON.stringify(device));
      }
    } catch (e) {
      console.error(e);
    }

    window.dispatchEvent(
      new CustomEvent(SCALE_EVENT, {
        detail: {
          connected,
          device: device || cachedActiveScale,
        },
      })
    );
  }
}

export function useScaleConnection() {
  const [isScaleConnected, setIsScaleConnected] = useState<boolean>(cachedScaleConnected);
  const [activeScale, setActiveScale] = useState<DeviceInfo>(cachedActiveScale);

  useEffect(() => {
    const initialConnected = getInitialScaleConnected();
    const initialDevice = getInitialActiveScale();
    setIsScaleConnected(initialConnected);
    setActiveScale(initialDevice);
    cachedScaleConnected = initialConnected;
    cachedActiveScale = initialDevice;

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ connected: boolean; device: DeviceInfo }>;
      if (customEvent.detail) {
        setIsScaleConnected(customEvent.detail.connected);
        if (customEvent.detail.device) {
          setActiveScale(customEvent.detail.device);
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SCALE_STATUS_KEY) {
        setIsScaleConnected(e.newValue === 'true');
      }
      if (e.key === ACTIVE_SCALE_KEY && e.newValue) {
        try {
          setActiveScale(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener(SCALE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    // Live Watchdog Heartbeat for ESP32 IoT Scale (stabil, anti-reconnecting loop)
    let missedHeartbeats = 0;
    const watchdogTimer = setInterval(async () => {
      try {
        const res = await fetch('/api/scale/reading', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const currentDev = getInitialActiveScale();

        if (currentDev.id === 'SCALE-ESP32') {
          // Hanya sambungkan jika belum terhubung
          if (data.isLive) {
            missedHeartbeats = 0;
            if (!cachedScaleConnected) {
              setScaleConnectionState(true, {
                ...currentDev,
                status: 'Terhubung (Online)',
              });
            }
          }
          // Hanya putuskan jika benar-benar mati beberapa kali berturut-turut
          else if (cachedScaleConnected) {
            missedHeartbeats++;
            if (missedHeartbeats >= 3) {
              setScaleConnectionState(false, {
                ...currentDev,
                status: 'Sinyal Terputus (Simulasi Mati)',
              });
            }
          }
        }
      } catch {
        // silent fail on network errors
      }
    }, 2000);

    return () => {
      window.removeEventListener(SCALE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
      clearInterval(watchdogTimer);
    };
  }, []);

  const connect = useCallback((device?: DeviceInfo) => {
    setScaleConnectionState(true, device);
  }, []);

  const disconnect = useCallback(() => {
    setScaleConnectionState(false);
  }, []);

  const toggle = useCallback(() => {
    setScaleConnectionState(!isScaleConnected);
  }, [isScaleConnected]);

  return {
    isScaleConnected,
    activeScale,
    connect,
    disconnect,
    toggle,
  };
}

// ==================== PRINTER STORE ====================
const PRINTER_STATUS_KEY = 'scaletrack_printer_connected';
const ACTIVE_PRINTER_KEY = 'scaletrack_active_printer';
const PRINTER_EVENT = 'scaletrack_printer_status_changed';
const PAPER_WIDTH_KEY = 'scaletrack_paper_width';

const DEFAULT_PRINTER: DeviceInfo = {
  id: 'PRT-01',
  name: 'POS-58 Thermal Receipt Printer',
  type: 'usb',
  portOrInterface: 'USB Port • Kertas 58mm',
  status: 'Siap Dihubungkan',
};

let cachedPrinterConnected = true;
let cachedActivePrinter: DeviceInfo = DEFAULT_PRINTER;
let cachedPaperWidth: '58mm' | '80mm' = '58mm';

export function getInitialPrinterConnected(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(PRINTER_STATUS_KEY);
    if (raw === null) return true;
    return raw === 'true';
  } catch {
    return true;
  }
}

export function getInitialActivePrinter(): DeviceInfo {
  if (typeof window === 'undefined') return DEFAULT_PRINTER;
  try {
    const raw = localStorage.getItem(ACTIVE_PRINTER_KEY);
    if (!raw) return DEFAULT_PRINTER;
    const parsed = JSON.parse(raw);
    return parsed && parsed.id ? parsed : DEFAULT_PRINTER;
  } catch {
    return DEFAULT_PRINTER;
  }
}

export function getInitialPaperWidth(): '58mm' | '80mm' {
  if (typeof window === 'undefined') return '58mm';
  try {
    const raw = localStorage.getItem(PAPER_WIDTH_KEY);
    if (raw === '80mm') return '80mm';
    return '58mm';
  } catch {
    return '58mm';
  }
}

export function setPrinterConnectionState(
  connected: boolean,
  device?: DeviceInfo,
  paperWidth?: '58mm' | '80mm'
) {
  cachedPrinterConnected = connected;
  if (device) cachedActivePrinter = device;
  if (paperWidth) cachedPaperWidth = paperWidth;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRINTER_STATUS_KEY, String(connected));
      if (device) {
        localStorage.setItem(ACTIVE_PRINTER_KEY, JSON.stringify(device));
      }
      if (paperWidth) {
        localStorage.setItem(PAPER_WIDTH_KEY, paperWidth);
      }
    } catch (e) {
      console.error(e);
    }

    window.dispatchEvent(
      new CustomEvent(PRINTER_EVENT, {
        detail: {
          connected,
          device: device || cachedActivePrinter,
          paperWidth: paperWidth || cachedPaperWidth,
        },
      })
    );
  }
}

export function usePrinterConnection() {
  const [isPrinterConnected, setIsPrinterConnected] = useState<boolean>(cachedPrinterConnected);
  const [activePrinter, setActivePrinter] = useState<DeviceInfo>(cachedActivePrinter);
  const [paperWidth, setPaperWidthState] = useState<'58mm' | '80mm'>(cachedPaperWidth);

  useEffect(() => {
    const initialConnected = getInitialPrinterConnected();
    const initialDevice = getInitialActivePrinter();
    const initialWidth = getInitialPaperWidth();

    setIsPrinterConnected(initialConnected);
    setActivePrinter(initialDevice);
    setPaperWidthState(initialWidth);
    cachedPrinterConnected = initialConnected;
    cachedActivePrinter = initialDevice;
    cachedPaperWidth = initialWidth;

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{
        connected: boolean;
        device?: DeviceInfo;
        paperWidth?: '58mm' | '80mm';
      }>;
      if (customEvent.detail) {
        setIsPrinterConnected(customEvent.detail.connected);
        if (customEvent.detail.device) setActivePrinter(customEvent.detail.device);
        if (customEvent.detail.paperWidth) setPaperWidthState(customEvent.detail.paperWidth);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === PRINTER_STATUS_KEY) {
        setIsPrinterConnected(e.newValue === 'true');
      }
      if (e.key === ACTIVE_PRINTER_KEY && e.newValue) {
        try {
          setActivePrinter(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === PAPER_WIDTH_KEY && e.newValue) {
        if (e.newValue === '80mm' || e.newValue === '58mm') {
          setPaperWidthState(e.newValue);
        }
      }
    };

    window.addEventListener(PRINTER_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(PRINTER_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const connect = useCallback((device?: DeviceInfo, width?: '58mm' | '80mm') => {
    setPrinterConnectionState(true, device, width);
  }, []);

  const disconnect = useCallback(() => {
    setPrinterConnectionState(false);
  }, []);

  const toggle = useCallback(() => {
    setPrinterConnectionState(!isPrinterConnected);
  }, [isPrinterConnected]);

  const setPaperWidth = useCallback((width: '58mm' | '80mm') => {
    setPrinterConnectionState(isPrinterConnected, activePrinter, width);
  }, [isPrinterConnected, activePrinter]);

  return {
    isPrinterConnected,
    activePrinter,
    paperWidth,
    connect,
    disconnect,
    toggle,
    setPaperWidth,
  };
}

