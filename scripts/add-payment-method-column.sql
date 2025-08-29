-- ordersテーブルにpayment_methodカラムを追加
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card';

-- 既存のレコードに値を設定
UPDATE orders 
SET payment_method = 'card' 
WHERE payment_method IS NULL;