'use client';

import { useState } from 'react';

export function BrandLogo() {
  const [src, setSrc] = useState('/assets/logo.jpg');

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Conie Bakes"
      className="brand-logo"
      onError={() => {
        if (src !== '/assets/logo.svg') setSrc('/assets/logo.svg');
      }}
    />
  );
}
