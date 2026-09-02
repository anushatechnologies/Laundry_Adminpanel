import type { Metadata } from 'next';
import { Inter, Poppins, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AdminNavWrapper } from '@/components/layout/AdminNavWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LaundryFresh Admin — Operations & Revenue Command Center',
  description: 'Enterprise laundry management console, batch facility processing, and dispatch scheduling.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${jakarta.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Script id="admin-theme-bootstrap" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('laundryfresh_admin_theme');
              if (theme === 'light' || theme === 'dark' || theme === 'green') {
                document.documentElement.setAttribute('data-theme', theme);
              }
            } catch {}
          `}
        </Script>
        <ThemeProvider>
          <AppProvider>
            <AdminNavWrapper>{children}</AdminNavWrapper>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
