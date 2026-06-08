'use client';

import { useState, useRef, useEffect } from 'react';

const testimonials = [
  {
    quote: "Deleeeeeecious! We are enjoying it now for dessert. It's a cross between Big Al's fudge and Polly's chocolate cake, and just the right sweetness. I will bring some to the office for more taste tests. Winner 'to!",
    author: "Anonymous",
    product: "Moist Chocolate Cake"
  },
  {
    quote: "One of the best burnt basque cheesecakes! Better than the ones in famous coffee shops. 1000/10, Super naenjoy ng Lola kooo (bihira lang siya magkafavorite na pagkain) haha. So trust me! The best talaga! Totoo ang chika!",
    author: "Charie G",
    product: "Burnt Basque Cheesecake"
  },
  {
    quote: "The burnt cheesecake was absolutely delicious! Perfectly creamy with a rich flavor, and surprisingly affordable. Thank you po! Sa susunod ulit.",
    author: "Fj Manuel",
    product: "Burnt Basque Cheesecake"
  },
  {
    quote: "Hindi ako mahilig sa chocolate cake, pero exception 'to!",
    author: "Rowell Austria and Yas Gudgad",
    product: "Moist Chocolate Cake"
  },
  {
    quote: "Super yummy ng burnt basque at chocolate cake! Highly recommended!",
    author: "Milca Suerte",
    product: "Burnt Basque Cheesecake and Moist Chocolate Cake"
  },
  {
    quote: "MUST TRY!!! Super sarap ng cheesecake. Very siksik ang lasa! Lahat ng nakakain dito sabi din ang sarap nya.",
    author: "Angelica Alano",
    product: "Burnt Basque Cheesecake"
  },
  {
    quote: "Thank you Conie Bakes! Napakasarap ng Burnt Basque Cheesecake, isang araw palang paubos na! Mapapabili talaga kami ulit.",
    author: "Angel C. Locsin",
    product: "Burnt Basque Cheesecake"
  },
  {
    quote: "Yummilicious Burnt Basque Cheesecake with Blueberries! Baked with a heart. Ubos agad parang pacman lang.",
    author: "Vicky Lee",
    product: "Burnt Basque Cheesecake with Blueberries"
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="feedback-card">
      <div className="feedback-avatar">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
      <hr className="feedback-divider" />
      <p className="feedback-quote">"{t.quote}"</p>
      <hr className="feedback-divider" />
      <p className="feedback-author">{t.author}</p>
      <p className="feedback-author-description"> referring to {t.product}</p>
    </div>
  );
}

export function TestimonialCarousel() {
  const [start, setStart] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);

  const WINDOW = 3;
  const maxStart = testimonials.length - WINDOW;

  const prevDesktop = () => setStart((i) => Math.max(0, i - 1));
  const nextDesktop = () => setStart((i) => Math.min(maxStart, i + 1));
  const prevMobile = () => setMobileCurrent((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const nextMobile = () => setMobileCurrent((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const element = mobileCarouselRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const deltaX = Math.abs((e.touches[0]?.clientX ?? 0) - touchStartX.current);
      const deltaY = Math.abs((e.touches[0]?.clientY ?? 0) - touchStartY.current);
      if (deltaX > deltaY) e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - (e.changedTouches[0]?.clientX ?? 0);
      if (Math.abs(diff) >= 30) {
        diff > 0 ? nextMobile() : prevMobile();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, true);
    element.addEventListener('touchmove', handleTouchMove, { passive: false, capture: false });
    element.addEventListener('touchend', handleTouchEnd, true);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart, true);
      element.removeEventListener('touchmove', handleTouchMove, false);
      element.removeEventListener('touchend', handleTouchEnd, true);
    };
  }, []);

  const visible = testimonials.slice(start, start + WINDOW);

  return (
    <>
      <div className="testimonial-desktop">
        <div className="testimonial-desktop-controls">
          <button type="button" className="carousel-arrow carousel-arrow--prev" onClick={prevDesktop} disabled={start === 0}>&#8249;</button>
          <div className="feedback-grid">
            {visible.map((t, i) => (
              <TestimonialCard key={start + i} t={t} />
            ))}
          </div>
          <button type="button" className="carousel-arrow carousel-arrow--next" onClick={nextDesktop} disabled={start >= maxStart}>&#8250;</button>
        </div>
        <div className="carousel-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-dot ${i >= start && i < start + WINDOW ? 'carousel-dot--active' : ''}`}
              onClick={() => setStart(Math.min(Math.max(0, i - 1), maxStart))}
            />
          ))}
        </div>
      </div>

      <div
        ref={mobileCarouselRef}
        className="testimonial-mobile"
      >
        <TestimonialCard t={testimonials[mobileCurrent]} />
        <div className="carousel-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-dot ${i === mobileCurrent ? 'carousel-dot--active' : ''}`}
              onClick={() => setMobileCurrent(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}