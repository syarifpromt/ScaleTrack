-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_code VARCHAR(50) NOT NULL UNIQUE,
    device_name VARCHAR(100) NOT NULL,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error')),
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    target_weight DECIMAL,
    tolerance DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weighings table
CREATE TABLE IF NOT EXISTS weighings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    weight DECIMAL NOT NULL,
    tare DECIMAL DEFAULT 0,
    net_weight DECIMAL NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    status VARCHAR(20) DEFAULT 'accepted' CHECK (status IN ('accepted', 'warning', 'rejected')),
    deviation DECIMAL,
    operator VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live weights table (for realtime)
CREATE TABLE IF NOT EXISTS live_weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID UNIQUE REFERENCES devices(id) ON DELETE CASCADE,
    weight DECIMAL NOT NULL,
    is_stable BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_weighings_created_at ON weighings(created_at);
CREATE INDEX IF NOT EXISTS idx_weighings_device_id ON weighings(device_id);
CREATE INDEX IF NOT EXISTS idx_weighings_product_id ON weighings(product_id);

-- Enable realtime for live_weights
alter publication supabase_realtime add table live_weights;

-- Seed data
INSERT INTO devices (id, device_code, device_name, location, status) VALUES
('00000000-0000-0000-0000-000000000001', 'SCALE-001', 'Timbangan Utama', 'Area Produksi 1', 'online'),
('00000000-0000-0000-0000-000000000002', 'SCALE-002', 'Timbangan Gudang', 'Area Gudang', 'offline')
ON CONFLICT (device_code) DO NOTHING;

INSERT INTO products (id, product_code, product_name, unit, target_weight, tolerance) VALUES
('00000000-0000-0000-0000-000000000101', 'CF-ARB', 'Kopi Arabika Grade A', 'kg', 50, 0.5),
('00000000-0000-0000-0000-000000000102', 'CF-ROB', 'Kopi Robusta Grade A', 'kg', 50, 0.5)
ON CONFLICT (product_code) DO NOTHING;
