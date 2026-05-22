'use client';

import { Button } from '@/components/ui/button';
import {
  isDeliveredStatus,
  normalizeStatusLabel,
  resolveOrderStatus,
} from '@/lib/orders/status-utils';
import { X, Package, CheckCircle, Clock, Truck } from 'lucide-react';

interface OrderItem {
  id: number;
  product: number | null;
  quantity: number | null;
  unitprice: string | null;
  subtotal: string | null;
  OrderStatus: string | null;
  productDetails?: {
    productid?: number;
    productname?: string;
    description?: string;
  } | null;
  categoryDetails?: {
    productcategoryid?: number;
    color?: string;
    agesize?: string;
  } | null;
}

interface OrderStatusModalProps {
  isOpen: boolean;
  orderId: number;
  orderStatus: string | null;
  items: OrderItem[];
  onClose: () => void;
}

const StatusIcon = ({ status }: { status: string | null }) => {
  switch (normalizeStatusLabel(status)) {
    case 'Delivered':
      return <CheckCircle className="size-5 text-green-500" />;
    case 'Pending':
      return <Clock className="size-5 text-yellow-500" />;
    case 'Preparing':
      return <Package className="size-5 text-blue-500" />;
    case 'Shipped':
      return <Truck className="size-5 text-purple-500" />;
    default:
      return <Clock className="size-5 text-gray-500" />;
  }
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const label = normalizeStatusLabel(status);
  const statusStyles = {
    Delivered: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Preparing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[label as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}
    >
      {label}
    </span>
  );
};

export function OrderStatusModal({
  isOpen,
  orderId,
  orderStatus,
  items,
  onClose,
}: OrderStatusModalProps) {
  if (!isOpen) return null;

  const deliveredCount = items.filter((item) =>
    isDeliveredStatus(item.OrderStatus),
  ).length;
  const totalCount = items.length;
  const displayOrderStatus = resolveOrderStatus(orderStatus, items);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
        >
          <X className="size-6" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="mb-2 text-2xl font-bold text-primary-700">
            Order Details
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-primary-300">Order ID: #{orderId}</p>
            <StatusBadge status={displayOrderStatus} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-primary-700">
              Delivery Progress
            </span>
            <span className="text-primary-300">
              {deliveredCount} of {totalCount} items delivered
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(deliveredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="mb-4 font-semibold text-primary-700">Items</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-lg border border-primary-100 p-4"
              >
                <div className="flex flex-1 items-center gap-4">
                  <StatusIcon status={item.OrderStatus} />
                  <div className="flex-1">
                    <p className="font-medium text-primary-700">
                      {item.productDetails?.productname || `Product ${item.product}`}
                    </p>
                    <div className="mt-1 space-y-1 text-sm text-primary-300">
                      <p>Quantity: {item.quantity}</p>
                      {item.categoryDetails && (
                        <>
                          <p>
                            Size: {item.categoryDetails.agesize || 'N/A'}
                          </p>
                          <p>
                            Color: {item.categoryDetails.color || 'N/A'}
                          </p>
                        </>
                      )}
                      <p>Unit Price: ${item.unitprice}</p>
                      <p>Subtotal: ${item.subtotal}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <StatusBadge status={item.OrderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-primary-100 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <a href="/">Continue Shopping</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
