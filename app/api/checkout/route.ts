import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  orderOnline,
  onlineOrderStatus,
} from '@/lib/db/schema/orders-schema';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // Get the auth token from the request headers
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token format' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }

    const { items, totalPrice } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Insert into OrderOnline
    const [createdOrder] = await db
      .insert(orderOnline)
      .values({
        boughtbyuserid: user.id,
        totalprice: totalPrice.toString(),
        orderstatus: 'Pending',
        orderdate: new Date(),
      })
      .returning({ id: orderOnline.id });

    // Insert each item into OnlineOrderStatus
    await db.insert(onlineOrderStatus).values(
      items.map((item: any) => ({
        OrderOLid: createdOrder.id,
        product: item.id,
        productcategoryid: item.productcategoryid ?? null,
        OrderStatus: 'Pending',
        quantity: item.quantity,
        unitprice: item.price.toString(),
        subtotal: (item.price * item.quantity).toString(),
      }))
    );

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}