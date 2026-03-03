'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const routes = [
  ['Dashboard', '/dashboard'],
  ['Kanji', '/kanji'],
  ['Vocabulary', '/vocabulary'],
  ['Grammar', '/grammar'],
  ['Reading', '/reading'],
  ['Listening', '/listening'],
  ['Games', '/games'],
  ['Immersion', '/immersion'],
  ['Progress', '/progress'],
  ['Review', '/review'],
  ['Settings', '/settings']
] as const;

const pageKanji: Record<string, string> = {
  '/dashboard': '学',
  '/kanji': '字',
  '/vocabulary': '語',
  '/grammar': '文',
  '/reading': '読',
  '/listening': '聴',
  '/games': '遊',
  '/immersion': '観',
  '/progress': '進',
  '/review': '復',
  '/settings': '設',
  '/onboarding': '始'
};

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const deco = pageKanji[pathname] ?? '書';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative min-h-screen bg-bg text-[#FDFAF4]"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        <aside className="border-b border-[#D4CFC7]/15 px-4 py-5 lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
          <Link href="/" className="font-shippori text-2xl text-[#FDFAF4]">日本語マスター</Link>
          <nav className="mt-6 grid grid-cols-2 gap-1 text-[11px] tracking-[0.18em] text-[#D4CFC7] lg:grid-cols-1">
            {routes.map(([label, href]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`border-l-[3px] px-2 py-2 uppercase transition-colors ${active ? 'border-[#C8391A] text-[#C8391A]' : 'border-transparent hover:border-[#C8391A]/50 hover:text-[#FDFAF4]'}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="relative flex-1 overflow-hidden px-4 py-6 sm:px-8 sm:py-8">
          <span className="deco-kanji -right-6 -top-10 z-0">{deco}</span>
          <header className="relative z-10 mb-6 border-b border-[#D4CFC7]/20 pb-4">
            <h1 className="font-shippori text-4xl tracking-tight sm:text-5xl">{title}</h1>
          </header>
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </motion.div>
  );
}
