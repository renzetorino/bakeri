const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export function normalizeStatusLabel(status: string | null | undefined): string {
  if (!status) return 'Unknown';
  return STATUS_LABELS[status.trim().toLowerCase()] ?? status;
}

export function isDeliveredStatus(status: string | null | undefined): boolean {
  return status?.trim().toLowerCase() === 'delivered';
}

export function areAllItemsDelivered(
  items: Array<{ OrderStatus: string | null }>,
): boolean {
  return (
    items.length > 0 &&
    items.every((item) => isDeliveredStatus(item.OrderStatus))
  );
}

export function resolveOrderStatus(
  orderStatus: string | null,
  items: Array<{ OrderStatus: string | null }>,
): string | null {
  if (areAllItemsDelivered(items)) {
    return 'Delivered';
  }
  return orderStatus;
}
