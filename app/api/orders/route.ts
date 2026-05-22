import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  orderOnline,
  onlineOrderStatus,
} from '@/lib/db/schema/orders-schema';
import { eq } from 'drizzle-orm';
import { syncOrderStatusIfFullyDelivered } from '@/lib/orders/sync-order-status';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
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

    const orders = await db
      .select()
      .from(orderOnline)
      .where(eq(orderOnline.boughtbyuserid, user.id));

    const ordersWithSyncedStatus = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select()
          .from(onlineOrderStatus)
          .where(eq(onlineOrderStatus.OrderOLid, order.id));

        const orderstatus = await syncOrderStatusIfFullyDelivered(
          order.id,
          items,
          order.orderstatus,
        );

        return { ...order, orderstatus };
      }),
    );

    return NextResponse.json(ordersWithSyncedStatus);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
