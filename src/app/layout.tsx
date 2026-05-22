import type { Metadata } from 'next';
import { Lora, MonteCarlo } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Conie Bakes',
  description: 'Conie Bakes customer website',
    icons: {
    icon: '/favicon.png',
  },
};

const monteCarlo = MonteCarlo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-monte-carlo',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-body-serif',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${monteCarlo.variable} ${lora.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
