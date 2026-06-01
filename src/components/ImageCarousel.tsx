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

    const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;

    if (touchStartX.current !== null) {
    const deltaX = Math.abs(touchStartX.current - e.touches[0].clientX);
    const deltaY = Math.abs((touchStartY.current ?? 0) - e.touches[0].clientY);

    if (deltaX > deltaY) {
        e.preventDefault(); // horizontal swipe — block scroll
    }
    }
    };

    const touchStartY = useRef<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY; // add this
    touchEndX.current = null;
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
const trackRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const el = trackRef.current;
  if (!el) return;
  const handler = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = Math.abs(touchStartX.current - e.touches[0].clientX);
    const deltaY = Math.abs((touchStartY.current ?? 0) - e.touches[0].clientY);
    if (deltaX > deltaY) e.preventDefault();
    touchEndX.current = e.touches[0].clientX;
  };
  el.addEventListener('touchmove', handler, { passive: false });
  return () => el.removeEventListener('touchmove', handler);
}, []);

  return (
    <div className="carousel">
      {/* Track */}
      <div
        className="carousel-track"
        ref={trackRef}
        onTouchStart={onTouchStart}
        // onTouchMove={onTouchMove}
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