'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { placeOrder } from '@/lib/db';
import { sanitizePhoneInput } from '@/lib/phone';

const MIN_DAYS = 3;
const MAX_DAYS = 30;
const WINDOW_SIZE = 7;

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [offset, setOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [facebook, setFacebook] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const hasLargeQuantity = cart.some(item => item.quantity >= 6);

  const dateList = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(today);
    start.setDate(today.getDate() + MIN_DAYS + offset);

    return Array.from({ length: WINDOW_SIZE }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
      return diff >= MIN_DAYS && diff <= MAX_DAYS ? date : null;
    }).filter((date): date is Date => date !== null);
  }, [offset]);

  const maxOffset = MAX_DAYS - MIN_DAYS - WINDOW_SIZE + 1;

  if (!cart.length) {
    return (
      <section className="container page-section">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Your cart is empty.</p>
        <Link href="/menu" className="btn-secondary after-checkout-btn">
          Go to menu
        </Link>
      </section>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !name.trim() || !phone.trim() || !facebook.trim() || !address.trim() || !agree) {
      setMessage('Please complete all required fields.');
      return;
    }

    setSending(true);
    setMessage('');

    const result = await placeOrder({
      customerName: name.trim(),
      phoneNumber: phone.trim(),
      facebookLink: facebook.trim(),
      email: email.trim() || null,
      address: address.trim(),
      deliveryDate: selectedDate,
      deliveryTime: selectedTime || null,
      items: cart,
      total: cartTotal,
      specialInstructions: specialInstructions.trim() || null,
    });

    if (!result.success) {
      setMessage(result.error ?? 'Could not place order.');
      setSending(false);
      return;
    }

    await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name.trim(),
        phoneNumber: phone.trim(),
        facebookLink: facebook.trim(),
        email: email.trim(),
        address: address.trim(),
        deliveryDate: selectedDate,
        deliveryTime: selectedTime || null,
        items: cart,
        total: cartTotal,
        specialInstructions: specialInstructions.trim(),
      }),
    });

    clearCart();
    router.push('/?orderPlaced=1');
  };

  return (
    <section className="container page-section">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Review your order and share delivery details.</p>

      <div className="checkout-layout">
        <aside className="panel checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={`${item.productId}-${item.variantLabel}`} className="summary-line">
              <span>
                {item.productName} — {item.variantLabel} x{item.quantity}
              </span>
              <strong>₱{(item.price * item.quantity).toLocaleString()}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₱{cartTotal.toLocaleString()}</span>
          </div>
        </aside>

        <form className="panel checkout-form" onSubmit={submit}>
          <h2>Customer Details</h2>

          <div className="form-field">
            <label htmlFor="customer-name">Customer name *</label>
            <input id="customer-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{11}"
              maxLength={11}
              required
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
            />
          </div>

          <div className="form-field">
            <label htmlFor="facebook">Facebook profile link *</label>
            <input id="facebook" type="url" required value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="address">Delivery address *</label>
            <textarea id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="instructions">Special instructions (optional)</label>
            <textarea id="instructions" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
          </div>

          <p className="note-box">
            After placing your order, the owner will reach out to you via your provided <span>Facebook</span> or <span>mobile number</span> to
            confirm your order and arrange payment.
          </p>

          <label className="checkbox-field">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>I agree to be contacted via <b>Facebook</b> or <b>mobile number</b> for order confirmation.</span>
          </label>

          <div className="date-picker">
            <div className="date-picker-header">
              <h3>Preferred delivery date *</h3>
              <div className="date-nav">
                <button type="button" className="btn-secondary" disabled={offset <= 0} onClick={() => setOffset((prev) => Math.max(0, prev - WINDOW_SIZE))}>
                  &lt;
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={offset >= maxOffset}
                  onClick={() => setOffset((prev) => Math.min(maxOffset, prev + WINDOW_SIZE))}
                >
                  &gt;
                </button>
              </div>
            </div>
            <div className="date-grid">
              {dateList.map((date) => {
                const iso = formatLocalDate(date);
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`date-btn ${selectedDate === iso ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(iso)}
                  >
                    <span>{formatDateLabel(date)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="delivery-time" className="date-picker-header">
              <h3 style={{ marginTop: "0.5rem"}}>Preferred delivery time *</h3>
            </label>
            <select required id="delivery-time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="" hidden>Select a time</option>
              {(() => {
                const opts = [];
                const start = new Date();
                start.setHours(8, 0, 0, 0);
                const end = new Date();
                end.setHours(21, 0, 0, 0);
                for (let t = start.getTime(); t <= end.getTime(); t += 30 * 60 * 1000) {
                  const d = new Date(t);
                  const label = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                  const value = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                  opts.push(
                    <option key={value} value={value}>
                      {label}
                    </option>,
                  );
                }
                return opts;
              })()}
            </select>
          </div>

          {hasLargeQuantity && (
            <p className="note-box" style={{ marginTop: '0.6rem' }}>
              Note: Preferred delivery date might be adjusted due to order quantity.
            </p>
          )}

          {message && <p className="alert-error">{message}</p>}

          <button className="btn-action" type="submit" disabled={sending || !selectedDate || !agree}>
            {sending ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </section>
  );
}