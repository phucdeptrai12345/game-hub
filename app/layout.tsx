import type { Metadata, Viewport } from 'next';
import { Nunito, Russo_One, Exo_2 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import TopLoadingBar from '@/components/ui/TopLoadingBar';
import BackToTopButton from '@/components/ui/BackToTopButton';
import ConsentManager from '@/components/ui/ConsentManager';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SidebarProvider } from '@/components/providers/SidebarProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { SITE_URL } from '@/lib/site';

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

const russoOne = Russo_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-russo-one',
  display: 'swap',
});

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-exo2',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GameZone — Free Online Games',
    template: '%s | GameZone',
  },
  description:
    'Play 9,000+ free online HTML5 games instantly. No download, no sign-up — just fun!',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" className={`${nunito.variable} ${russoOne.variable} ${exo2.variable} h-full bg-background`}>
      <body className="min-h-full flex flex-col text-fg antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:font-bold focus:rounded-lg focus:text-sm"
        >
          Skip to content
        </a>
        <I18nProvider>
        <ThemeProvider>
          <SidebarProvider>
          <TopLoadingBar />
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main id="main-content" className="w-full min-w-0 flex-1 overflow-x-clip">
              {children}
              <Footer />
            </main>
          </div>
          <BackToTopButton />
          <ConsentManager />
          </SidebarProvider>
        </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
