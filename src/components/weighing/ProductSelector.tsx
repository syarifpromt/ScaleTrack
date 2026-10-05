'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Package, Plus, X, Tag } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Beras Premium', pricePerKg: 16500, category: 'Sembako' },
  { id: '2', name: 'Daging Sapi Segar', pricePerKg: 135000, category: 'Daging' },
  { id: '3', name: 'Telur Ayam Ras', pricePerKg: 29000, category: 'Pangan' },
  { id: '4', name: 'Gula Pasir Kristal', pricePerKg: 17500, category: 'Sembako' },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductSelector({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedId, setSelectedId] = useState(initialProducts[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for New Product
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sembako');
  const [pricePerKg, setPricePerKg] = useState('20000');

  const handleSelect = (product: Product) => {
    setSelectedId(product.id);
    onSelectProduct(product);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(pricePerKg.replace(/\D/g, '')) || 0;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      category: category.trim() || 'Umum',
      pricePerKg: parsedPrice,
    };

    setProducts(prev => [...prev, newProduct]);
    setSelectedId(newProduct.id);
    onSelectProduct(newProduct);

    // Reset Form & Close Modal
    setName('');
    setCategory('Sembako');
    setPricePerKg('20000');
    setIsModalOpen(false);
  };

  return (
    <div className="card p-5 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header with Add Product Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-base">Pilih Barang yang Ditimbang</h3>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Barang
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {products.map((product) => {
          const isSelected = selectedId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-3",
                isSelected
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400/30 shadow-xs"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 bg-white"
              )}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="font-bold text-base text-gray-900 line-clamp-1">{product.name}</div>
              </div>

              {/* Price per Kg badge */}
              <div className="pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Harga / kg:</span>
                <span className="font-black text-emerald-700 text-sm font-mono">
                  {formatRupiah(product.pricePerKg)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup Tambah Barang Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Tambah Barang Baru</h4>
                  <p className="text-xs text-gray-500">Tentukan nama barang dan harga jual per kg</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Barang / Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beras Rojo Lele, Gula Pasir, Telur..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Sembako">Sembako</option>
                  <option value="Bahan Pokok">Bahan Pokok</option>
                  <option value="Daging & Protein">Daging & Protein</option>
                  <option value="Pangan">Pangan</option>
                  <option value="Buah & Sayur">Buah & Sayur</option>
                  <option value="Bumbu & Rempah">Bumbu & Rempah</option>
                  <option value="Kopi / Minuman">Kopi / Minuman</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Harga Jual per kg */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Harga Jual per kg (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500 font-mono">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    required
                    placeholder="150000"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-gray-900"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Contoh: Jika pembeli beli 200 gram (0.2 kg), total bayar otomatis dihitung: 0.2 × harga/kg
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Simpan & Gunakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSelector;
