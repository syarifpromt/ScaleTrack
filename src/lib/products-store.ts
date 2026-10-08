'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
}

export const DEFAULT_CATEGORIES: string[] = [
  'Sembako',
  'Bahan Pokok',
  'Daging & Protein',
  'Pangan',
  'Buah & Sayur',
  'Bumbu & Rempah',
  'Kopi / Minuman',
  'Lainnya',
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Beras Premium', pricePerKg: 16500, category: 'Sembako' },
  { id: '2', name: 'Daging Sapi Segar', pricePerKg: 135000, category: 'Daging & Protein' },
  { id: '3', name: 'Telur Ayam Ras', pricePerKg: 29000, category: 'Pangan' },
  { id: '4', name: 'Gula Pasir Kristal', pricePerKg: 17500, category: 'Sembako' },
  { id: '5', name: 'Tepung Terigu', pricePerKg: 14000, category: 'Bahan Pokok' },
];

const STORAGE_KEY_PRODUCTS = 'scaletrack_products';
const STORAGE_KEY_CATEGORIES = 'scaletrack_categories';
const EVENT_UPDATED = 'scaletrack_products_updated';

// Helper: load from localStorage as fast initial cache
function getInitialLocalProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

function getInitialLocalCategories(): string[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function useProductsStore() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch true server database
  const refreshFromServer = useCallback(async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(() => null),
        fetch('/api/categories').then(r => r.json()).catch(() => null),
      ]);

      if (resProd && resProd.success && Array.isArray(resProd.data)) {
        setProducts(resProd.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(resProd.data));
        }
      }

      if (resCat && resCat.success && Array.isArray(resCat.data)) {
        setCategories(resCat.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(resCat.data));
        }
      }
      setIsLoaded(true);
    } catch (err) {
      console.error('Failed refreshing from server API:', err);
    }
  }, []);

  useEffect(() => {
    refreshFromServer();

    const handleUpdate = () => {
      refreshFromServer();
    };

    window.addEventListener(EVENT_UPDATED, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_UPDATED, handleUpdate);
    };
  }, [refreshFromServer]);

  // Actions
  const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<Product> => {
    const tempProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };

    // Optimistic UI update
    setProducts(prev => {
      const updated = [tempProduct, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event(EVENT_UPDATED));
        }
        return data.data;
      }
    } catch (err) {
      console.error('API add product failed:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_UPDATED));
    }
    return tempProduct;
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> => {
    let updatedProduct: Product | null = null;

    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          updatedProduct = { ...p, ...updates };
          return updatedProduct;
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENT_UPDATED));
      }
    } catch (err) {
      console.error('API update product failed:', err);
    }

    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENT_UPDATED));
      }
      return true;
    } catch (err) {
      console.error('API delete product failed:', err);
      return false;
    }
  }, []);

  const addCategory = useCallback(async (newCategory: string): Promise<boolean> => {
    const trimmed = newCategory.trim();
    if (!trimmed) return false;

    setCategories(prev => {
      if (prev.some(c => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      const updated = [...prev, trimmed];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event(EVENT_UPDATED));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('API add category failed:', err);
      return false;
    }
  }, []);

  const deleteCategory = useCallback(async (categoryToDelete: string): Promise<boolean> => {
    setCategories(prev => {
      const updated = prev.filter(c => c !== categoryToDelete);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch(`/api/categories?name=${encodeURIComponent(categoryToDelete)}`, {
        method: 'DELETE',
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENT_UPDATED));
      }
      return true;
    } catch (err) {
      console.error('API delete category failed:', err);
      return false;
    }
  }, []);

  const updateCategory = useCallback(async (oldCategory: string, newCategory: string): Promise<boolean> => {
    const trimmed = newCategory.trim();
    if (!trimmed || trimmed === oldCategory) return false;

    setCategories(prev => {
      const updated = prev.map(c => c === oldCategory ? trimmed : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      }
      return updated;
    });

    // Update any products that used the old category
    setProducts(prev => {
      const updated = prev.map(p => p.category === oldCategory ? { ...p, category: trimmed } : p);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: oldCategory, newName: trimmed }),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENT_UPDATED));
      }
      return true;
    } catch (err) {
      console.error('API update category failed:', err);
      return false;
    }
  }, []);

  return {
    products,
    categories,
    isLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshFromServer,
  };
}
