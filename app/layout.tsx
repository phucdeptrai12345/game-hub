import type { Metadata } from 'next';
import { Nunito, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GameZone — Free Online Games',
    template: '%s | GameZone',
  },
  description:
    'Play hundreds of free online HTML5 games instantly. No download, no sign-up — just fun!',
  keywords: ['free games', 'online games', 'html5 games', 'browser games'],
  openGraph: {
    siteName: 'GameZone',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${outfit.variable} h-full bg-background`}>
      <body className="min-h-full flex flex-col text-fg antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:font-bold focus:rounded-lg focus:text-sm"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
