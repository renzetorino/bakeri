'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrderStore } from '@/stores/order-store';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthSession } from '@/lib/hooks/use-auth-session';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/auth/supabase-client';


const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useOrderStore((state) => state.totalItems());
  const items = useOrderStore((state) => state.items);
  const previewItems = items.slice(0, 5);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthSession();
  const username =
    user?.user_metadata?.username ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';
  const initial = user?.email?.charAt(0).toUpperCase() ?? '?';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 flex items-center border-b border-primary-100 justify-between px-8 py-5 transition-all duration-300 md:px-16 ${
        scrolled || pathname !== '/' ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}>
      <Link
        href="/"
        className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
          scrolled || pathname !== '/' ? 'text-primary-700' : 'text-white'
        }`}>
        Bake RI
      </Link>
      <div className="flex items-center gap-3">
        {/* CART (keep as is) */}
        <DropdownMenu>
          <div className="relative">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cart"
                className={`transition-colors duration-300 ${
                  scrolled || pathname !== '/'
                    ? 'text-primary-700 hover:bg-primary-50'
                    : 'text-white hover:bg-white/20'
                }`}>
                <ShoppingCart className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            {totalItems > 0 && (
              <span className="pointer-events-none absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>

          <DropdownMenuContent align="end" className="w-72 p-3">
            <DropdownMenuLabel className="px-0 pb-2 text-sm font-semibold">
              My Cart
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mb-2" />

            {items.length === 0 ? (
              <p className="text-primary-300 py-4 text-center text-sm">
                Your cart is empty.
              </p>
            ) : (
              <>
                <ul className="flex flex-col gap-2">
                  {previewItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      {/* <span className="text-xl">{item.emoji}</span> */}
                      <div className="min-w-0 flex-1">
                        <p className="text-primary-700 truncate text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-primary-300 text-xs">
                          ₱{item.price} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-primary-500 shrink-0 text-sm font-semibold">
                        ₱{item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                <DropdownMenuSeparator className="mt-3" />

                <Link
                  href="/orders/cart"
                  className="bg-primary-500 mt-2 flex w-full items-center justify-center rounded-md py-2 text-sm font-medium text-white">
                  View all cart
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AUTH SECTION */}
        {!isAuthenticated ? (
          <Button
            asChild
            variant={scrolled || pathname !== '/' ? 'default' : 'secondary'}
            size="md">
            <Link href="/auth/login">Login</Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold uppercase transition-colors ${
                  scrolled || pathname !== '/'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-700'
                }`}>
                {initial}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="truncate">
                {username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => router.push('/orders/status')}>
                Order Status
              </button>

              <DropdownMenuSeparator />

              <button
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                onClick={async () => {
                  await supabaseClient.auth.signOut();
                  router.refresh();
                  router.push('/auth/login');
                }}>
                Logout
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export { Navbar };
