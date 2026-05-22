import { eq, and } from 'drizzle-orm';
import z from 'zod';
import { orderOnline, onlineOrderStatus } from '@/lib/db/schema/orders-schema';
import {
  areAllItemsDelivered,
  isDeliveredStatus,
} from '@/lib/orders/status-utils';
import { syncOrderStatusIfFullyDelivered } from '@/lib/orders/sync-order-status';
import { protectedProcedure, router } from '../trpc';

export const ordersRouter = router({
  // Get all orders for the logged-in user
  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const orders = await ctx.db
      .select()
      .from(orderOnline)
      .where(eq(orderOnline.boughtbyuserid, userId));

    return orders;
  }),

  // Get order details with all items
  getOrderDetails: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // First, get the order and verify it belongs to this user
      const [order] = await ctx.db
        .select()
        .from(orderOnline)
        .where(
          and(
            eq(orderOnline.id, input.orderId),
            eq(orderOnline.boughtbyuserid, userId),
          ),
        );

      if (!order) {
        throw new Error('Order not found or unauthorized');
      }

      // Get all items in this order
      const items = await ctx.db
        .select()
        .from(onlineOrderStatus)
        .where(eq(onlineOrderStatus.OrderOLid, input.orderId));

      const orderstatus = await syncOrderStatusIfFullyDelivered(
        order.id,
        items,
        order.orderstatus,
      );

      return {
        order: { ...order, orderstatus },
        items,
      };
    }),

  // Update order item status
  updateOrderItemStatus: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        orderId: z.number(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify the order belongs to this user
      const [order] = await ctx.db
        .select()
        .from(orderOnline)
        .where(
          and(
            eq(orderOnline.id, input.orderId),
            eq(orderOnline.boughtbyuserid, userId),
          ),
        );

      if (!order) {
        throw new Error('Order not found or unauthorized');
      }

      // Update the item status
      await ctx.db
        .update(onlineOrderStatus)
        .set({ OrderStatus: input.status })
        .where(eq(onlineOrderStatus.id, input.itemId));

      // Check if all items in this order are delivered
      const items = await ctx.db
        .select()
        .from(onlineOrderStatus)
        .where(eq(onlineOrderStatus.OrderOLid, input.orderId));

      if (areAllItemsDelivered(items)) {
        await syncOrderStatusIfFullyDelivered(
          input.orderId,
          items,
          order.orderstatus,
        );
      }

      return { success: true };
    }),

  // Get order status summary
  getOrderStatusSummary: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [order] = await ctx.db
        .select()
        .from(orderOnline)
        .where(
          and(
            eq(orderOnline.id, input.orderId),
            eq(orderOnline.boughtbyuserid, userId),
          ),
        );

      if (!order) {
        throw new Error('Order not found or unauthorized');
      }

      const items = await ctx.db
        .select()
        .from(onlineOrderStatus)
        .where(eq(onlineOrderStatus.OrderOLid, input.orderId));

      const deliveredCount = items.filter((item) =>
        isDeliveredStatus(item.OrderStatus),
      ).length;
      const totalCount = items.length;
      const allDelivered = areAllItemsDelivered(items);
      const orderStatus = await syncOrderStatusIfFullyDelivered(
        order.id,
        items,
        order.orderstatus,
      );

      return {
        orderId: order.id,
        orderStatus,
        deliveredCount,
        totalCount,
        allDelivered,
        items,
      };
    }),
});
