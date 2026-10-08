import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'categories.json');

const DEFAULT_CATEGORIES: string[] = [
  'Sembako',
  'Bahan Pokok',
  'Daging & Protein',
  'Pangan',
  'Buah & Sayur',
  'Bumbu & Rempah',
  'Kopi / Minuman',
  'Lainnya',
];

function readCategories(): string[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(DEFAULT_CATEGORIES, null, 2), 'utf8');
      return DEFAULT_CATEGORIES;
    }
    const content = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Error reading categories.json:', err);
    return DEFAULT_CATEGORIES;
  }
}

function writeCategories(categories: string[]): boolean {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing categories.json:', err);
    return false;
  }
}

// GET: Ambil semua kategori
export async function GET() {
  const categories = readCategories();
  return NextResponse.json({ success: true, data: categories });
}

// POST: Tambah kategori baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ success: false, error: 'Nama kategori diperlukan' }, { status: 400 });
    }

    const trimmed = name.trim();
    const current = readCategories();

    if (current.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return NextResponse.json({ success: false, error: 'Kategori sudah ada' }, { status: 400 });
    }

    const updated = [...current, trimmed];
    writeCategories(updated);

    return NextResponse.json({ success: true, data: trimmed, categories: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal menambah kategori' }, { status: 500 });
  }
}

// PUT: Edit / Rename kategori
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { oldName, newName } = body;

    if (!oldName || !newName || typeof newName !== 'string') {
      return NextResponse.json({ success: false, error: 'oldName dan newName diperlukan' }, { status: 400 });
    }

    const trimmed = newName.trim();
    const current = readCategories();
    const updated = current.map(c => c === oldName ? trimmed : c);

    writeCategories(updated);
    return NextResponse.json({ success: true, categories: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal mengedit kategori' }, { status: 500 });
  }
}

// DELETE: Hapus kategori berdasarkan nama
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ success: false, error: 'Nama kategori diperlukan' }, { status: 400 });
    }

    const current = readCategories();
    const filtered = current.filter(c => c !== name);

    writeCategories(filtered);
    return NextResponse.json({ success: true, categories: filtered });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus kategori' }, { status: 500 });
  }
}

