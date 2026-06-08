'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { OrderPlacedModal } from '@/components/OrderPlacedModal';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';


export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <OrderPlacedModal />
      </Suspense>

      <section
        className="hero-section"
        style={{
          fontWeight: 400,
          backgroundImage: "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55)), url('/assets/bg-image.png')",
        }}
      >
        <div className="hero-content">
          <h1>Conie Bakes</h1>
          <p>Home bakery creations made with love and craft</p>
          <Link href="/menu" className="btn-action" style={{ marginTop: '1.25rem' }}>
            Order Now
          </Link>
        </div>
      </section>
      <section className="bestseller-section">
        <div className="container home-stack bestseller-stack">
          <div className="home-section-content">
            <h2 className="section-heading">Best Seller</h2>
            <h3 className="home-section-subtitle">Burnt Basque Cheesecake - Plain</h3>
            <p>
              This is what Conie Bakes is known for — our signature burnt basque cheesecakes with a beautifully
              caramelized top, creamy center, and that cozy, homemade warmth in every slice.
            </p>
            {/* <Link href="/menu" className="btn-action" style={{ marginTop: '0.5rem' }}>
              Order Now
            </Link> */}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/best-seller.jpg" alt="Burnt Basque Cheesecake" className="bestseller-image" />
        </div>
      </section>

      <section className="feedback-section">
        <div className="container">
          <h2 className="section-heading" style={{ textAlign: 'center' }}>Hear From Our Customers</h2>
          <p className="home-section-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Baked fresh, loved by many.</p>
              <TestimonialCarousel />
        </div>
      </section>

      <section className="about-section">
        <div className="container home-stack about-stack">
          <div className="home-section-content about-text">
            <h2 className="section-heading">About Us</h2>
            <p>
              Conie Bakes started baking as a hobby during the pandemic and was founded in 2020. Every delicacy is made in small batches with care and patience. Our baker is a lovely
              mom of 4 who bakes from the heart — turning everyday moments into something warm, sweet, and memorable.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/about-us.jpg" alt="About Conie Bakes" className="about-image" />
        </div>
      </section>
    </>
  );
}
