// Common types
export interface Ingredient {
  name: string
  image: string
  benefits: string[]
}

export interface Feature {
  title: string
  subtitle: string
  description: string
  image: string
  benefits: string[]
}

export interface PricingOption {
  title: string
  price: string
  save: string | null
}

export interface FAQ {
  question: string
  answer: string
  defaultOpen?: boolean
}

// Admin types
export interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingOrders: number
  revenueChange: number
  ordersChange: number
  customersChange: number
}

export interface RecentOrder {
  id: string
  created_at: string
  customer_name: string
  total_amount: number
  status: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  unit_cost: number
  manufacturing_cost: number
  packaging_cost: number
  shipping_cost: number
  selling_price: number
  wholesale_price?: number
  current_stock: number
  reserved_stock: number
  available_stock: number
  min_stock: number
  max_stock: number
  reorder_point: number
  reorder_quantity: number
  supplier: string
  lead_time: number
  notes?: string
  updated_at: string
}

export interface StockHistory {
  id: string
  product_id: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason?: string
  reference_number?: string
  previous_stock: number
  new_stock: number
  unit_cost?: number
  total_value?: number
  created_by?: string
  created_at: string
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  churnRate: number

  averageOrderValue: number
  purchaseFrequency: number
  customerLifetimeValue: number

  segments: {
    name: string
    count: number
    revenue: number
    percentage: number
    avgOrderValue: number
  }[]

  rfmAnalysis: {
    champions: number
    loyalCustomers: number
    potentialLoyalists: number
    newCustomers: number
    atRisk: number
    cantLose: number
  }

  regionalDistribution: {
    region: string
    customers: number
    revenue: number
    avgOrderValue: number
  }[]

  purchasePatterns: {
    timeOfDay: { hour: string; orders: number }[]
    dayOfWeek: { day: string; orders: number }[]
    seasonality: { month: string; orders: number; revenue: number }[]
  }

  productPerformance: {
    product: string
    units: number
    revenue: number
    customers: number
    repurchaseRate: number
  }[]

  cohortRetention: {
    cohort: string
    month0: number
    month1: number
    month2: number
    month3: number
  }[]
}