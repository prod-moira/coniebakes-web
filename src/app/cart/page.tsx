'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <section className="container page-section">
        <div className="panel cart-empty-panel">
          <h1 className="page-title">Cart</h1>
          <p style={{ fontStyle: 'italic', margin: '1rem 0' }}>Your cart is empty.</p>
          <Link href="/menu" className="btn-action" style={{ marginTop: '1rem' }}>
            Browse Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container page-section">
      <h1 className="page-title">Your Cart</h1>
      <p className="page-subtitle">Review your selections before checkout.</p>

      <div className="panel cart-panel">
        {cart.map((item) => (
          <article key={`${item.productId}-${item.variantLabel}`} className="cart-line">
            <div>
              <strong>{item.productName}</strong>
              <p style={{ margin: '0.2rem 0 0', opacity: 0.9 }}>{item.variantLabel}</p>
            </div>
            <div className="cart-actions">
              <div className="qty-controls">
                <button type="button" onClick={() => updateQuantity(item.productId, item.variantLabel, -1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.productId, item.variantLabel, 1)}>
                  +
                </button>
              </div>
              <strong>₱{(item.quantity * item.price).toLocaleString()}</strong>
              <button type="button" className="cart-remove-btn" onClick={() => removeFromCart(item.productId, item.variantLabel)}>
                Remove
              </button>
            </div>
          </article>
        ))}

        <div className="cart-footer-bar">
          <div className="cart-total-group">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-amount">₱{cartTotal.toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="btn-action">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
