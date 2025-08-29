# 在庫管理システムのセットアップ手順

## Supabaseでテーブルを作成する

1. Supabaseダッシュボードにログイン: https://supabase.com/dashboard
2. プロジェクトを選択
3. 左メニューから「SQL Editor」を選択
4. 以下のSQLを実行してください：

```sql
-- inventory_products テーブルの作成
CREATE TABLE IF NOT EXISTS inventory_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  unit_cost DECIMAL(10, 2) DEFAULT 0,
  manufacturing_cost DECIMAL(10, 2) DEFAULT 0,
  packaging_cost DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  selling_price DECIMAL(10, 2) NOT NULL,
  wholesale_price DECIMAL(10, 2),
  current_stock INTEGER DEFAULT 0,
  reserved_stock INTEGER DEFAULT 0,
  available_stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 10,
  max_stock INTEGER DEFAULT 1000,
  reorder_point INTEGER DEFAULT 20,
  reorder_quantity INTEGER DEFAULT 100,
  supplier TEXT,
  lead_time INTEGER DEFAULT 7,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- stock_history テーブルの作成
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

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_inventory_products_sku ON inventory_products(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_products_category ON inventory_products(category);
CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created_at ON stock_history(created_at DESC);

-- 初期データの挿入
INSERT INTO inventory_products (
  name, sku, category, unit_cost, manufacturing_cost, packaging_cost, 
  shipping_cost, selling_price, current_stock, min_stock, max_stock,
  reorder_point, reorder_quantity, supplier, lead_time
) VALUES 
  (
    'HOT HERBE 30日分',
    'HOT-30D-001',
    'サプリメント',
    800,
    500,
    50,
    200,
    3980,
    0,
    50,
    500,
    100,
    200,
    'ヘルスケア製造株式会社',
    14
  ),
  (
    'HOT HERBE 90日分（3個セット）',
    'HOT-90D-001',
    'サプリメント',
    2100,
    1400,
    100,
    300,
    9980,
    0,
    30,
    200,
    50,
    100,
    'ヘルスケア製造株式会社',
    14
  ),
  (
    'HOT HERBE 180日分（6個セット）',
    'HOT-180D-001',
    'サプリメント',
    3900,
    2600,
    150,
    400,
    17980,
    0,
    20,
    100,
    30,
    50,
    'ヘルスケア製造株式会社',
    14
  )
ON CONFLICT (sku) DO NOTHING;
```

## テーブルの権限設定（RLS）

5. 「Authentication」→「Policies」で以下のポリシーを設定：

### inventory_products テーブル
- Enable RLS
- Create Policy: "Allow all operations for authenticated users"
  - Policy Name: `authenticated_full_access`
  - Allowed operation: ALL
  - Target roles: authenticated
  - WITH CHECK expression: `true`
  - USING expression: `true`

### stock_history テーブル
- Enable RLS  
- Create Policy: "Allow all operations for authenticated users"
  - Policy Name: `authenticated_full_access`
  - Allowed operation: ALL
  - Target roles: authenticated
  - WITH CHECK expression: `true`
  - USING expression: `true`

## 使い方

1. 管理画面にログイン: http://localhost:3003/admin
2. 左メニューから「在庫・原価管理」を選択
3. 以下の機能が利用可能です：
   - **製品追加**: 新しい製品を登録
   - **在庫調整**: 入庫・出庫・棚卸を実行
   - **表示切替**: リスト表示とカンバン表示
   - **在庫履歴**: すべての在庫変動を確認

## 重要な機能

### 在庫ステータス
- 🔴 **在庫切れ**: 在庫が0
- 🟠 **発注必要**: 発注点以下
- 🟡 **在庫少**: 最小在庫以下
- 🟢 **正常**: 適正在庫
- 🔵 **在庫過多**: 最大在庫の80%以上

### データの永続性
- すべてのデータはSupabaseに保存されます
- ブラウザを閉じてもデータは消えません
- 複数のユーザーで同じデータを共有できます

## トラブルシューティング

もしテーブルが作成できない場合：
1. Supabaseの無料プランの制限を確認
2. 既存のテーブルと名前が重複していないか確認
3. SQL構文エラーがないか確認

## サポート

問題が発生した場合は、エラーメッセージと共にお知らせください。