import { TransactionRecord } from './transactions-store';
import { TimePeriod } from '@/app/history/page';

export function filterTransactionsByPeriod(
  transactions: TransactionRecord[],
  period: TimePeriod
): TransactionRecord[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return transactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    if (isNaN(txDate.getTime())) return true;

    if (period === 'today') {
      return txDate >= startOfDay;
    } else if (period === 'week') {
      const oneWeekAgo = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= oneWeekAgo;
    } else if (period === 'month') {
      const oneMonthAgo = new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000);
      return txDate >= oneMonthAgo;
    } else if (period === 'year') {
      const oneYearAgo = new Date(startOfDay.getTime() - 365 * 24 * 60 * 60 * 1000);
      return txDate >= oneYearAgo;
    }
    return true;
  });
}

export interface ComputedMetrics {
  totalTransactions: number;
  totalWeightKg: number;
  avgWeightPerTx: number;
  totalOmset: number;
  txSubtitle: string;
  weightSubtitle: string;
  omsetSubtitle: string;
}

export function computeAggregatedMetrics(
  transactions: TransactionRecord[],
  period: TimePeriod
): ComputedMetrics {
  const filtered = filterTransactionsByPeriod(transactions, period);
  const totalTransactions = filtered.length;
  const totalWeightKg = filtered.reduce((acc, curr) => acc + (curr.weightKg || 0), 0);
  const totalOmset = filtered.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const avgWeightPerTx = totalTransactions > 0 ? totalWeightKg / totalTransactions : 0;

  const periodLabels: Record<TimePeriod, string> = {
    today: 'hari ini',
    week: '7 hari terakhir',
    month: '30 hari terakhir',
    year: 'tahun berjalan',
  };

  return {
    totalTransactions,
    totalWeightKg: Number(totalWeightKg.toFixed(2)),
    avgWeightPerTx: Number(avgWeightPerTx.toFixed(2)),
    totalOmset,
    txSubtitle: totalTransactions > 0
      ? `Tercatat ${totalTransactions} transaksi ${periodLabels[period]}`
      : `Belum ada transaksi ${periodLabels[period]}`,
    weightSubtitle: totalTransactions > 0
      ? `Rata-rata ${avgWeightPerTx.toFixed(2)} kg / penimbangan`
      : 'Rata-rata 0.00 kg',
    omsetSubtitle: totalTransactions > 0
      ? `Akumulasi omset ${periodLabels[period]}`
      : 'Belum ada transaksi omset',
  };
}

export interface ComputedDistributionItem {
  name: string;
  value: number; // weight in kg
  percentage: number;
  color: string;
}

export function computeProductDistribution(
  transactions: TransactionRecord[],
  period: TimePeriod
) {
  const filtered = filterTransactionsByPeriod(transactions, period);
  const totalWeight = filtered.reduce((acc, curr) => acc + curr.weightKg, 0);

  if (filtered.length === 0 || totalWeight === 0) {
    return {
      dominantName: 'Belum Ada Transaksi',
      dominantPercentage: 0,
      dominantWeight: 0,
      items: [] as ComputedDistributionItem[],
    };
  }

  // Agregasi berat per produk
  const map: Record<string, number> = {};
  filtered.forEach(tx => {
    map[tx.productName] = (map[tx.productName] || 0) + tx.weightKg;
  });

  const palette = ['#2563eb', '#10B981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#64748b'];

  const sorted = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, weight], idx) => ({
      name,
      value: Number(weight.toFixed(2)),
      percentage: Math.round((weight / totalWeight) * 100),
      color: palette[idx % palette.length],
    }));

  const dominant = sorted[0];

  return {
    dominantName: dominant.name,
    dominantPercentage: dominant.percentage,
    dominantWeight: dominant.value,
    items: sorted,
  };
}

export interface ComputedPeakHourSlot {
  time: string;
  label: string;
  count: number;
  percentage: number;
  isPeak: boolean;
}

export function computePeakHours(
  transactions: TransactionRecord[],
  period: TimePeriod
) {
  const filtered = filterTransactionsByPeriod(transactions, period);

  const slotDefs = [
    { start: 8, end: 10, time: '08:00 - 10:00', label: 'Pagi' },
    { start: 10, end: 12, time: '10:00 - 12:00', label: 'Siang' },
    { start: 13, end: 15, time: '13:00 - 15:00', label: 'Siang' },
    { start: 15, end: 17, time: '15:00 - 17:00', label: 'Sore' },
    { start: 17, end: 20, time: '17:00 - 20:00', label: 'Malam' },
  ];

  const counts = slotDefs.map(def => {
    const count = filtered.filter(tx => {
      const date = new Date(tx.timestamp);
      const hour = date.getHours();
      return hour >= def.start && hour < def.end;
    }).length;

    return {
      ...def,
      count,
    };
  });

  const maxCount = Math.max(...counts.map(c => c.count), 0);

  const slots: ComputedPeakHourSlot[] = counts.map(c => ({
    time: c.time,
    label: c.label,
    count: c.count,
    percentage: maxCount > 0 ? Math.round((c.count / maxCount) * 100) : 0,
    isPeak: maxCount > 0 && c.count === maxCount,
  }));

  return {
    subtitle: filtered.length > 0
      ? `Konsentrasi frekuensi transaksi (${filtered.length} total penimbangan)`
      : 'Belum ada transaksi pada periode ini',
    slots,
    cycleTime: filtered.length > 0 ? 'Terekam Real-Time' : '-',
  };
}

