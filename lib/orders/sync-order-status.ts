import { db } from '@/lib/db';
import { orderOnline } from '@/lib/db/schema/orders-schema';
import { eq } from 'drizzle-orm';
import {
  areAllItemsDelivered,
  isDeliveredStatus,
} from '@/lib/orders/status-utils';

export async function syncOrderStatusIfFullyDelivered(
  orderId: number,
  items: Array<{ OrderStatus: string | null }>,
  currentOrderStatus: string | null,
): Promise<string | null> {
  if (!areAllItemsDelivered(items)) {
    return currentOrderStatus;
  }

  if (!isDeliveredStatus(currentOrderStatus)) {
    await db
      .update(orderOnline)
      .set({ orderstatus: 'Delivered' })
      .where(eq(orderOnline.id, orderId));

    return 'Delivered';
  }

  return currentOrderStatus;
}
