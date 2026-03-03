import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { ToastProvider } from '@/components/ToastProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const noto = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto-jp', weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: '日本語マスター',
  description: 'Master Japanese with SRS, kanji, vocab, grammar, reading, and listening.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${noto.variable} font-sans`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
