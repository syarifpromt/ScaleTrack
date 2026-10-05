import { Device, Product, Weighing, LiveWeight, DailySummary } from '../types';

export const devices: Device[] = [
  {
    id: 'd1',
    device_code: 'SCALE-001',
    device_name: 'Timbangan Utama (Bay A)',
    location: 'Area Produksi 1',
    status: 'online',
    last_seen: '2026-10-05T08:30:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd2',
    device_code: 'SCALE-002',
    device_name: 'Timbangan Gudang (Bay B)',
    location: 'Area Gudang',
    status: 'offline',
    last_seen: '2026-10-05T07:15:00Z',
    created_at: '2026-01-01T00:00:00Z',
  }
];

export const products: Product[] = [
  { id: 'p1', product_code: 'BRS-PRM-01', product_name: 'Beras Premium', unit: 'kg', target_weight: 1.25, tolerance: 0.01, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p2', product_code: 'DGG-SP-02', product_name: 'Daging Sapi Segar', unit: 'kg', target_weight: 2.50, tolerance: 0.02, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p3', product_code: 'TLR-AYM-03', product_name: 'Telur Ayam Ras', unit: 'kg', target_weight: 1.75, tolerance: 0.02, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p4', product_code: 'GLA-PSR-04', product_name: 'Gula Pasir Kristal', unit: 'kg', target_weight: 5.00, tolerance: 0.05, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p5', product_code: 'TPG-TRG-05', product_name: 'Tepung Terigu Segitiga', unit: 'kg', target_weight: 1.00, tolerance: 0.01, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p6', product_code: 'MNY-GRG-06', product_name: 'Minyak Goreng Curah', unit: 'kg', target_weight: 1.00, tolerance: 0.01, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p7', product_code: 'BWG-MRH-07', product_name: 'Bawang Merah Brebes', unit: 'kg', target_weight: 3.25, tolerance: 0.03, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p8', product_code: 'KNT-DNG-08', product_name: 'Kentang Dieng Super', unit: 'kg', target_weight: 1.25, tolerance: 0.01, created_at: '2026-01-01T00:00:00Z' }
];

export const weighings: Weighing[] = [
  {
    id: 'WT-9801',
    device_id: 'd1',
    product_id: 'p1',
    weight: 1.245,
    tare: 0.000,
    net_weight: 1.245,
    unit: 'kg',
    status: 'accepted',
    deviation: 2.5,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T08:32:15Z',
    device: devices[0],
    product: products[0]
  },
  {
    id: 'WT-9800',
    device_id: 'd1',
    product_id: 'p1',
    weight: 1.248,
    tare: 0.000,
    net_weight: 1.248,
    unit: 'kg',
    status: 'accepted',
    deviation: -0.5,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T08:29:40Z',
    device: devices[0],
    product: products[0]
  },
  {
    id: 'WT-9799',
    device_id: 'd1',
    product_id: 'p2',
    weight: 2.500,
    tare: 0.120,
    net_weight: 2.380,
    unit: 'kg',
    status: 'accepted',
    deviation: 1.5,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T08:15:10Z',
    device: devices[0],
    product: products[1]
  },
  {
    id: 'WT-9798',
    device_id: 'd1',
    product_id: 'p3',
    weight: 1.750,
    tare: 0.000,
    net_weight: 1.750,
    unit: 'kg',
    status: 'accepted',
    deviation: 1.0,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T07:55:22Z',
    device: devices[0],
    product: products[2]
  },
  {
    id: 'WT-9797',
    device_id: 'd2',
    product_id: 'p5',
    weight: 0.995,
    tare: 0.050,
    net_weight: 0.945,
    unit: 'kg',
    status: 'warning',
    deviation: -5.0,
    operator: 'Budi S. (OP-104)',
    created_at: '2026-10-05T07:42:05Z',
    device: devices[1],
    product: products[4]
  },
  {
    id: 'WT-9796',
    device_id: 'd1',
    product_id: 'p4',
    weight: 5.012,
    tare: 0.200,
    net_weight: 4.812,
    unit: 'kg',
    status: 'accepted',
    deviation: 0.8,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T07:30:18Z',
    device: devices[0],
    product: products[3]
  },
  {
    id: 'WT-9795',
    device_id: 'd1',
    product_id: 'p6',
    weight: 1.002,
    tare: 0.000,
    net_weight: 1.002,
    unit: 'kg',
    status: 'accepted',
    deviation: 2.0,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T07:18:45Z',
    device: devices[0],
    product: products[5]
  },
  {
    id: 'WT-9794',
    device_id: 'd1',
    product_id: 'p7',
    weight: 3.250,
    tare: 0.150,
    net_weight: 3.100,
    unit: 'kg',
    status: 'accepted',
    deviation: -1.0,
    operator: 'Sri Rahayu (OP-882)',
    created_at: '2026-10-05T07:05:01Z',
    device: devices[0],
    product: products[6]
  }
];

export const liveWeight: LiveWeight = {
  id: 'lw1',
  device_id: 'd1',
  weight: 1.245,
  is_stable: true,
  updated_at: '2026-10-05T08:32:15Z'
};

export const dailySummary: DailySummary = {
  total_weighings: 142,
  total_weight: 184.65,
  average_weight: 1.300,
  target_achieved_percent: 92.0
};

export const getMockDevices = () => devices;
export const getMockProducts = () => products;
export const getMockWeighings = () => weighings;
export const getMockLiveWeight = () => liveWeight;
export const getMockDailySummary = () => dailySummary;

export const mockChartData = [
  { date: 'SEN', 'Beras': 120, 'Daging': 85 },
  { date: 'SEL', 'Beras': 135, 'Daging': 90 },
  { date: 'RAB', 'Beras': 145, 'Daging': 100 },
  { date: 'KAM', 'Beras': 165, 'Daging': 128 },
  { date: 'JUM', 'Beras': 140, 'Daging': 95 },
  { date: 'SAB', 'Beras': 80, 'Daging': 60 },
  { date: 'MIN', 'Beras': 45, 'Daging': 30 }
];
