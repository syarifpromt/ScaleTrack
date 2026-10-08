'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  Package,
  Plus,
  X,
  Tag,
  Pencil,
  Trash2,
  Layers,
  SlidersHorizontal,
  AlertCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Product, useProductsStore } from '@/lib/products-store';

export type { Product };

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

export function ProductSelector({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
  } = useProductsStore();

  const [selectedId, setSelectedId] = useState<string>('');

  // Main Management Modal State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Product Form View State (inside management modal: 'list' | 'add' | 'edit')
  const [productFormMode, setProductFormMode] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState(formatThousand(20000));
  const [isCustomCategoryInline, setIsCustomCategoryInline] = useState(false);
  const [inlineCategoryInput, setInlineCategoryInput] = useState('');

  // Category Tab Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Delete Confirmations
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Sync selectedId with products on mount / updates
  useEffect(() => {
    if (products.length > 0) {
      if (!selectedId || !products.some(p => p.id === selectedId)) {
        const first = products[0];
        setSelectedId(first.id);
        onSelectProduct(first);
      }
    }
  }, [products, selectedId, onSelectProduct]);

  const handleSelect = (product: Product) => {
    setSelectedId(product.id);
    onSelectProduct(product);
  };

  // Open Form to Add New Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0] || 'Sembako');
    setFormPrice(formatThousand(20000));
    setIsCustomCategoryInline(false);
    setInlineCategoryInput('');
    setProductFormMode('form');
  };

  // Open Form to Edit Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(formatThousand(p.pricePerKg));
    setIsCustomCategoryInline(false);
    setInlineCategoryInput('');
    setProductFormMode('form');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      setFormPrice('');
    } else {
      setFormPrice(formatThousand(digits));
    }
  };

  // Submit Product (Add or Edit)
  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let finalCategory = formCategory;
    if (isCustomCategoryInline && inlineCategoryInput.trim()) {
      const trimmedCat = inlineCategoryInput.trim();
      await addCategory(trimmedCat);
      finalCategory = trimmedCat;
    }

    const parsedPrice = parseFloat(formPrice.replace(/\D/g, '')) || 0;

    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, {
        name: formName.trim(),
        category: finalCategory || 'Umum',
        pricePerKg: parsedPrice,
      });
      if (updated && selectedId === updated.id) {
        onSelectProduct(updated);
      }
    } else {
      const created = await addProduct({
        name: formName.trim(),
        category: finalCategory || 'Umum',
        pricePerKg: parsedPrice,
      });
      setSelectedId(created.id);
      onSelectProduct(created);
    }

    setProductFormMode('list');
  };

  // Confirm Delete Product
  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const deletedId = productToDelete.id;
    await deleteProduct(deletedId);

    if (selectedId === deletedId) {
      const remaining = products.filter(p => p.id !== deletedId);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
        onSelectProduct(remaining[0]);
      }
    }
    setProductToDelete(null);
  };

  // Add Category Submit
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const success = await addCategory(trimmed);
    if (!success) {
      setCategoryError('Kategori sudah ada atau tidak valid.');
    } else {
      setNewCategoryName('');
      setCategoryError('');
    }
  };

  // Confirm Delete Category
  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete);
    setCategoryToDelete(null);
  };

  return (
    <div className="card p-5 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header: Bersih & Terfokus */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600 shrink-0" />
          <h3 className="font-bold text-gray-900 text-base">Pilih Barang yang Ditimbang</h3>
        </div>

        {/* Cukup 1 tombol rapi "Kelola Barang" */}
        <button
          onClick={() => {
            setActiveTab('products');
            setProductFormMode('list');
            setIsManageModalOpen(true);
          }}
          type="button"
          className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 border border-gray-200 shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
          <span>Kelola Barang</span>
        </button>
      </div>

      {/* Empty State jika belum ada barang */}
      {products.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2">
          <Package className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-semibold text-gray-600">Belum ada barang di daftar</p>
          <button
            onClick={() => {
              setActiveTab('products');
              handleOpenAddProduct();
              setIsManageModalOpen(true);
            }}
            className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Tambah Barang Pertama
          </button>
        </div>
      )}

      {/* Product Grid: Murni untuk memilih barang yang ditimbang (Tanpa ikon edit/hapus) */}
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
              {/* Header: Badge Kategori & Status Checkmark */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md truncate max-w-[160px]">
                  {product.category}
                </span>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Nama Barang */}
              <div>
                <div className="font-bold text-base text-gray-900 line-clamp-1">{product.name}</div>
              </div>

              {/* Harga per kg */}
              <div className="pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Harga / kg:</span>
                <span className="font-bold text-emerald-700 text-sm font-sans tabular-nums">
                  {formatRupiah(product.pricePerKg)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* MODAL TERPADU: KELOLA BARANG & KATEGORI                   */}
      {/* ========================================================= */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Kelola Barang & Kategori</h4>
                  <p className="text-xs text-gray-500">Pusat pengaturan daftar barang dan kategori timbangan</p>
                </div>
              </div>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50/40 px-5 pt-2 shrink-0 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  setProductFormMode('list');
                }}
                className={cn(
                  "px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer -mb-px",
                  activeTab === 'products'
                    ? "border-blue-600 text-blue-700 bg-white rounded-t-lg"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Daftar Barang ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('categories');
                }}
                className={cn(
                  "px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer -mb-px",
                  activeTab === 'categories'
                    ? "border-purple-600 text-purple-700 bg-white rounded-t-lg"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kelola Kategori ({categories.length})</span>
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-5 overflow-y-auto flex-1">
              {/* TAB 1: DAFTAR BARANG */}
              {activeTab === 'products' && (
                <div>
                  {productFormMode === 'list' ? (
                    <div className="space-y-3">
                      {/* Sub-header: Tombol + Tambah Barang */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          Edit, perbarui harga, atau hapus barang di bawah ini:
                        </span>
                        <button
                          type="button"
                          onClick={handleOpenAddProduct}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah</span>
                        </button>
                      </div>

                      {/* List Barang */}
                      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/30">
                        {products.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white flex items-center justify-between gap-3 hover:bg-gray-50 transition"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-sm text-gray-900 truncate">
                                  {item.name}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {item.category}
                                </span>
                              </div>
                              <div className="text-xs font-sans font-bold tabular-nums text-emerald-700">
                                {formatRupiah(item.pricePerKg)} / kg
                              </div>
                            </div>

                            {/* Aksi Edit & Hapus */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(item)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit Barang"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setProductToDelete(item)}
                                className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Hapus Barang"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Form Tambah / Edit Barang */
                    <form onSubmit={handleSubmitProductForm} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                            {editingProduct ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </span>
                          <span>{editingProduct ? 'Edit Data Barang' : 'Tambah Barang Baru'}</span>
                        </h5>

                        <button
                          type="button"
                          onClick={() => setProductFormMode('list')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer active:scale-95 border border-gray-200 shadow-2xs"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
                          <span>Kembali</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Nama Barang / Produk <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Beras Rojolele, Gula Pasir..."
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                      </div>

                      {/* Dropdown Kategori + Opsi Tambah Langsung */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-gray-700">
                            Kategori <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomCategoryInline(!isCustomCategoryInline);
                              if (!isCustomCategoryInline) setInlineCategoryInput('');
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            {isCustomCategoryInline ? 'Pilih dari daftar' : '+ Kategori Baru'}
                          </button>
                        </div>

                        {isCustomCategoryInline ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              required
                              placeholder="Ketik kategori baru (misal: Snack, Ikan)..."
                              value={inlineCategoryInput}
                              onChange={(e) => setInlineCategoryInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-gray-50 border border-blue-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                              autoFocus
                            />
                            <p className="text-[11px] text-gray-400">Kategori baru akan otomatis disimpan.</p>
                          </div>
                        ) : (
                          <select
                            value={formCategory}
                            onChange={(e) => {
                              if (e.target.value === '__NEW__') {
                                setIsCustomCategoryInline(true);
                              } else {
                                setFormCategory(e.target.value);
                              }
                            }}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                            <option value="__NEW__">+ Tambah Kategori Baru...</option>
                          </select>
                        )}
                      </div>

                      {/* Harga per kg */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Harga Jual per kg (Rp) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500 font-sans">
                            Rp
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            required
                            placeholder="20.000"
                            value={formPrice}
                            onChange={handlePriceChange}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans font-bold tabular-nums text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setProductFormMode('list')}
                          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          {editingProduct ? 'Simpan Perubahan' : 'Simpan Barang'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: KELOLA KATEGORI */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  {/* Form Tambah Kategori */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Tambah Kategori Baru
                    </label>
                    <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Nama kategori baru..."
                          value={newCategoryName}
                          onChange={(e) => {
                            setNewCategoryName(e.target.value);
                            if (categoryError) setCategoryError('');
                          }}
                          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                        />
                        {categoryError && (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {categoryError}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!newCategoryName.trim()}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah
                      </button>
                    </form>
                  </div>

                  {/* Daftar Kategori */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Daftar Kategori ({categories.length})
                    </label>
                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-100 border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                      {categories.map((cat) => (
                        <div
                          key={cat}
                          className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white transition text-xs"
                        >
                          <span className="font-semibold text-gray-800">{cat}</span>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                            title={`Hapus kategori ${cat}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DIALOG KONFIRMASI: Hapus Barang                           */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Hapus Barang?</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Yakin ingin menghapus barang <strong className="text-gray-800">"{productToDelete.name}"</strong>? Data akan dihapus dari daftar.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DIALOG KONFIRMASI: Hapus Kategori                         */}
      {/* ========================================================= */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Hapus Kategori?</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Yakin ingin menghapus kategori <strong className="text-gray-800">"{categoryToDelete}"</strong>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSelector;
