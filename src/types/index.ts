export interface Device {
  id: string;
  device_code: string;
  device_name: string;
  location: string | null;
  status: 'online' | 'offline' | 'error';
  last_seen: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  product_code: string;
  product_name: string;
  unit: string;
  target_weight?: number;
  tolerance?: number;
  created_at: string;
}

export interface Weighing {
  id: string;
  device_id: string;
  product_id: string;
  weight: number;
  tare: number;
  net_weight: number;
  unit: string;
  status: 'accepted' | 'warning' | 'rejected';
  deviation?: number;
  operator?: string;
  created_at: string;
  device?: Device;
  product?: Product;
}

export interface LiveWeight {
  id: string;
  device_id: string;
  weight: number;
  is_stable: boolean;
  updated_at: string;
}

export interface DailySummary {
  total_weighings: number;
  total_weight: number;
  average_weight: number;
  target_achieved_percent: number;
}
