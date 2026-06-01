'use client';

import { useEffect, useState } from 'react';
import { resolveProductImages } from '@/lib/product-utils';

type ProductImageProps = {
  productId: string;
  image?: string;
  alt: string;
  className?: string;
};

export function ProductImage({ productId, image, alt, className = 'product-image' }: ProductImageProps) {
  const initialSrc = resolveProductImages({ id: productId, images: image ? [image] : [] })[0];
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(resolveProductImages({ id: productId, images: image ? [image] : [] })[0]);
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
