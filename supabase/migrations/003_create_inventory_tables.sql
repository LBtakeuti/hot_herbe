-- Create inventory_products table for detailed product management
CREATE TABLE IF NOT EXISTS inventory_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  unit_cost DECIMAL(10, 2) DEFAULT 0,           -- 仕入原価
  manufacturing_cost DECIMAL(10, 2) DEFAULT 0,   -- 製造原価
  packaging_cost DECIMAL(10, 2) DEFAULT 0,       -- 梱包費
  shipping_cost DECIMAL(10, 2) DEFAULT 0,        -- 配送費（1個あたり）
  selling_price DECIMAL(10, 2) NOT NULL,         -- 販売価格
  wholesale_price DECIMAL(10, 2),                -- 卸売価格
  current_stock INTEGER DEFAULT 0,               -- 現在在庫
  reserved_stock INTEGER DEFAULT 0,              -- 予約在庫
  available_stock INTEGER DEFAULT 0,             -- 利用可能在庫
  min_stock INTEGER DEFAULT 10,                  -- 最小在庫
  max_stock INTEGER DEFAULT 1000,                -- 最大在庫
  reorder_point INTEGER DEFAULT 20,              -- 発注点
  reorder_quantity INTEGER DEFAULT 100,          -- 発注数量
  supplier TEXT,                                 -- 仕入先
  lead_time INTEGER DEFAULT 7,                   -- リードタイム（日）
  notes TEXT,                                     -- 備考
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create stock_history table for tracking inventory changes
CREATE TABLE IF NOT EXISTS stock_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES inventory_products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  reference_number TEXT,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  unit_cost DECIMAL(10, 2),
  total_value DECIMAL(10, 2),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create product_cost_history table for tracking cost changes
CREATE TABLE IF NOT EXISTS product_cost_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES inventory_products(id) ON DELETE CASCADE,
  unit_cost DECIMAL(10, 2),
  manufacturing_cost DECIMAL(10, 2),
  packaging_cost DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  wholesale_price DECIMAL(10, 2),
  change_reason TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_products_sku ON inventory_products(sku);
CREATE INDEX idx_inventory_products_category ON inventory_products(category);
CREATE INDEX idx_inventory_products_current_stock ON inventory_products(current_stock);
CREATE INDEX idx_stock_history_product_id ON stock_history(product_id);
CREATE INDEX idx_stock_history_type ON stock_history(type);
CREATE INDEX idx_stock_history_created_at ON stock_history(created_at DESC);
CREATE INDEX idx_product_cost_history_product_id ON product_cost_history(product_id);
CREATE INDEX idx_product_cost_history_created_at ON product_cost_history(created_at DESC);

-- Create trigger for updating available_stock
CREATE OR REPLACE FUNCTION update_available_stock()
RETURNS TRIGGER AS $$
BEGIN
  NEW.available_stock = NEW.current_stock - NEW.reserved_stock;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_products_available_stock 
  BEFORE INSERT OR UPDATE OF current_stock, reserved_stock ON inventory_products
  FOR EACH ROW EXECUTE FUNCTION update_available_stock();

-- Create trigger for updated_at
CREATE TRIGGER update_inventory_products_updated_at 
  BEFORE UPDATE ON inventory_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to record stock changes
CREATE OR REPLACE FUNCTION record_stock_change(
  p_product_id UUID,
  p_type TEXT,
  p_quantity INTEGER,
  p_reason TEXT DEFAULT NULL,
  p_reference_number TEXT DEFAULT NULL,
  p_unit_cost DECIMAL DEFAULT NULL,
  p_created_by TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_previous_stock INTEGER;
  v_new_stock INTEGER;
  v_total_value DECIMAL;
BEGIN
  -- Get current stock
  SELECT current_stock INTO v_previous_stock
  FROM inventory_products
  WHERE id = p_product_id;

  -- Calculate new stock
  IF p_type = 'in' THEN
    v_new_stock = v_previous_stock + p_quantity;
  ELSIF p_type = 'out' THEN
    v_new_stock = v_previous_stock - p_quantity;
  ELSE -- adjustment
    v_new_stock = p_quantity;
  END IF;

  -- Calculate total value
  IF p_unit_cost IS NOT NULL THEN
    v_total_value = p_quantity * p_unit_cost;
  END IF;

  -- Insert into stock_history
  INSERT INTO stock_history (
    product_id, type, quantity, reason, reference_number,
    previous_stock, new_stock, unit_cost, total_value, created_by
  ) VALUES (
    p_product_id, p_type, p_quantity, p_reason, p_reference_number,
    v_previous_stock, v_new_stock, p_unit_cost, v_total_value, p_created_by
  );

  -- Update current stock
  UPDATE inventory_products
  SET current_stock = v_new_stock
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Insert initial HOT HERBE products if they don't exist
INSERT INTO inventory_products (
  name, sku, category, unit_cost, manufacturing_cost, packaging_cost, 
  shipping_cost, selling_price, current_stock, min_stock, max_stock,
  reorder_point, reorder_quantity, supplier, lead_time
) VALUES 
  (
    'HOT HERBE 30日分',
    'HOT-30D-001',
    'サプリメント',
    800,   -- 仕入原価
    500,   -- 製造原価
    50,    -- 梱包費
    200,   -- 配送費
    3980,  -- 販売価格
    0,     -- 現在在庫（初期は0）
    50,    -- 最小在庫
    500,   -- 最大在庫
    100,   -- 発注点
    200,   -- 発注数量
    'ヘルスケア製造株式会社',
    14     -- リードタイム
  ),
  (
    'HOT HERBE 90日分（3個セット）',
    'HOT-90D-001',
    'サプリメント',
    2100,  -- 仕入原価
    1400,  -- 製造原価
    100,   -- 梱包費
    300,   -- 配送費
    9980,  -- 販売価格
    0,     -- 現在在庫（初期は0）
    30,    -- 最小在庫
    200,   -- 最大在庫
    50,    -- 発注点
    100,   -- 発注数量
    'ヘルスケア製造株式会社',
    14     -- リードタイム
  ),
  (
    'HOT HERBE 180日分（6個セット）',
    'HOT-180D-001',
    'サプリメント',
    3900,  -- 仕入原価
    2600,  -- 製造原価
    150,   -- 梱包費
    400,   -- 配送費
    17980, -- 販売価格
    0,     -- 現在在庫（初期は0）
    20,    -- 最小在庫
    100,   -- 最大在庫
    30,    -- 発注点
    50,    -- 発注数量
    'ヘルスケア製造株式会社',
    14     -- リードタイム
  )
ON CONFLICT (sku) DO NOTHING;