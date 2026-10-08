import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ScaleReadingState {
  weightKg: number;
  weightGrams: number;
  rawCount?: number;
  timestamp: number;
  device: string;
}

// Persist in globalThis across dev hot-reloads
const globalStore = globalThis as unknown as {
  __scaleReading?: ScaleReadingState;
};

if (!globalStore.__scaleReading) {
  globalStore.__scaleReading = {
    weightKg: 0,
    weightGrams: 0,
    timestamp: 0,
    device: 'ESP32 Simulator',
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, prefer, bypass-tunnel-reminder',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  let current = globalStore.__scaleReading || {
    weightKg: 0,
    weightGrams: 0,
    timestamp: 0,
    device: 'ESP32 Simulator',
  };

  const now = Date.now();
  let isLive = current.timestamp > 0 && (now - current.timestamp < 20000);

  // Jika di cache memori lokal belum ada data aktif, cek ke Supabase Cloud live_weights
  if (!isLive) {
    try {
      const { data, error } = await supabase
        .from('live_weights')
        .select('*')
        .eq('device_id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (!error && data && data.updated_at) {
        const updatedAtMs = new Date(data.updated_at).getTime();
        // Cek apakah data diperbarui dalam 35 detik terakhir (toleransi nyaman untuk simulator)
        if (now - updatedAtMs < 35000) {
          isLive = true;
          current = {
            weightKg: Number(data.weight),
            weightGrams: Number((Number(data.weight) * 1000).toFixed(1)),
            timestamp: updatedAtMs,
            device: 'ESP32 IoT Load Cell (Supabase Cloud)',
          };
          globalStore.__scaleReading = current;
        }
      }
    } catch {
      // Abaikan jika error jaringan
    }
  }

  return NextResponse.json(
    {
      success: true,
      weightKg: current.weightKg,
      weightGrams: current.weightGrams,
      timestamp: current.timestamp,
      isLive,
      device: current.device,
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'power_off' || body.power === false) {
      const offlineState: ScaleReadingState = {
        weightKg: 0,
        weightGrams: 0,
        timestamp: 0,
        device: body.device || 'ESP32 Simulator (Offline)',
      };
      globalStore.__scaleReading = offlineState;
      return NextResponse.json(
        { success: true, received: offlineState, isLive: false },
        { headers: corsHeaders }
      );
    }

    let grams = 0;
    let kg = 0;

    if (typeof body.weight_kg === 'number') {
      kg = body.weight_kg;
      grams = body.weight_kg * 1000;
    } else if (typeof body.weight_g === 'number') {
      grams = body.weight_g;
      kg = body.weight_g / 1000;
    } else if (typeof body.weight === 'number') {
      kg = body.weight;
      grams = body.weight * 1000;
    }

    const state: ScaleReadingState = {
      weightKg: Number(kg.toFixed(3)),
      weightGrams: Number(grams.toFixed(1)),
      rawCount: body.raw,
      timestamp: Date.now(),
      device: body.device || 'ESP32 Simulator (HX711)',
    };

    globalStore.__scaleReading = state;

    return NextResponse.json(
      {
        success: true,
        received: state,
      },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 400, headers: corsHeaders }
    );
  }
}

