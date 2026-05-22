'use client';

import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/order-store';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/lib/hooks/use-auth-session';
import { CheckoutModal } from '@/components/checkout-modal';
import { useState } from 'react';
import { supabaseClient } from '@/lib/auth/supabase-client';

const CartPage = () => {
  const router = useRouter();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useOrderStore();
  
  const { isAuthenticated } = useAuthSession();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    try {
      // Get the user's session token
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No session or access token found:', { session });
        throw new Error('Not authenticated. Please login again.');
      }

      console.log('Sending checkout request with token:', session.access_token.substring(0, 20) + '...');

      // Call the checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            productcategoryid: item.productcategoryid ?? null,
          })),
          totalPrice: totalPrice(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Checkout error response:', error);
        throw new Error(error.error || 'Failed to create order');
      }

      const result = await response.json();
      
      // Clear the cart and close modal
      clearCart();
      setIsCheckoutModalOpen(false);
      
      // Navigate to success page (you can create this later)
      router.push(`/orders/success?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Error confirming order:', error);
      alert(error instanceof Error ? error.message : 'Failed to confirm order');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-primary-700 text-2xl font-bold">My Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-primary-300 hover:text-red-500 text-sm transition-colors">
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <span className="text-6xl">🛒</span>
            <p className="text-primary-700 text-lg font-medium">
              Your cart is empty.
            </p>
            <p className="text-primary-300 text-sm">
              Go back and add some delicious baked goods!
            </p>
            <Button asChild size="md" className="mt-2">
              <Link href="/">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* ── Item list ── */}
            <ul className="divide-primary-50 divide-y">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-5">
                  {/* Emoji thumbnail */}
                  <div className="bg-primary-10 flex size-14 shrink-0 items-center justify-center rounded-xl text-3xl">
                    <img
                        src={item.imageUrl || '/images/placeholder.png'}
                        alt={item.name}
                      />
                  </div>

                  {/* Name + price */}
                  <div className="min-w-0 flex-1">
                    <p className="text-primary-700 truncate font-medium">
                      {item.name}
                    </p>
                    <p className="text-primary-300 text-sm">
                      ₱{item.price.toLocaleString()} each
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="border-primary-100 flex items-center gap-1 rounded-md border">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="text-primary-400 hover:text-primary-700 flex size-8 items-center justify-center transition-colors">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="text-primary-700 w-6 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="text-primary-400 hover:text-primary-700 flex size-8 items-center justify-center transition-colors">
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="text-primary-700 w-20 text-right text-sm font-semibold tabular-nums">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </span>

                  {/* Remove */}
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
                    className="text-primary-200 hover:text-red-500 ml-1 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Order summary ── */}
            <div className="border-primary-100 mt-6 rounded-2xl border p-6">
              <h2 className="text-primary-700 mb-4 text-base font-semibold">
                Order Summary
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-primary-300 flex justify-between">
                  <span>
                    Subtotal (
                    {items.reduce((s, i) => s + i.quantity, 0)} item
                    {items.reduce((s, i) => s + i.quantity, 0) !== 1
                      ? 's'
                      : ''}
                    )
                  </span>
                  <span>₱{totalPrice().toLocaleString()}</span>
                </div>
                <div className="text-primary-300 flex justify-between">
                  <span>Delivery fee</span>
                  <span className="text-lime-500 font-medium">Free</span>
                </div>
              </div>
              <div className="border-primary-100 mt-4 flex justify-between border-t pt-4 font-bold">
                <span className="text-primary-700">Total</span>
                <span className="text-primary-700 text-lg">
                  ₱{totalPrice().toLocaleString()}
                </span>
              </div>
              <Button size="lg" className="mt-5 w-full" onClick={handleProceedToCheckout} disabled={items.length === 0}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmOrder}
        items={items}
        totalPrice={totalPrice()}
        isLoading={isConfirming}
      />
    </div>
  );
};

export default CartPage;
