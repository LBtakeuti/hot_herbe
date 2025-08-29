-- Function to increment customer stats
CREATE OR REPLACE FUNCTION increment_customer_stats(
  customer_email TEXT,
  amount DECIMAL
)
RETURNS void AS $$
BEGIN
  UPDATE customers
  SET 
    total_orders = total_orders + 1,
    total_spent = total_spent + amount,
    updated_at = TIMEZONE('utc', NOW())
  WHERE email = customer_email;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_product_stock(
  product_id TEXT,
  quantity INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET 
    stock_quantity = stock_quantity - quantity,
    updated_at = TIMEZONE('utc', NOW())
  WHERE id = product_id AND stock_quantity >= quantity;
END;
$$ LANGUAGE plpgsql;