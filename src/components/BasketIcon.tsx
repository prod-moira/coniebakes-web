'use client';

import { useEffect, useState } from 'react';

type BasketIconProps = {
  className?: string;
  size?: number;
  src?: string;
};

export function BasketIcon({ className = 'basket-icon', size = 22, src = '/assets/basket.png' }: BasketIconProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt=""
      width={size}
      height={size}
      className={className}
      onError={() => {
        if (currentSrc !== '/assets/basket.svg') setCurrentSrc('/assets/basket.svg');
      }}
    />
  );
}