export interface PeriodChartItem {
  label: string;
  beras: number;
  daging: number;
  sembako: number;
  total: number;
}

export interface PeriodChartConfig {
  dataKeyName: string;
  data: PeriodChartItem[];
  yDomain: [number, number];
  unit: string;
  barSubtitle: string;
  lineSubtitle: string;
  dominantInfo: string;
  peakInfo: string;
  avgInfo: string;
}

export function getDynamicTrendConfig(
  transactions: TransactionRecord[],
  period: TimePeriod
): PeriodChartConfig {
  const filtered = filterTransactionsByPeriod(transactions, period);

  const classifyTx = (txList: TransactionRecord[]) => {
    let beras = 0;
    let daging = 0;
    let sembako = 0;

    txList.forEach(t => {
      const name = t.productName.toLowerCase();
      if (name.includes('beras')) {
        beras += t.weightKg;
      } else if (name.includes('daging')) {
        daging += t.weightKg;
      } else {
        sembako += t.weightKg;
      }
    });

    return {
      beras: Number(beras.toFixed(2)),
      daging: Number(daging.toFixed(2)),
      sembako: Number(sembako.toFixed(2)),
      total: Number((beras + daging + sembako).toFixed(2)),
    };
  };

  let labels: string[] = [];
  let data: PeriodChartItem[] = [];

  if (period === 'today') {
    labels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    data = labels.map(label => {
      const hNum = parseInt(label.split(':')[0], 10);
      const inSlot = filtered.filter(tx => {
        const hour = new Date(tx.timestamp).getHours();
        return hour >= hNum && hour < hNum + 2;
      });
      const classified = classifyTx(inSlot);
      return { label, ...classified };
    });
  } else if (period === 'week') {
    labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    data = labels.map((label, idx) => {
      const inDay = filtered.filter(tx => {
        const d = new Date(tx.timestamp).getDay(); // 0 is Sunday
        const adjusted = d === 0 ? 6 : d - 1;
        return adjusted === idx;
      });
      const classified = classifyTx(inDay);
      return { label, ...classified };
    });
  } else if (period === 'month') {
    labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
    data = labels.map((label, idx) => {
      const inWeek = filtered.filter(tx => {
        const dateNum = new Date(tx.timestamp).getDate();
        const weekNum = Math.min(3, Math.floor((dateNum - 1) / 7));
        return weekNum === idx;
      });
      const classified = classifyTx(inWeek);
      return { label, ...classified };
    });
  } else {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    data = labels.map((label, idx) => {
      const inMonth = filtered.filter(tx => {
        return new Date(tx.timestamp).getMonth() === idx;
      });
      const classified = classifyTx(inMonth);
      return { label, ...classified };
    });
  }

  const maxTotal = Math.max(...data.map(d => d.total), 5);
  const totalWeight = filtered.reduce((acc, c) => acc + c.weightKg, 0);

  if (filtered.length === 0) {
    return {
      dataKeyName: 'label',
      data,
      yDomain: [0, 5],
      unit: ' kg',
      barSubtitle: 'Belum ada transaksi penimbangan tercatat pada periode ini',
      lineSubtitle: 'Lakukan penimbangan barang di Stasiun Timbang untuk mencatat grafik real-time',
      dominantInfo: 'Belum Ada Transaksi',
      peakInfo: 'Puncak: 0 kg',
      avgInfo: 'Rata-rata: 0 kg',
    };
  }

  // Cari item tertinggi
  const peakItem = [...data].sort((a, b) => b.total - a.total)[0];
  const avg = Number((totalWeight / (data.filter(d => d.total > 0).length || 1)).toFixed(2));

  return {
    dataKeyName: 'label',
    data,
    yDomain: [0, Math.ceil(maxTotal * 1.25)],
    unit: ' kg',
    barSubtitle: `Komposisi volume bobot dari ${filtered.length} transaksi penimbangan aktual (Klik bar untuk zoom)`,
    lineSubtitle: `Kurva tren akumulasi bobot timbangan (${totalWeight.toFixed(2)} kg total)`,
    dominantInfo: `Total Penimbangan: ${totalWeight.toFixed(2)} kg`,
    peakInfo: `Tertinggi: ${peakItem.label} (${peakItem.total} kg)`,
    avgInfo: `Rata-rata: ${avg} kg / interval`,
  };
}
