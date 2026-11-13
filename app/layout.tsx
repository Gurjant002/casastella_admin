import type {Metadata} from 'next';
import {Cormorant_Garamond, Libre_Baskerville} from 'next/font/google';
import './globals.css';
import {AuthProvider} from '@/features/admin/auth/auth-context';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Casa Stella Admin',
  description: 'Panel editorial premium para administrar el restaurante Casa Stella.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} min-h-screen antialiased`} style={{ backgroundColor: 'var(--color-black)' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
