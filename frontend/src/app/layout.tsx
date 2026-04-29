import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { appMetadataBase, createPageMetadata } from '@/lib/metadata';
import './globals.css';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const defaultPageMetadata = createPageMetadata({
  title: 'Quiz Builder',
  description: 'Create and manage custom quizzes with multiple question types.',
  path: '/',
});

export const metadata: Metadata = {
  metadataBase: appMetadataBase,
  title: {
    default: 'Quiz Builder',
    template: '%s | Quiz Builder',
  },
  description: defaultPageMetadata.description,
  alternates: defaultPageMetadata.alternates,
  openGraph: defaultPageMetadata.openGraph,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <a href="#main-content" className="skipLink">
          Skip to main content
        </a>
        <QueryProvider>
          <AppHeader />
          <main id="main-content" className="container pageContainer" tabIndex={-1}>
            {children}
          </main>
          <AppFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
