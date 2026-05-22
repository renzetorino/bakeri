import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  orderOnline,
  onlineOrderStatus,
} from '@/lib/db/schema/orders-schema';
import { products, productcategory } from '@/lib/db/schema/products-schema';
import { eq, and } from 'drizzle-orm';
import { syncOrderStatusIfFullyDelivered } from '@/lib/orders/sync-order-status';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params since it's a Promise in Next.js 15+
    const { id } = await params;

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

    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Fetch the order and verify it belongs to this user
    const [order] = await db
      .select()
      .from(orderOnline)
      .where(
        and(
          eq(orderOnline.id, orderId),
          eq(orderOnline.boughtbyuserid, user.id)
        )
      );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch all items in this order with product and category details
    const items = await db
      .select()
      .from(onlineOrderStatus)
      .leftJoin(
        products,
        eq(onlineOrderStatus.product, products.productid)
      )
      .leftJoin(
        productcategory,
        eq(onlineOrderStatus.productcategoryid, productcategory.productcategoryid)
      )
      .where(eq(onlineOrderStatus.OrderOLid, orderId));

    // Transform the joined data into a cleaner format
    const transformedItems = items.map((item) => ({
      ...item.OnlineOrderStatus,
      productDetails: item.products,
      categoryDetails: item.productcategory,
    }));

    const orderstatus = await syncOrderStatusIfFullyDelivered(
      orderId,
      transformedItems,
      order.orderstatus,
    );

    return NextResponse.json({
      order: { ...order, orderstatus },
      items: transformedItems,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
