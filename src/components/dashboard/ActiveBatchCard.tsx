'use client';

import React, { useState } from 'react';
import { Package, User, CheckCircle2, Tag, ChevronDown, Plus, Check, X } from 'lucide-react';
import Link from 'next/link';

export interface ProductItem {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
}

const defaultProducts: ProductItem[] = [
  { id: '1', name: 'Beras Premium', pricePerKg: 16500, category: 'Sembako' },
  { id: '2', name: 'Daging Sapi Segar', pricePerKg: 135000, category: 'Daging' },
  { id: '3', name: 'Telur Ayam Ras', pricePerKg: 29000, category: 'Pangan' },
  { id: '4', name: 'Gula Pasir Kristal', pricePerKg: 17500, category: 'Sembako' },
  { id: '5', name: 'Tepung Terigu', pricePerKg: 14000, category: 'Bahan Pokok' },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ActiveBatchCard() {
  const [products, setProducts] = useState<ProductItem[]>(defaultProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(defaultProducts[0]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for + Tambah Barang
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Sembako');
  const [newPrice, setNewPrice] = useState('20000');

  const handleSelectProduct = (p: ProductItem) => {
    setSelectedProduct(p);
    setIsSelectorOpen(false);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parsedPrice = parseFloat(newPrice.replace(/\D/g, '')) || 0;
    const createdProduct: ProductItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      category: newCategory.trim() || 'Umum',
      pricePerKg: parsedPrice,
    };

    setProducts(prev => [...prev, createdProduct]);
    setSelectedProduct(createdProduct);
    setNewName('');
    setIsModalOpen(false);
  };

  return (
    <div className="card h-full flex flex-col justify-between bg-white rounded-2xl shadow-sm border border-gray-200 relative">
      {/* Header with Title & Quick Link */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900">
            Produk yang Sedang Ditimbang
          </h2>
        </div>
        <Link href="/weighing" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          Buka Stasiun Timbang →
        </Link>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Category Pill & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100">
                Kategori: {selectedProduct.category}
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Siap Timbang
              </span>
            </div>

            {/* Switch Product Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="py-1 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-gray-200"
              >
                <span>Ganti Barang</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isSelectorOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-30 flex flex-col gap-1 max-h-60 overflow-y-auto">
                  <div className="text-[11px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                    Pilih Barang Ditimbang:
                  </div>
                  {products.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                        selectedProduct.id === item.id ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{formatRupiah(item.pricePerKg)}/kg</div>
                      </div>
                      {selectedProduct.id === item.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setIsSelectorOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full mt-1 pt-2 border-t border-gray-100 text-blue-600 hover:text-blue-700 text-xs font-bold p-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Barang Baru</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Name & Subtext */}
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {selectedProduct.name}
          </h3>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Tag className="w-3.5 h-3.5 mr-1 text-gray-400" />
            Timbangan Digital Otomatis
          </div>

          {/* Details list */}
          <div className="space-y-2 mt-4 border-t border-gray-100 pt-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Harga Jual per kg</span>
              <span className="font-bold text-emerald-700 text-base font-mono">
                {formatRupiah(selectedProduct.pricePerKg)} / kg
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Kapasitas Maksimal</span>
              <span className="font-semibold text-gray-800">5.000 kg</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Petugas Kasir / Timbang</span>
              <span className="font-medium text-gray-800">Razka</span>
            </div>
          </div>
        </div>

        {/* Auto Compute Notification Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Hitung Otomatis Aktif</span>
            <span className="text-emerald-700 text-[11px]">Taruh barang berapa pun (misal 200g, 500g), total bayar langsung dihitung otomatis.</span>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Tambah Barang Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Barang / Produk
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beras Rojo Lele, Gula Pasir"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sembako, Pangan, Buah, Daging"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Harga Jual per kg (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  placeholder="Contoh: 120000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveBatchCard;
