import { useState, useEffect, useCallback } from 'react';

export interface TransactionRecord {
  id: string;
  timestamp: string;
  time: string;
  productName: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  operator: string;
  deviceName: string;
  status?: 'accepted' | 'warning' | 'rejected';
}

const TRANSACTIONS_EVENT = 'scaletrack_transactions_changed';

// Cache in memory for instantaneous first render
let cachedTransactions: TransactionRecord[] = [];
let hasFetchedInitial = false;

export async function fetchTransactions(): Promise<TransactionRecord[]> {
  try {
    const res = await fetch('/api/transactions', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      cachedTransactions = json.data;
      hasFetchedInitial = true;
      return json.data;
    }
    return [];
  } catch (err) {
    console.error('fetchTransactions error:', err);
    return cachedTransactions;
  }
}

export async function saveTransaction(
  record: Omit<TransactionRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): Promise<TransactionRecord | null> {
  try {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to save transaction');
    const json = await res.json();
    if (json.success && json.data) {
      cachedTransactions = [json.data, ...cachedTransactions.filter(t => t.id !== json.data.id)];
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(TRANSACTIONS_EVENT, { detail: cachedTransactions }));
      }
      return json.data;
    }
    return null;
  } catch (err) {
    console.error('saveTransaction error:', err);
    return null;
  }
}

export async function clearAllTransactions(): Promise<boolean> {
  try {
    const res = await fetch('/api/transactions', {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear transactions');
    const json = await res.json();
    if (json.success) {
      cachedTransactions = [];
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(TRANSACTIONS_EVENT, { detail: [] }));
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('clearAllTransactions error:', err);
    return false;
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(cachedTransactions);
  const [loading, setLoading] = useState<boolean>(!hasFetchedInitial);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial fetch on mount
    refresh();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<TransactionRecord[]>;
      if (customEvent.detail) {
        setTransactions(customEvent.detail);
      } else {
        refresh();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(TRANSACTIONS_EVENT, handleUpdate);
      // Sinkronisasi antar tab
      window.addEventListener('storage', refresh);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(TRANSACTIONS_EVENT, handleUpdate);
        window.removeEventListener('storage', refresh);
      }
    };
  }, [refresh]);

  return {
    transactions,
    loading,
    refresh,
    saveTransaction,
    clearAllTransactions,
  };
}

