'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductImage } from '@/components/ProductImage';
import { CartItem, useCart } from '@/context/CartContext';
import { Product } from '@/lib/db';
import { findCookieVariant, getCookiePacks, getCookieSizes, isCookieProduct } from '@/lib/variant-utils';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const cookieProduct = isCookieProduct(product);

  const [cookieSize, setCookieSize] = useState('');
  const [cookiePack, setCookiePack] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const cookieSizes = useMemo(() => getCookieSizes(product.variants), [product.variants]);
  const cookiePacks = useMemo(
    () => (cookieSize ? getCookiePacks(product.variants, cookieSize) : []),
    [product.variants, cookieSize],
  );

  const selectedVariant = useMemo(() => {
    if (cookieProduct) {
      if (!cookieSize || !cookiePack) return null;
      return findCookieVariant(product.variants, cookieSize, cookiePack) ?? null;
    }
    return product.variants[selectedVariantIndex] ?? null;
  }, [cookieProduct, cookiePack, cookieSize, product.variants, selectedVariantIndex]);

  useEffect(() => {
    if (cookieProduct) {
      setCookieSize('');
      setCookiePack('');
    } else {
      setSelectedVariantIndex(0);
    }
    setQuantity(1);
  }, [product.id, cookieProduct]);

  useEffect(() => {
    if (cookieProduct) setCookiePack('');
  }, [cookieSize, cookieProduct]);

  const addToCartHandler = () => {
    if (!selectedVariant) return;

    const item: Omit<CartItem, 'quantity'> = {
      productId: product.id,
      productName: product.name,
      variantLabel: selectedVariant.label,
      price: selectedVariant.price,
      unit: selectedVariant.unit,
    };

    addToCart(item, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <ProductImage productId={product.id} image={product.image} alt={product.name} className="product-image" />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>
          <strong>Storage:</strong> {product.storage}
        </p>
        <p>
          <strong>Recommended consumption:</strong> {product.shelfLife}
        </p>

        <div className="variant-picker">
          {cookieProduct ? (
            <>
              <p className="variant-picker-label">Choose size</p>
              <div className="option-row">
                {cookieSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`option-btn ${cookieSize === size ? 'selected' : ''}`}
                    onClick={() => setCookieSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {cookieSize && (
                <>
                  <p className="variant-picker-label">Choose quantity pack</p>
                  <div className="option-row">
                    {cookiePacks.map((pack) => (
                      <button
                        key={pack}
                        type="button"
                        className={`option-btn ${cookiePack === pack ? 'selected' : ''}`}
                        onClick={() => setCookiePack(pack)}
                      >
                        {pack}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <p className="variant-picker-label">Choose variant</p>
              <div className="option-row">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.label}
                    type="button"
                    className={`option-btn ${selectedVariantIndex === index ? 'selected' : ''}`}
                    onClick={() => setSelectedVariantIndex(index)}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedVariant && (
            <div className="selected-variant-box">
              <div>
                <strong>{selectedVariant.label}</strong>
                <p className="selected-variant-price">₱{selectedVariant.price.toLocaleString()}</p>
              </div>
              <div className="qty-controls">
                <button type="button" onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((qty) => qty + 1)}>
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.9rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Back
          </button>
          <button type="button" className="btn-action" style={{ flex: 1 }} disabled={!selectedVariant} onClick={addToCartHandler}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
