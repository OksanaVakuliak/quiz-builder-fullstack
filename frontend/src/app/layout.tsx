import type { Metadata } from 'next';
import Link from 'next/link';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and manage custom quizzes with multiple question types.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <QueryProvider>
          <header className="appHeader">
            <div className="container headerContent">
              <Link href="/" className="brand">
                Quiz Builder
              </Link>
              <nav className="navLinks">
                <Link href="/create">Create Quiz</Link>
                <Link href="/quizzes">All Quizzes</Link>
              </nav>
            </div>
          </header>
          <main className="container pageContainer">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
