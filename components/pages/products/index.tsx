'use client';

import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/order-store';
import { useEffect, useState, useMemo } from 'react';

const ALL = 'all';
 type Variant = {
    id: number;
    size: string;
    color: string;
    price: number;
    stock?: number;
    productcategoryid?: number;
  };

  type Product = {
    id: number;
    name: string;
    description: string;
    variants: Variant[];
    imageUrl: string | null;
  };


const ProductPage = () => {
  const addItem = useOrderStore((state) => state.addItem);
  const [activeColor, setActiveColor] = useState(ALL);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    if (activeColor === ALL) return products;

    return products.filter((p) =>
      (p.variants ?? []).some((v) => v.color === activeColor)
    );
  }, [products, activeColor]);

  const COLORS = useMemo(() => {
    return Array.from(
      new Set(
        products
          .flatMap((p) => p.variants ?? [])
          .map((v) => v?.color)
          .filter((c): c is string => typeof c === 'string' && c.length > 0)
      )
    );
  }, [products]);

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
          {[ALL, ...COLORS].map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeColor === color
                  ? 'bg-primary-500 text-white'
                  : 'border-primary-100 text-primary-400 hover:bg-primary-20 border bg-white'
              }`}
            >
              {color}
            </button>
          ))}
        </div>

        {/* Product count */}
        <p className="text-primary-300 mb-6 text-sm">
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {activeColor !== ALL ? ` in ${activeColor}` : ''}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
                key={product.id}
                className="border-primary-50 flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mb-4 h-40 w-full object-cover rounded-xl"
                  />
                )}
                <h3 className="text-primary-700 text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="text-primary-300 mt-1 flex-1 text-sm leading-relaxed">
                  {product.description}
                </p>

                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowModal(true);
                  }}
                >
                  Add to cart
                </Button>
              </div>
          ))}
        </div>
      </div>
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-lg font-bold mb-4">
              Choose Size
            </h2>

           <div className="space-y-2">
            {(selectedProduct.variants?.length ? selectedProduct.variants : []).length > 0 ? (
              selectedProduct?.variants?.map((v) => (
                <button
                  key={v.id}
                  className="w-full border p-2 rounded-lg flex justify-between hover:bg-gray-50"
                  onClick={() => {
                    addItem({
                      id: selectedProduct.id,
                      variantId: v.id,
                      name: `${selectedProduct.name} (${v.size})`,
                      price: v.price,
                      size: v.size,
                      color: v.color,
                      imageUrl: selectedProduct.imageUrl,
                      productcategoryid: v.productcategoryid,
                    });

                    setShowModal(false);
                    setSelectedProduct(null);
                  }}
                >
                  <span>{v.size}</span>
                  <span>₱{v.price}</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400">No variants available</p>
            )}
          </div>

            <button
              className="mt-4 text-sm text-gray-500"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </main>
  );
};

export default ProductPage;
