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
      <body className="font-sans">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
