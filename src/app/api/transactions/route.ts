import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export interface TransactionRecord {
  id: string;
  timestamp: string; // ISO 8601
  time: string; // formatted date & time
  productName: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  operator: string;
  deviceName: string;
  status?: 'accepted' | 'warning' | 'rejected';
}

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'transactions.json');

function readTransactions(): TransactionRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const content = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading transactions.json:', err);
    return [];
  }
}

function writeTransactions(records: TransactionRecord[]): boolean {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(records, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing transactions.json:', err);
    return false;
  }
}

// GET: Ambil semua riwayat transaksi (diurutkan terbaru lebih dulu)
export async function GET() {
  const transactions = readTransactions();
  return NextResponse.json({ success: true, data: transactions });
}

// POST: Tambah transaksi penimbangan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      timestamp,
      time,
      productName,
      category,
      weightKg,
      pricePerKg,
      totalPrice,
      operator,
      deviceName,
      status = 'accepted',
    } = body;

    if (!productName || weightKg === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product name and weightKg are required' },
        { status: 400 }
      );
    }

    const currentRecords = readTransactions();
    const newRecord: TransactionRecord = {
      id: id || `TRX-${Date.now().toString().slice(-6)}`,
      timestamp: timestamp || new Date().toISOString(),
      time: time || new Date().toLocaleString('id-ID'),
      productName: String(productName).trim(),
      category: category ? String(category).trim() : 'Umum',
      weightKg: Number(weightKg),
      pricePerKg: Number(pricePerKg || 0),
      totalPrice: Number(totalPrice || 0),
      operator: operator || 'Operator Dummy',
      deviceName: deviceName || 'Timbangan Utama (SCALE-001)',
      status,
    };

    // Sisipkan transaksi baru di awal array lokal
    const updated = [newRecord, ...currentRecords];
    const success = writeTransactions(updated);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to write transaction' },
        { status: 500 }
      );
    }

    // Simpan juga ke Supabase Cloud (async background)
    try {
      await supabase.from('weighings').insert({
        device_id: '00000000-0000-0000-0000-000000000001',
        product_name: newRecord.productName,
        category: newRecord.category,
        weight: newRecord.weightKg,
        tare: 0,
        net_weight: newRecord.weightKg,
        price_per_kg: newRecord.pricePerKg,
        total_price: newRecord.totalPrice,
        operator: newRecord.operator,
        device_name: newRecord.deviceName,
        status: newRecord.status,
      });
    } catch (e) {
      console.error('Supabase weighing insert error:', e);
    }

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON request payload' },
      { status: 400 }
    );
  }
}

// DELETE: Hapus semua riwayat transaksi (reset ke kosong)
export async function DELETE() {
  const success = writeTransactions([]);
  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Failed to clear transactions' },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, message: 'All transactions cleared successfully' });
}

