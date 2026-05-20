'use client';

import { useState } from 'react';

type BasketIconProps = {
  className?: string;
  size?: number;
};

export function BasketIcon({ className = 'basket-icon', size = 22 }: BasketIconProps) {
  const [src, setSrc] = useState('/assets/basket.png');

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      onError={() => {
        if (src !== '/assets/basket.svg') setSrc('/assets/basket.svg');
      }}
    />
  );
}
