'use client';

import { useEffect, useRef, useState } from 'react';

type ImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const MIN_SWIPE = 50;

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) >= MIN_SWIPE) {
      delta > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // reset to first image when product changes
  useEffect(() => {
    setCurrent(0);
  }, [images]);

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className={className}
        style={{ display: 'block', width: '100%' }}
      />
    );
  }

  return (
    <div className="carousel">
      {/* Track */}
      <div
        className="carousel-track"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} ${i + 1}`}
            className={`carousel-slide ${className ?? ''} ${i === current ? 'carousel-slide--active' : ''}`}
            draggable={false}
          />
        ))}

        {/* Arrows — hidden on mobile via CSS */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow--prev"
          onClick={prev}
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          type="button"
          className="carousel-arrow carousel-arrow--next"
          onClick={next}
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel-dot ${i === current ? 'carousel-dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}