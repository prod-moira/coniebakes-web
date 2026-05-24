'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BasketIcon } from '@/components/BasketIcon';
import { BrandLogo } from '@/components/BrandLogo';
import { SITE_CONTACT } from '@/config/site';
import { CartProvider, useCart } from '@/context/CartContext';

function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

const [cartHovered, setCartHovered] = useState(false);
useEffect(() => {
  setCartHovered(false);
}, [pathname]);
const isCartActive = pathname === '/cart' || cartHovered || pathname === '/checkout';
const cartIconSrc = isCartActive ? '/assets/selected-basket.png' : '/assets/basket.png';

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link href="/" className="brand-logo-link" aria-label="Conie Bakes home">
          <BrandLogo />
        </Link>
        <nav className="main-nav">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link href="/menu" className={pathname === '/menu' ? 'active' : ''}>
            Menu
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
            Contact
          </Link>
          <Link
            href="/cart"
            className="cart-link"
            aria-label="Cart"
            onMouseEnter={() => setCartHovered(true)}
            onMouseLeave={() => setCartHovered(false)}
          >
            <BasketIcon size={24} src={cartIconSrc} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          
        </nav>
      </div>
    </header>
  );
}

function FooterIcon({ children }: { children: ReactNode }) {
  return <span className="footer-icon" aria-hidden="true">{children}</span>;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p className="footer-tagline">Conie Bakes — home bakery made with love and craft.</p>

        <a href={SITE_CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="footer-item">
          <FooterIcon>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </FooterIcon>
          <span>{SITE_CONTACT.facebookPage}</span>
        </a>

        <a href={`mailto:${SITE_CONTACT.email}`} className="footer-item">
          <FooterIcon>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </FooterIcon>
          <span>{SITE_CONTACT.email}</span>
        </a>

        <p className="footer-item">
          <FooterIcon>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </FooterIcon>
          <span>{SITE_CONTACT.phone}</span>
        </p>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </CartProvider>
  );
}
