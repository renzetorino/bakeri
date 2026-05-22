'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-md px-6">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="size-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <h1 className="text-primary-700 mb-2 text-3xl font-bold">
            Order Confirmed!
          </h1>
          <p className="text-primary-300 mb-6 text-base">
            Thank you for your order. Your delicious baked goods are being prepared!
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="border-primary-100 mb-8 rounded-lg border bg-primary-10 p-4">
              <p className="text-primary-300 text-sm">Order ID</p>
              <p className="text-primary-700 font-mono text-lg font-semibold">
                #{orderId}
              </p>
            </div>
          )}

          {/* Order Details */}
          <div className="border-primary-100 mb-8 space-y-3 rounded-lg border p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-primary-300">Estimated delivery:</span>
              <span className="text-primary-700 font-medium">2-3 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary-300">Status:</span>
              <span className="text-primary-700 font-medium">Pending</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary-300">Payment:</span>
              <span className="text-lime-500 font-medium">Confirmed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button size="lg" className="w-full" asChild>
              <Link href="/orders/status">View Order Status</Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
