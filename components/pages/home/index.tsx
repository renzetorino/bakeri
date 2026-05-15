'use client';

import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/order-store';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/constants/product';

const Home = () => {
  const addItem = useOrderStore((state) => state.addItem);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex h-screen flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home/hero-bg.jpg')", backgroundAttachment: 'fixed' }}>
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero copy */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <h1 className="max-w-2xl text-5xl leading-tight font-bold text-white md:text-6xl">
            Freshly Baked,{' '}
            <span className="text-primary-100">Made with Love</span>
          </h1>
          <p className="max-w-lg text-lg text-white/80">
            Artisan breads, cakes, and pastries handcrafted daily. Taste the
            difference that real ingredients make.
          </p>
          <Button size="lg" className="mt-2">
            Order Now
          </Button>
        </div>
      </section>

      {/* ── Our Products ─────────────────────────────────── */}
      <section className="px-6 py-20 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-primary-700 text-3xl font-bold md:text-4xl">
              Our Products
            </h2>
            <p className="text-primary-300 mt-3 text-base">
              Every item is baked fresh — no preservatives, no shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS?.filter((_, key) => key < 6).map((product) => (
              <div
                key={product.id}
                className="border-primary-50 group flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="bg-primary-10 mb-4 flex h-24 items-center justify-center rounded-xl text-5xl">
                  {product.emoji}
                </div>
                <h3 className="text-primary-700 text-lg font-semibold">
                  {product.name}
                </h3>
                <p className="text-primary-300 mt-1 flex-1 text-sm leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary-500 text-base font-bold">
                    ₱{product.price}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        emoji: product.emoji,
                      })
                    }>
                    Add to cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/products">View all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-primary-50 border-t bg-gray-200 px-6 py-8 md:px-16">
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
          <span className="text-primary-700 text-lg font-bold">Bake RI</span>
          <p className="text-primary-300 text-sm">
            © {new Date().getFullYear()} Bake RI. All rights reserved.
          </p>
          <p className="text-primary-200 text-xs">
            Made with love & flour 🍞
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;