'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { sanitizePhoneInput } from '@/lib/phone';
import { isMockFirebase } from '@/lib/firebase';
import { placeOrder, getBlockedDatesConfig, type BlockedDatesConfig, normalizeDate } from '@/lib/db';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/lib/schemas/formSchema';

const MIN_DAYS = 3;
const MAX_DAYS = 30;
const WINDOW_SIZE = 7;

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [offset, setOffset] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [blockedConfig, setBlockedConfig] =
    useState<BlockedDatesConfig>({
      blockedDays: [],
      blockedDates: new Set(),
      overrideDates: new Set(),
    });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      socialUrl: '',
      address: '',
      payment: '',
      deliveryDate: '',
      deliveryTime: '',
      specialInstructions: '',
      agree: false,
    },
  });

  const selectedDate = watch('deliveryDate');
  const selectedTime = watch('deliveryTime');
  const payment = watch('payment');
  const agree = watch('agree');

  const hasLargeQuantity = cart.some((item) => item.quantity >= 6);

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

  const hasOnlyAddons = useMemo(() => cart.length > 0 && cart.every((item) => item.isAddon), [cart]);

  useEffect(() => {
    if ((!cart.length || hasOnlyAddons) && !orderPlaced) {
      router.replace('/cart');
    }
  }, [cart, hasOnlyAddons, orderPlaced, router]);
  
  useEffect(() => {
    getBlockedDatesConfig().then(setBlockedConfig);
  }, []);

 const submit = async (data: CheckoutFormData) => {
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: data.name.trim(),
      phoneNumber: data.phone.trim(),
      socialUrl: data.socialUrl.trim(),
      email: data.email.trim() || null,
      address: data.address.trim(),
      payment: data.payment.trim(),
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime || null,
      specialInstructions: data.specialInstructions?.trim() || null,
      items: cart,
      total: cartTotal,
    }),
  });

  const result = await res.json();

  if (!result.success) {
    if (result.error === 'RATE_LIMITED') {
      sessionStorage.setItem('cb_last_order', Date.now().toString());
      router.replace('/cart');
    }
    return;
  }

  // Mock mode — placeOrder handles Firestore write locally
  if (isMockFirebase) {
    await placeOrder({
      customerName: data.name.trim(),
      phoneNumber: data.phone.trim(),
      socialUrl: data.socialUrl.trim(),
      email: data.email.trim() || null,
      address: data.address.trim(),
      payment: data.payment.trim(),
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime || null,
      items: cart,
      total: cartTotal,
      specialInstructions: data.specialInstructions?.trim() || null,
    });
  }

  setOrderPlaced(true);
  clearCart();
  sessionStorage.setItem('orderPlaced', '1');
  sessionStorage.setItem('cb_last_order', Date.now().toString());
  router.replace('/');
};

  return (
    <section className="container page-section">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Review your order and enter delivery details.</p>

      <div className="checkout-layout">
        {/* Order Summary */}
        <aside className="panel checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((item, index) => (
            <div
              key={`${item.productId}-${item.variantLabel}`}
              className={`summary-line${index === cart.length - 1 ? ' summary-line--last' : ''}`}
            >
              <span>
                {item.productName}{!item.isAddon && ` — ${item.variantLabel}`} x{item.quantity}
              </span>
              <strong>₱{(item.price * item.quantity).toLocaleString()}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₱{cartTotal.toLocaleString()}</span>
          </div>
        </aside>

        {/* Checkout Form */}
        <form className="panel checkout-form" onSubmit={handleSubmit(submit)}>
          <h2>Customer Details</h2>

          <div className={errors.name ? 'form-field-error' : 'form-field'}>
            <label htmlFor="name">Customer Name *</label>
            <input id="name" maxLength={50} {...register('name')} />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <div className={errors.email ? 'form-field-error' : 'form-field'}>
            <label htmlFor="email">Email *</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className={errors.socialUrl ? 'form-field-error' : 'form-field'}>
            <label htmlFor="socialUrl">Facebook or Instagram profile link *</label>
            <input
              id="socialUrl"
              type="url"
              {...register('socialUrl')}
            />
            {errors.socialUrl && <p className="error">{errors.socialUrl.message}</p>}
          </div>

          <div className={errors.phone ? 'form-field-error' : 'form-field'}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              maxLength={11}
              {...register('phone', {
                onChange: (e) => {
                  e.target.value = sanitizePhoneInput(e.target.value);
                },
              })}
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>

          <div className={errors.address ? 'form-field-error' : 'form-field'}>
            <label htmlFor="address">Delivery address *</label>
            <textarea id="address" {...register('address')} minLength={10} maxLength={200} />
            {errors.address && <p className="error">{errors.address.message}</p>}
          </div>

          <div className={errors.payment ? 'form-field-error' : 'form-field'}>
            <label htmlFor="payment">Payment method *</label>
            <select
              id="payment"
              style={{ color: payment ? 'var(--text)' : 'gray' }}
              {...register('payment')}
            >
              <option value="" disabled hidden>
                Select a payment method
              </option>
              <option value="GCash" style={{ color: 'var(--text)' }}>GCash</option>
              <option value="PayMaya" style={{ color: 'var(--text)' }}>PayMaya</option>
              <option value="Bank Transfer (BDO/BPI)" style={{ color: 'var(--text)' }}>Bank Transfer (BDO/BPI)</option>
              <option value="Other" style={{ color: 'var(--text)' }}>Other</option>
            </select>
            {errors.payment && <p className="error">{errors.payment.message}</p>}
          </div>

          <p className="note-box" style={{ marginBottom: '0.6rem' }}>
            Delivery fees are shouldered by the customer and will be discussed upon order confirmation.
          </p>

          {/* Date Picker */}
          <div className="date-picker">
            <div className="date-picker-header">
              <h3>Preferred delivery date *</h3>
              <div className="date-nav">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={offset <= 0}
                  onClick={() => setOffset((prev) => Math.max(0, prev - WINDOW_SIZE))}
                >
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
              const normalizedDate = normalizeDate(date);
              const dayOfWeek = date.getDay();
              const isForcedOpen =
                blockedConfig.overrideDates.has(normalizedDate);
              const isHardBlocked =
                blockedConfig.blockedDates.has(normalizedDate);
              const isRecurringBlocked =
                blockedConfig.blockedDays.includes(dayOfWeek);
              if (isRecurringBlocked && !isForcedOpen) {
                return null;
              }
              const isBlocked =
                !isForcedOpen && isHardBlocked;

            return (
              <button
                key={normalizedDate}
                type="button"
                className={`date-btn ${selectedDate === normalizedDate ? 'selected' : ''}`}
                disabled={isBlocked}
                onClick={() =>
                  setValue('deliveryDate', normalizedDate, { shouldValidate: true })
                }
              >
                <span>{formatDateLabel(date)}</span>
              </button>
            );
            })}

            </div>
            {errors.deliveryDate && <p className="error">{errors.deliveryDate.message}</p>}
          </div>

          {/* Time Picker */}
          <div className="form-field">
            <label htmlFor="delivery-time" className="date-picker-header">
              <h3 style={{ marginTop: '0.5rem' }}>Preferred delivery time *</h3>
            </label>
            <select
              id="delivery-time"
              style={{ color: selectedTime ? 'var(--text)' : 'gray' }}
              {...register('deliveryTime')}
            >
              <option value="" hidden disabled>Select a time</option>
              {(() => {
                const opts = [];
                const start = new Date();
                start.setHours(14, 0, 0, 0);
                const end = new Date();
                end.setHours(18, 30, 0, 0);
                for (let t = start.getTime(); t <= end.getTime(); t += 30 * 60 * 1000) {
                  const d = new Date(t);
                  const label = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                  const value = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                  opts.push(
                    <option key={value} value={value} style={{ color: 'var(--text)' }}>
                      {label}
                    </option>,
                  );
                }
                return opts;
              })()}
            </select>
            {errors.deliveryTime && <p className="error">{errors.deliveryTime.message}</p>}
          </div>

          {hasLargeQuantity && (
            <p
              className="note-box"
              style={{ margin: '0.2rem', backgroundColor: 'var(--dark-red)', fontStyle: 'italic' }}
            >
              Preferred delivery date might be adjusted due to order quantity.
            </p>
          )}

          <div className={errors.specialInstructions ? 'form-field-error' : 'form-field'}>
            <label htmlFor="instructions">Special instructions (optional)</label>
            <textarea id="instructions" {...register('specialInstructions')} />
              {errors.specialInstructions && <p className="error">{errors.specialInstructions.message}</p>}
          </div>

          <p className="note-box" style={{ margin: '0.1rem 0 0 0', backgroundColor: 'var(--dark-red)' }}>
            Your information will be used solely for order processing and delivery. It will not be shared with third parties.
          </p>

          <p className="note-box" style={{ margin: '0 0 0.1rem 0', backgroundColor: 'var(--dark-red)' }}>
            After placing your order, the admin will reach out to you via your provided{' '}
            <span>Facebook/Instagram</span> or <span>mobile number</span> to confirm your order and arrange payment.
          </p>

          <label className="checkbox-field">
            <input type="checkbox" {...register('agree')} />
            <span>
              I agree to be contacted via <b>Facebook/Instagram</b> or <b>mobile number</b> for order confirmation.
            </span>
          </label>
          {errors.agree && <p className="error">{errors.agree.message}</p>}

          <button
            className="btn-action"
            type="submit"
            disabled={isSubmitting || !selectedDate || !selectedTime || !agree}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </section>
  );
}