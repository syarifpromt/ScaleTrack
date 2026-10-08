import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
}

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Beras Premium', pricePerKg: 16500, category: 'Sembako' },
  { id: '2', name: 'Daging Sapi Segar', pricePerKg: 135000, category: 'Daging & Protein' },
  { id: '3', name: 'Telur Ayam Ras', pricePerKg: 29000, category: 'Pangan' },
  { id: '4', name: 'Gula Pasir Kristal', pricePerKg: 17500, category: 'Sembako' },
  { id: '5', name: 'Tepung Terigu', pricePerKg: 14000, category: 'Bahan Pokok' },
];

function readProducts(): Product[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(DEFAULT_PRODUCTS, null, 2), 'utf8');
      return DEFAULT_PRODUCTS;
    }
    const content = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : DEFAULT_PRODUCTS;
  } catch (err) {
    console.error('Error reading products.json:', err);
    return DEFAULT_PRODUCTS;
  }
}

function writeProducts(products: Product[]): boolean {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing products.json:', err);
    return false;
  }
}

// GET: Ambil semua produk
export async function GET() {
  const products = readProducts();
  return NextResponse.json({ success: true, data: products });
}

// POST: Tambah produk baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, pricePerKg, category } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ success: false, error: 'Nama produk diperlukan' }, { status: 400 });
    }

    const current = readProducts();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      pricePerKg: Number(pricePerKg) || 0,
      category: (category && category.trim()) || 'Umum',
    };

    const updated = [newProduct, ...current];
    writeProducts(updated);

    return NextResponse.json({ success: true, data: newProduct, products: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal menambah produk' }, { status: 500 });
  }
}

// PUT: Perbarui produk yang ada
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, pricePerKg, category } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID produk diperlukan' }, { status: 400 });
    }

    const current = readProducts();
    let updatedProduct: Product | null = null;

    const updated = current.map(p => {
      if (p.id === id) {
        updatedProduct = {
          ...p,
          ...(name !== undefined && { name: name.trim() }),
          ...(pricePerKg !== undefined && { pricePerKg: Number(pricePerKg) || 0 }),
          ...(category !== undefined && { category: category.trim() || 'Umum' }),
        };
        return updatedProduct;
      }
      return p;
    });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    writeProducts(updated);
    return NextResponse.json({ success: true, data: updatedProduct, products: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui produk' }, { status: 500 });
  }
}

// DELETE: Hapus produk berdasarkan id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID produk diperlukan' }, { status: 400 });
    }

    const current = readProducts();
    const filtered = current.filter(p => p.id !== id);

    writeProducts(filtered);
    return NextResponse.json({ success: true, products: filtered });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus produk' }, { status: 500 });
  }
}

