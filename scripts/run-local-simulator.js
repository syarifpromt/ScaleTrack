/**
 * ScaleTrack Local ESP32 & HX711 Simulator (Node.js)
 * Mensimulasikan perangkat keras timbangan digital via HTTP POST ke localhost:3000
 */

const http = require('http');

const PORT = 3000;
const HOST = 'localhost';
const PATH = '/api/scale/reading';

let currentWeightKg = 1.000;
let isPowerOn = true;
let counter = 0;

console.log('====================================================');
console.log('   ScaleTrack - Virtual ESP32 IoT Hardware Simulator');
console.log('====================================================');
console.log(`Menghubungkan ke http://${HOST}:${PORT}${PATH}`);
console.log('Tekan Ctrl + C untuk mematikan simulator.\n');

function sendWeight(kg) {
  const grams = parseFloat((kg * 1000).toFixed(1));
  const rawAdc = Math.round(grams * 1677.721);

  const payload = JSON.stringify({
    weight_kg: kg,
    weight_g: grams,
    raw: rawAdc,
    device: 'ESP32 IoT Load Cell (Node Simulator)',
  });

  const options = {
    hostname: HOST,
    port: PORT,
    path: PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = http.request(options, (res) => {
    counter++;
    process.stdout.write(`\r[TX #${counter}] Beban: ${kg.toFixed(3)} kg (${grams} g) -> Status: ${res.statusCode} OK   `);
  });

  req.on('error', (err) => {
    process.stdout.write(`\r[ERROR] Gagal terhubung ke ScaleTrack: ${err.message}   `);
  });

  req.write(payload);
  req.end();
}

// Kirim heartbeat setiap 600ms
setInterval(() => {
  if (isPowerOn) {
    sendWeight(currentWeightKg);
  }
}, 600);

