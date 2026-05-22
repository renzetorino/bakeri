'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { CartItem } from '@/stores/order-store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItem[];
  totalPrice: number;
  isLoading?: boolean;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  totalPrice,
  isLoading = false,
}: CheckoutModalProps) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Summary</DialogTitle>
        </DialogHeader>

        {/* Items List */}
        <div className="space-y-4">
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="border-primary-50 flex items-start gap-4 border-b pb-3 last:border-b-0">
                {/* Item Image */}
                <div className="bg-primary-10 flex size-16 shrink-0 items-center justify-center rounded-lg">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="size-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* Item Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-primary-700 font-medium">{item.name}</p>
                  <p className="text-primary-300 text-sm">
                    ₱{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-primary-700 font-semibold tabular-nums">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-primary-100 rounded-lg border p-4">
            <div className="text-primary-300 flex justify-between text-sm">
              <span>
                Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
              </span>
              <span className="text-primary-700 font-semibold">
                ₱{totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="text-primary-300 mt-2 flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span className="text-lime-500 font-medium">Free</span>
            </div>

            <div className="border-primary-100 mt-4 flex justify-between border-t pt-4 font-bold">
              <span className="text-primary-700">Total</span>
              <span className="text-primary-700 text-lg">
                ₱{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1">
            Continue Shopping
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1">
            {isLoading ? 'Confirming...' : 'Confirm Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
