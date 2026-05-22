'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrderStatusModal } from '@/components/order-status-modal';
import { useAuthSession } from '@/lib/hooks/use-auth-session';
import { supabaseClient } from '@/lib/auth/supabase-client';
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  ArrowLeft,
  Loader,
} from 'lucide-react';

interface OrderData {
  id: number;
  orderstatus: string | null;
  totalprice: string | null;
  createdAt: Date;
  boughtbyuserid: string;
  orderdate: Date | null;
}

interface OrderItem {
  id: number;
  product: number | null;
  quantity: number | null;
  unitprice: string | null;
  subtotal: string | null;
  OrderStatus: string | null;
}

const StatusIcon = ({ status }: { status: string | null }) => {
  switch (status) {
    case 'Delivered':
      return <CheckCircle className="size-6 text-green-500" />;
    case 'Pending':
      return <Clock className="size-6 text-yellow-500" />;
    case 'Preparing':
      return <Package className="size-6 text-blue-500" />;
    case 'Shipped':
      return <Truck className="size-6 text-purple-500" />;
    default:
      return <Clock className="size-6 text-gray-500" />;
  }
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const statusStyles = {
    Delivered: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Preparing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

export default function OrderStatusPage() {
  const { isAuthenticated, isPending: authPending } = useAuthSession();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || authPending) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Get the session to extract the access token
        const { data } = await supabaseClient.auth.getSession();
        const token = data.session?.access_token;
        
        if (!token) {
          throw new Error('No access token available');
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data_orders = await response.json();
        setOrders(data_orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, authPending]);

  const handleOpenModal = async (order: OrderData) => {
    try {
      setSelectedOrder(order);
      
      // Get the session to extract the access token
      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/orders/${order.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data_details = await response.json();
      setSelectedOrder({
        ...order,
        orderstatus: data_details.order.orderstatus,
      });
      setSelectedOrderItems(data_details.items);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setSelectedOrderItems([]);
  };

  if (authPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="size-8 animate-spin text-primary-700" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-primary-300">
          Please log in to view your orders
        </p>
        <Button asChild>
          <Link href="/auth/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-primary-700 text-3xl font-bold">Your Orders</h1>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="size-8 animate-spin text-primary-700" />
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-primary-200 bg-primary-10/50 shadow-sm">
            <div className="border-b border-primary-100 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-primary-700">
                Order History
                <span className="ml-2 text-sm font-normal text-primary-300">
                  ({orders.length})
                </span>
              </h2>
            </div>
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-4">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 rounded-lg border border-primary-100 bg-white p-6 transition hover:border-primary-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-6">
                      <div className="rounded-lg bg-primary-10 p-3">
                        <StatusIcon status={order.orderstatus} />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-primary-700">
                            Order #{order.id}
                          </h3>
                          <StatusBadge status={order.orderstatus} />
                        </div>
                        <div className="space-y-1 text-sm text-primary-300">
                          <p>
                            Order Date:{' '}
                            {order.orderdate
                              ? new Date(order.orderdate).toLocaleDateString()
                              : 'N/A'}
                          </p>
                          <p>Total: ${order.totalprice}</p>
                          <p>
                            Created:{' '}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOpenModal(order)}
                      className="w-full shrink-0 whitespace-nowrap sm:w-auto"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-primary-200 py-12 text-center">
            <Package className="mx-auto mb-4 size-12 text-primary-300" />
            <p className="mb-4 text-primary-300">No orders found</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Order Status Modal */}
      {selectedOrder && (
        <OrderStatusModal
          isOpen={isModalOpen}
          orderId={selectedOrder.id}
          orderStatus={selectedOrder.orderstatus}
          items={selectedOrderItems}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
