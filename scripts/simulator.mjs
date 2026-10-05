/**
 * ScaleTrack - ESP32 Hardware Simulator
 * 
 * Script ini mensimulasikan pengiriman data berat dari timbangan ESP32 + HX711.
 * 
 * Cara menjalankan:
 *   node scripts/simulator.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const DEVICE_ID = '00000000-0000-0000-0000-000000000001'; // SCALE-001

console.log('='.repeat(50));
console.log('📡 ScaleTrack - ESP32 Scale Simulator');
console.log('='.repeat(50));

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('⚠️  Kredensial Supabase belum diatur di environment variable.');
  console.log('   Simulator berjalan dalam mode simulasi konsol lokal.\n');
  
  let baseWeight = 1.245;
  setInterval(() => {
    // Simulasi fluktuasi mikrogram
    const jitter = (Math.random() - 0.5) * 0.004;
    const currentWeight = (baseWeight + jitter).toFixed(3);
    const isStable = Math.random() > 0.15;
    
    console.log(`[ESP32] Berat: ${currentWeight} kg | Status: ${isStable ? 'STABLE' : 'READING'} | Waktu: ${new Date().toLocaleTimeString('id-ID')}`);
  }, 1000);
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log(`🔗 Terhubung ke Supabase: ${SUPABASE_URL}\n`);

  let baseWeight = 1.245;
  setInterval(async () => {
    const jitter = (Math.random() - 0.5) * 0.004;
    const currentWeight = parseFloat((baseWeight + jitter).toFixed(3));
    const isStable = Math.random() > 0.15;

    const { error } = await supabase
      .from('live_weights')
      .upsert({
        device_id: DEVICE_ID,
        weight: currentWeight,
        is_stable: isStable,
        updated_at: new Date().toISOString()
      }, { onConflict: 'device_id' });

    if (error) {
      console.error('❌ Gagal update realtime:', error.message);
    } else {
      console.log(`[ESP32 -> Supabase] Berat: ${currentWeight.toFixed(3)} kg | ${isStable ? 'STABIL' : 'MEMBACA'}`);
    }
  }, 1000);
}
