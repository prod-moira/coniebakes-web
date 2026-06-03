'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductImage } from '@/components/ProductImage';
import { ImageCarousel } from '@/components/ImageCarousel';
import { CartItem, useCart } from '@/context/CartContext';
import { Product } from '@/lib/db';
import {
  findCookieVariant,
  getCookiePacks,
  getCookieSizes,
  isCookieProduct,
  isTwoStepProduct,
  getTwoStepSizes,
  getTwoStepOptions,
  findTwoStepVariant,
} from '@/lib/variant-utils';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const cookieProduct = isCookieProduct(product);

    const twoStepProduct = isTwoStepProduct(product);

  const [cookieSize, setCookieSize] = useState('');
  const [cookiePack, setCookiePack] = useState('');
  const [twoStepSize, setTwoStepSize] = useState('');
  const [twoStepOption, setTwoStepOption] = useState('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const cookieSizes = useMemo(() => getCookieSizes(product.variants), [product.variants]);
  const cookiePacks = useMemo(
    () => (cookieSize ? getCookiePacks(product.variants, cookieSize) : []),
    [product.variants, cookieSize],
  );

  const twoStepSizes = useMemo(() => (twoStepProduct ? getTwoStepSizes(product.variants) : []), [product.variants, twoStepProduct]);
  const twoStepOptions = useMemo(
    () => (twoStepProduct && twoStepSize ? getTwoStepOptions(product.variants, twoStepSize) : []),
    [product.variants, twoStepProduct, twoStepSize],
  );

  const selectedVariant = useMemo(() => {
    if (cookieProduct) {
      if (!cookieSize || !cookiePack) return null;
      return findCookieVariant(product.variants, cookieSize, cookiePack) ?? null;
    }

    if (twoStepProduct) {
      if (!twoStepSize) return null;
      // if options exist, require option; otherwise match size-only variant
      if (twoStepOptions.length > 0) {
        if (!twoStepOption) return null;
        return findTwoStepVariant(product.variants, twoStepSize, twoStepOption) ?? null;
      }
      return findTwoStepVariant(product.variants, twoStepSize, '') ?? null;
    }

    return product.variants[selectedVariantIndex] ?? null;
  }, [cookieProduct, cookiePack, cookieSize, twoStepProduct, twoStepSize, twoStepOption, twoStepOptions.length, product.variants, selectedVariantIndex]);

  const modalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = modalRef.current;
    if (!el) return;

    const start = el.scrollTop;
    const end = el.scrollHeight - el.clientHeight;
    const distance = end - start;
    const duration = 250; // ms, increase for slower
    let startTime: number | null = null;

    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.scrollTop = start + distance * easeInOut(progress);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (cookieSize) scrollToBottom();
  }, [cookieSize]);

  useEffect(() => {
    if (twoStepSize) scrollToBottom();
  }, [twoStepSize]);

  useEffect(() => {
    if (selectedVariant) scrollToBottom();
  }, [selectedVariant]);

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
    if (twoStepProduct) {
      setTwoStepSize('');
      setTwoStepOption('');
    }
  }, [product.id, twoStepProduct]);

  useEffect(() => {
    if (cookieProduct) setCookiePack('');
  }, [cookieSize, cookieProduct]);

  useEffect(() => {
    if (twoStepProduct) setTwoStepOption('');
  }, [twoStepSize, twoStepProduct]);

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
      <div className="modal-panel" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <ImageCarousel images={product.images} alt={product.name} className="product-image" />
        <h2>{product.name}</h2>
        <table>
          <tbody>
            <tr>
              <td colSpan={2} style= {{ 
              paddingTop: '0.25rem', 
              borderBottom: '2px solid #c9a84c33', 
              paddingBottom: '0.75rem',
              fontSize: '1rem' 
              }}>
              {product.description}
              </td>
            </tr>
            <tr>
              <th>Storage</th>
              <td>{product.storage}</td>
            </tr>
            <tr>
              <th>Recommended consumption</th>
              <td>{product.shelfLife}</td>
            </tr>
          </tbody>
        </table>

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
          ) : twoStepProduct ? (
            <>
              <p className="variant-picker-label">Choose size</p>
              <div className="option-row">
                {twoStepSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`option-btn ${twoStepSize === size ? 'selected' : ''}`}
                    onClick={() => setTwoStepSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {twoStepSize && twoStepOptions.length > 0 && (
                <>
                  <p className="variant-picker-label">Choose option</p>
                  <div className="option-row">
                    {twoStepOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`option-btn ${twoStepOption === opt ? 'selected' : ''}`}
                        onClick={() => setTwoStepOption(opt)}
                      >
                        {opt}
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
                <strong>{product.name}</strong>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}> {selectedVariant.label}</p>
                <p className="selected-variant-price" style={{ fontSize: '1rem', fontWeight: 500 }}> ₱{(selectedVariant.price * quantity).toLocaleString()}</p>
                {/* <p style={{ fontSize: '0.8rem', margin: '0.2rem 0 0', opacity: 0.9}}>₱{selectedVariant.price.toLocaleString()} each</p> */}
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
