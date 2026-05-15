'use client';

import { Button } from '@/components/ui/button';
import { CATEGORIES, PRODUCTS } from '@/lib/constants/product';
import { useOrderStore } from '@/stores/order-store';
import { useState } from 'react';

const ALL = 'All';

const ProductPage = () => {
  const addItem = useOrderStore((state) => state.addItem);
  const [activeCategory, setActiveCategory] = useState(ALL);

  const filtered =
    activeCategory === ALL
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-primary-700 text-3xl font-bold md:text-4xl">
            Our Products
          </h1>
          <p className="text-primary-300 mt-3 text-base">
            Every item is baked fresh — no preservatives, no shortcuts.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {[ALL, ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'border-primary-100 text-primary-400 hover:bg-primary-20 border bg-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product count */}
        <p className="text-primary-300 mb-6 text-sm">
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== ALL ? ` in ${activeCategory}` : ''}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="border-primary-50 flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="bg-primary-10 mb-4 flex h-24 items-center justify-center rounded-xl text-5xl">
                {product.emoji}
              </div>
              <span className="text-primary-200 mb-1 text-xs font-medium uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="text-primary-700 text-lg font-semibold">
                {product.name}
              </h3>
              <p className="text-primary-300 mt-1 flex-1 text-sm leading-relaxed">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-primary-500 text-base font-bold">
                  ₱{product.price.toLocaleString()}
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
      </div>
    </main>
  );
};

export default ProductPage;
