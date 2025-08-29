import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const customerId = params.customerId

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('email')
      .eq('id', customerId)
      .single()

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('customer_email', customer.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customer orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customer orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Customer orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}