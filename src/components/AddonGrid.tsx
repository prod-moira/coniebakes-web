'use client';

import { Addon } from '@/lib/db';

interface AddonGridProps {
  addons: Addon[];
  onSelectAddon: (addon: Addon) => void;
}

export function AddonGrid({ addons, onSelectAddon }: AddonGridProps) {
  if (!addons || addons.length === 0) return null;

  return (
    <div className="page-section">
      <h3 className="page-title">Extras & Add-ons</h3>
      <p className="page-subtitle">
        Complete your order with these additions!
      </p>
      
      <div className="addon-menu-grid">
        {addons.map((addon) => (
          <article
            key={addon.id}
            className="addon-menu-card"
            onClick={() => onSelectAddon(addon)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={addon.image || '/assets/logo.jpg'}
              alt={addon.name}
              className="addon-menu-card-image"
            />
            <div className="addon-menu-card-body">
              <h3>{addon.name}</h3>
              <span className="addon-menu-card-price">₱{addon.price.toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
