'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function OrderPlacedModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('orderPlaced') === '1') {
      sessionStorage.removeItem('orderPlaced');
      setOpen(true);
    }
  }, []);

  const close = () => {
    setOpen(false);
    router.replace('/');
  };

  // Only render after hydration to prevent mismatch
  if (!mounted || !open) return null;

  return (
    <div className="modal-overlay" style={{ pointerEvents: 'auto' }}>
      <div className="modal-panel">
        <h2 className="modal-title">Your order has been placed! </h2>
        <p className="modal-message">
          Please wait for the admin to contact you via Facebook/Instagram or your mobile number to
          confirm your order and arrange payment.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}>
          <button type="button" className="btn-secondary" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
