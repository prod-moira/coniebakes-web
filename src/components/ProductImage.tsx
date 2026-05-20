'use client';

import { useEffect, useState } from 'react';
import { resolveProductImage } from '@/lib/product-utils';

type ProductImageProps = {
  productId: string;
  image?: string;
  alt: string;
  className?: string;
};

export function ProductImage({ productId, image, alt, className = 'product-image' }: ProductImageProps) {
  const initialSrc = resolveProductImage({ id: productId, image });
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(resolveProductImage({ id: productId, image }));
  }, [productId, image]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== '/assets/hero.svg') setSrc('/assets/hero.svg');
      }}
    />
  );
}
