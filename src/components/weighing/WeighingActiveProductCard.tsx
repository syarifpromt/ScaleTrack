'use client';

import React, { useState, useEffect } from 'react';
import { Package, CheckCircle2, Tag, ChevronDown, Plus, Check, SlidersHorizontal, X, ArrowLeft, Pencil, Trash2, Search } from 'lucide-react';
import { Product, useProductsStore } from '@/lib/products-store';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, ' ');
}

function formatThousand(val: string | number): string {
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('id-ID').format(Number(digits));
}

interface WeighingActiveProductCardProps {
  selectedProduct: Product;
  onSelectProduct: (p: Product) => void;
}

export function WeighingActiveProductCard({
  selectedProduct,
  onSelectProduct,
}: WeighingActiveProductCardProps) {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useProductsStore();

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Search States (Sama-sama ada pencarian)
  const [productSearch, setProductSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Form State Tambah/Edit Produk
  const [productFormMode, setProductFormMode] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState(formatThousand(20000));

  // Category State (Tambah & Edit Kategori)
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Sinkronisasi kategori form default
  useEffect(() => {
    if (categories.length > 0 && !formCategory) {
      setFormCategory(categories[0]);
    }
  }, [categories, formCategory]);

  const handleSelectProduct = (p: Product) => {
    onSelectProduct(p);
    setIsSelectorOpen(false);
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0] || 'Umum');
    setFormPrice(formatThousand(15000));
    setProductFormMode('form');
    setActiveTab('products');
    setIsManageModalOpen(true);
    setIsSelectorOpen(false);
  };

  const handleOpenEditForm = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(formatThousand(p.pricePerKg));
    setProductFormMode('form');
    setActiveTab('products');
    setIsManageModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseFloat(formPrice.replace(/\D/g, '')) || 0;

    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, {
        name: formName.trim(),
        category: formCategory.trim() || 'Umum',
        pricePerKg: parsedPrice,
      });
      if (updated && selectedProduct.id === updated.id) {
        onSelectProduct(updated);
      }
    } else {
      const created = await addProduct({
        name: formName.trim(),
        category: formCategory.trim() || 'Umum',
        pricePerKg: parsedPrice,
      });
      if (created) {
        onSelectProduct(created);
      }
    }

    setProductFormMode('list');
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Hapus barang ini dari database?')) {
      await deleteProduct(id);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const ok = await addCategory(newCatName.trim());
    if (ok) {
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const handleSaveEditCategory = async (oldName: string) => {
    if (!editCategoryName.trim() || editCategoryName.trim() === oldName) {
      setEditingCategory(null);
      return;
    }
    await updateCategory(oldName, editCategoryName.trim());
    setEditingCategory(null);
  };

  // Filtered Products and Categories for Search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="card bg-white rounded-2xl shadow-sm border border-gray-200 relative flex flex-col justify-between">
      {/* Header with Title & Action */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900">
            Produk yang Sedang Ditimbang
          </h2>
        </div>
        <button
          onClick={() => {
            setProductFormMode('list');
            setIsManageModalOpen(true);
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition"
          title="Kelola data barang & kategori"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Kelola Barang</span>
        </button>
      </div>

      {/* Main Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Top Row: Category Pill, Status Badge & Dropdown Trigger */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100">
                Kategori: {selectedProduct.category}
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Siap Timbang
              </span>
            </div>

            {/* Dropdown Menu Container */}
            <div className="relative">
              <button
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="py-1 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-gray-200 shadow-2xs"
              >
                <span>Ganti Barang</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Dropdown List */}
              {isSelectorOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-30 flex flex-col gap-1 max-h-64 overflow-y-auto">
                  <div className="text-[11px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                    Pilih Barang Ditimbang:
                  </div>
                  {products.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectProduct(item)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                        selectedProduct.id === item.id
                          ? 'bg-blue-50 text-blue-800 font-bold'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-[10px] text-gray-500 font-sans font-semibold tabular-nums">
                          {formatRupiah(item.pricePerKg)}/kg
                        </div>
                      </div>
                      {selectedProduct.id === item.id && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}

                  <button
                    onClick={handleOpenAddForm}
                    className="w-full mt-1 pt-2 border-t border-gray-100 text-blue-600 hover:text-blue-700 text-xs font-bold p-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Barang Baru</span>
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
              <span className="font-bold text-emerald-700 text-base font-sans tabular-nums">
                {formatRupiah(selectedProduct.pricePerKg)} / kg
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Kapasitas Maksimal</span>
              <span className="font-semibold text-gray-800 font-sans tabular-nums">5.000 kg</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Petugas Kasir / Timbang</span>
              <span className="font-medium text-gray-800">Razka</span>
            </div>
          </div>
        </div>

        {/* Banner Bawah (Hitung Otomatis Aktif) */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-emerald-950">Hitung Otomatis Aktif</div>
            <div className="text-emerald-800 text-[11px] leading-relaxed">
              Taruh barang berapa pun (misal 200g, 500g), total bayar langsung dihitung otomatis.
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TERPADU KELOLA BARANG & KATEGORI */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Kelola Data Barang & Kategori</h3>
              </div>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/30 px-5 pt-2 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setProductFormMode('list');
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Daftar Barang ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Kelola Kategori ({categories.length})
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1">
              {activeTab === 'products' ? (
                productFormMode === 'list' ? (
                  <div className="space-y-3">
                    {/* Sub-header: Penjelasan singkat sebelah tombol Tambah */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-500 font-medium">
                        Klik barang untuk langsung memilih, atau edit harga/kategori.
                      </span>
                      <button
                        type="button"
                        onClick={handleOpenAddForm}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Input Search Barang */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Cari nama barang atau kategori..."
                        className="w-full pl-8.5 pr-8 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
                      />
                      {productSearch && (
                        <button
                          type="button"
                          onClick={() => setProductSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* List Barang */}
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden max-h-[280px] overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">
                          {productSearch ? `Tidak ada barang yang cocok dengan "${productSearch}"` : 'Belum ada data barang.'}
                        </div>
                      ) : (
                        filteredProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 flex items-center justify-between hover:bg-gray-50/80 transition"
                          >
                            <div
                              onClick={() => {
                                onSelectProduct(p);
                                setIsManageModalOpen(false);
                              }}
                              className="flex-1 cursor-pointer pr-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-xs">{p.name}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                                  {p.category}
                                </span>
                              </div>
                              <span className="text-xs font-sans font-bold text-emerald-700 tabular-nums">
                                {formatRupiah(p.pricePerKg)} / kg
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenEditForm(p)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit Barang"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Hapus Barang"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  // Form Tambah/Edit Produk
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm">
                        {editingProduct ? 'Edit Data Barang' : 'Tambah Barang Baru'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setProductFormMode('list')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-semibold transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke daftar</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nama Barang / Produk
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Contoh: Beras Premium, Daging Sapi..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Kategori Barang
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Harga Jual per kg (Rp)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">
                            Rp
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            required
                            value={formPrice}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '');
                              setFormPrice(digits ? formatThousand(digits) : '');
                            }}
                            placeholder="0"
                            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs font-sans font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none tabular-nums"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setProductFormMode('list')}
                        className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer shadow-sm"
                      >
                        {editingProduct ? 'Simpan Perubahan' : 'Simpan Barang Baru'}
                      </button>
                    </div>
                  </form>
                )
              ) : (
                // TAB KELOLA KATEGORI (SAMA PERSIS STRUKTURNYA)
                <div className="space-y-3">
                  {/* Sub-header: Penjelasan singkat sebelah tombol Tambah */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500 font-medium">
                      Kelola kategori barang, tambah, atau perbarui nama kategori.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory((prev) => !prev);
                        setEditingCategory(null);
                      }}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>

                  {/* Form Tambah Kategori (Muncul saat tombol Tambah diklik) */}
                  {isAddingCategory && (
                    <form
                      onSubmit={handleSaveCategory}
                      className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2 animate-in fade-in duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">Tambah Kategori Baru</span>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          autoFocus
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="Ketik nama kategori baru..."
                          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Input Search Kategori */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Cari kategori..."
                      className="w-full pl-8.5 pr-8 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
                    />
                    {categorySearch && (
                      <button
                        type="button"
                        onClick={() => setCategorySearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* List Kategori (Dilengkapi tombol Edit dan Hapus) */}
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden max-h-[280px] overflow-y-auto">
                    {filteredCategories.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">
                        {categorySearch ? `Tidak ada kategori yang cocok dengan "${categorySearch}"` : 'Belum ada kategori.'}
                      </div>
                    ) : (
                      filteredCategories.map((cat) => (
                        <div
                          key={cat}
                          className="p-3 flex items-center justify-between text-xs hover:bg-gray-50/80 transition"
                        >
                          {editingCategory === cat ? (
                            <div className="flex-1 flex items-center gap-2 mr-2">
                              <input
                                type="text"
                                autoFocus
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEditCategory(cat);
                                  if (e.key === 'Escape') setEditingCategory(null);
                                }}
                                className="flex-1 px-2.5 py-1 border border-blue-400 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditCategory(cat)}
                                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer shadow-2xs"
                                title="Simpan"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition cursor-pointer"
                                title="Batal"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="font-semibold text-gray-800">{cat}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCategory(cat);
                                    setEditCategoryName(cat);
                                    setIsAddingCategory(false);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                  title="Edit Kategori"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (categories.length <= 1) {
                                      alert('Minimal harus ada 1 kategori');
                                      return;
                                    }
                                    if (confirm(`Hapus kategori "${cat}"?`)) {
                                      deleteCategory(cat);
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Hapus Kategori"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeighingActiveProductCard;
