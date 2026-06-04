'use client';

import { useEffect, useMemo, useState } from 'react';
import { BasketIcon } from '@/components/BasketIcon';
import { ProductImage } from '@/components/ProductImage';
import { ProductModal } from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';
import { getProducts, getAddons, Product, Addon } from '@/lib/db';
import { isCookieProduct, isTwoStepProduct } from '@/lib/variant-utils';
import { AddonGrid } from '@/components/AddonGrid';
import { AddonModal } from '@/components/AddonModal';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Product | null>(null);
  const [activeAddon, setActiveAddon] = useState<Addon | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([getProducts(), getAddons()])
      .then(([productsData, addonsData]) => {
        setProducts(productsData);
        setAddons(addonsData);
      })
      .catch((err) => {
        console.error('Failed to load menu items:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const minPrices = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, Math.min(...p.variants.map((v) => v.price))])),
    [products],
  );

  const addFirstVariant = (product: Product) => {
    if (isCookieProduct(product) || isTwoStepProduct(product)) {
      setActive(product);
      return;
    }

    const variant = product.variants[0];
    addToCart(
      {
        productId: product.id,
        productName: product.name,
        variantLabel: variant.label,
        price: variant.price,
        unit: variant.unit,
      },
      1,
    );
  };

  if (loading) {
    return (
      <section className="container page-section">
        <p className="menu-loading">Loading menu...</p>
      </section>
    );
  }

  return (
    <section className="container page-section">
      <h1 className="page-title">Menu</h1>
      <p className="page-subtitle">Browse the cards to discover available flavors, sizes, and variations you can add to your order.</p>
      <div className="menu-grid">
        {products.map((product) => (
          <article key={product.id} className="menu-card" onClick={() => setActive(product)}>
            <ProductImage productId={product.id} image={product.images[0]} alt={product.name} />
            <div className="menu-card-body">
              <h3>{product.name}</h3>
              <p className="menu-card-description">{product.description}</p>
              <div className="menu-card-footer">
                <span className="menu-card-price">From ₱{minPrices[product.id]?.toLocaleString()}</span>
                  {!isCookieProduct(product) && !isTwoStepProduct(product) && (
                    <button
                      type="button"
                      className="cart-add-btn"
                      aria-label={`Add ${product.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addFirstVariant(product);
                      }}
                    >
                      <BasketIcon size={22} />
                    </button>
                  )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {active && <ProductModal product={active} onClose={() => setActive(null)} />}

      {addons && addons.length > 0 && (
        <AddonGrid addons={addons} onSelectAddon={setActiveAddon} />
      )}

      {activeAddon && (
        <AddonModal addon={activeAddon} onClose={() => setActiveAddon(null)} />
      )}
    </section>
  );
}
