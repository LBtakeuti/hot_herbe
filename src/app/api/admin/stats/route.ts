import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    // Get total orders count
    const { count: totalOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Get total revenue
    const { data: revenueData } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: todayOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Get today's revenue
    const { data: todayRevenueData } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid')
      .gte('created_at', today.toISOString())

    const todayRevenue = todayRevenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Get total customers
    const { count: totalCustomers } = await supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact', head: true })

    // Get pending orders count
    const { count: pendingOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get recent orders
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get order status breakdown
    const { data: statusBreakdown } = await supabaseAdmin
      .from('orders')
      .select('status')

    const statusCounts = statusBreakdown?.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}

    return NextResponse.json({
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        todayOrders: todayOrders || 0,
        todayRevenue,
        totalCustomers: totalCustomers || 0,
        pendingOrders: pendingOrders || 0,
        statusBreakdown: statusCounts,
      },
      recentOrders: recentOrders || [],
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}