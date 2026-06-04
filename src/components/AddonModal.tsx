'use client';

import { useState } from 'react';
import { Addon } from '@/lib/db';
import { useCart } from '@/context/CartContext';

interface AddonModalProps {
  addon: Addon;
  onClose: () => void;
}

export function AddonModal({ addon, onClose }: AddonModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(
      {
        productId: addon.id,
        productName: addon.name,
        variantLabel: addon.name,
        price: addon.price,
        unit: 'pc',
        isAddon: true,
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={addon.image || '/assets/logo.jpg'}
          alt={addon.name}
          className="product-image"
          style={{ height: '290px', objectFit: 'contain', width: '100%', borderRadius: '10px' }}
        />
        <h2 style={{ marginTop: '1rem' }}>{addon.name}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderBottom: 'none', paddingBottom: '1rem' }}>
          <div>
            <strong style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>
              ₱{(addon.price * quantity).toLocaleString()}
            </strong>
            {/* <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', opacity: 0.85 }}>
              ₱{addon.price.toLocaleString()} each
            </p> */}
          </div>
          <div className="qty-controls">
            <button
              type="button"
              onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((qty) => qty + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Back
          </button>
          <button
            type="button"
            className="btn-action"
            style={{ flex: 1 }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
