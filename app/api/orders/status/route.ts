import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  orderOnline,
  onlineOrderStatus,
} from '@/lib/db/schema/orders-schema';
import { eq } from 'drizzle-orm';
import { areAllItemsDelivered } from '@/lib/orders/status-utils';
import { syncOrderStatusIfFullyDelivered } from '@/lib/orders/sync-order-status';

/**
 * Admin endpoint to update order item status
 * When all items are delivered, the parent order status is automatically updated
 */
export async function PUT(request: Request) {
  try {
    const { itemId, status, orderId } = await request.json();

    if (!itemId || !status || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: itemId, status, orderId' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['Pending', 'Preparing', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update the item status
    const [updated] = await db
      .update(onlineOrderStatus)
      .set({ OrderStatus: status })
      .where(eq(onlineOrderStatus.id, itemId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Order item not found' },
        { status: 404 }
      );
    }

    // Check if all items in this order are delivered
    const items = await db
      .select()
      .from(onlineOrderStatus)
      .where(eq(onlineOrderStatus.OrderOLid, orderId));

    const allDelivered = areAllItemsDelivered(items);

    if (allDelivered) {
      const [order] = await db
        .select()
        .from(orderOnline)
        .where(eq(orderOnline.id, orderId));

      await syncOrderStatusIfFullyDelivered(
        orderId,
        items,
        order?.orderstatus ?? null,
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order item status updated successfully',
      allItemsDelivered: allDelivered,
    });
  } catch (error) {
    console.error('Error updating order item status:', error);
    return NextResponse.json(
      { error: 'Failed to update order item status' },
      { status: 500 }
    );
  }
}

/**
 * Get all orders for admin dashboard
 */
export async function GET() {
  try {
    const orders = await db.select().from(orderOnline);

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select()
          .from(onlineOrderStatus)
          .where(eq(onlineOrderStatus.OrderOLid, order.id));

        return {
          ...order,
          items,
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
