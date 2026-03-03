import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  title: '日本語マスター',
  description: 'Master Japanese with SRS, kanji, vocab, grammar, reading, and listening.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
