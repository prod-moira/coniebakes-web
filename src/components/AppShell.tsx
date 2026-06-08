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
        <p className="footer-tagline">Conie Bakes — home bakery made with love</p>

        <a href={SITE_CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="footer-item">
          <FooterIcon>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </FooterIcon>
          <span>{SITE_CONTACT.facebookPage}</span>
        </a>

        <a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-item">
          <FooterIcon>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </FooterIcon>
          <span>{SITE_CONTACT.instagramPage}</span>
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
