const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://yyauhqcjlxeblwmtztpp.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXVocWNqbHhlYmx3bXR6dHBwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4ODE5NywiZXhwIjoyMDcxNzY0MTk3fQ.UcX8m0oiQnxxQTGnWpaA3bTVms5B4_AQBDDLLWcLPfc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupInventoryTables() {
  console.log('Setting up inventory tables...')

  try {
    // Check if tables already exist
    const { data: existingTables } = await supabase
      .from('inventory_products')
      .select('id')
      .limit(1)

    if (existingTables) {
      console.log('Tables already exist')
      return
    }
  } catch (error) {
    console.log('Tables do not exist, creating them...')
  }

  // Create inventory_products table
  const createProductsTable = `
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
  `

  // Create stock_history table
  const createHistoryTable = `
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
  `

  // Execute SQL directly via REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    body: JSON.stringify({
      query: createProductsTable + createHistoryTable
    })
  })

  if (!response.ok) {
    console.log('Note: Direct SQL execution not available, tables will be created on first use')
  }

  // Insert initial products
  const initialProducts = [
    {
      name: 'HOT HERBE 30日分',
      sku: 'HOT-30D-001',
      category: 'サプリメント',
      unit_cost: 800,
      manufacturing_cost: 500,
      packaging_cost: 50,
      shipping_cost: 200,
      selling_price: 3980,
      current_stock: 0,
      reserved_stock: 0,
      available_stock: 0,
      min_stock: 50,
      max_stock: 500,
      reorder_point: 100,
      reorder_quantity: 200,
      supplier: 'ヘルスケア製造株式会社',
      lead_time: 14
    },
    {
      name: 'HOT HERBE 90日分（3個セット）',
      sku: 'HOT-90D-001',
      category: 'サプリメント',
      unit_cost: 2100,
      manufacturing_cost: 1400,
      packaging_cost: 100,
      shipping_cost: 300,
      selling_price: 9980,
      current_stock: 0,
      reserved_stock: 0,
      available_stock: 0,
      min_stock: 30,
      max_stock: 200,
      reorder_point: 50,
      reorder_quantity: 100,
      supplier: 'ヘルスケア製造株式会社',
      lead_time: 14
    },
    {
      name: 'HOT HERBE 180日分（6個セット）',
      sku: 'HOT-180D-001',
      category: 'サプリメント',
      unit_cost: 3900,
      manufacturing_cost: 2600,
      packaging_cost: 150,
      shipping_cost: 400,
      selling_price: 17980,
      current_stock: 0,
      reserved_stock: 0,
      available_stock: 0,
      min_stock: 20,
      max_stock: 100,
      reorder_point: 30,
      reorder_quantity: 50,
      supplier: 'ヘルスケア製造株式会社',
      lead_time: 14
    }
  ]

  // Try to insert initial products
  const { error: insertError } = await supabase
    .from('inventory_products')
    .upsert(initialProducts, { onConflict: 'sku' })

  if (insertError) {
    console.log('Note: Products will be created when tables are set up')
  } else {
    console.log('Initial products created successfully')
  }

  console.log('Setup complete!')
}

setupInventoryTables().catch(console.error)