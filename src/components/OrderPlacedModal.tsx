'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function OrderPlacedModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('orderPlaced') === '1') {
      setOpen(true);
    }
  }, [searchParams]);

  const close = () => {
    setOpen(false);
    router.replace('/');
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <h2 className="modal-title">Your order has been placed! </h2>
        <p className="modal-message">
          Please wait for the owner to contact you via Facebook or your mobile number to
          confirm your order and arrange payment.
        </p>
        <button type="button" className="btn-secondary modal-message" style={{ margin: '0.8rem', justifyContent: 'center' }} onClick={close}>
          Close
        </button>
      </div>
    </div>
  );
}
