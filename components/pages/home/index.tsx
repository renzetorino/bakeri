'use client';

import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/order-store';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Variant = {
  id: number;
  size: string;
  color: string;
  price: number;
  stock?: number;
};

type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  variants: Variant[];
};

const Home = () => {
  const addItem = useOrderStore((state) => state.addItem);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show only the first 6 products
  const featuredProducts = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex h-screen flex-col bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/home/hero-bg.jpg')",
          backgroundAttachment: 'fixed',
        }}
      >
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
          <Button asChild size="lg" className="mt-2">
            <Link href="/products">Order Now</Link>
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

          {loading ? (
            <p className="text-center text-gray-400">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-primary-50 flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="mb-4 h-40 w-full rounded-xl object-cover"
                    />
                  )}

                  <h3 className="text-primary-700 text-lg font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-primary-300 mt-1 flex-1 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {/* Show lowest price */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-primary-500 text-base font-bold">
                      ₱
                      {product.variants.length > 0
                        ? Math.min(
                            ...product.variants.map((v) => Number(v.price) || 0)
                          ).toLocaleString()
                        : '0'}
                    </span>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/products">View all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Size Selection Modal ─────────────────────────── */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Choose Size</h2>

            <div className="space-y-2">
              {selectedProduct.variants.length > 0 ? (
                selectedProduct.variants.map((v) => (
                  <button
                    key={v.id}
                    className="flex w-full justify-between rounded-lg border p-2 hover:bg-gray-50"
                    onClick={() => {
                      addItem({
                        id: selectedProduct.id,
                        variantId: v.id,
                        name: `${selectedProduct.name} (${v.size})`,
                        price: Number(v.price) || 0,
                        size: v.size,
                        color: v.color,
                        imageUrl: selectedProduct.imageUrl,
                      });

                      setShowModal(false);
                      setSelectedProduct(null);
                    }}
                  >
                    <span className="font-medium">{v.size}</span>
                    <span className="text-primary-500">
                      ₱{Number(v.price).toLocaleString()}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No variants available
                </p>
              )}
            </div>

            <button
              className="mt-4 text-sm text-gray-500"
              onClick={() => {
                setShowModal(false);
                setSelectedProduct(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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