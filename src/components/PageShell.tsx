'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

const routes = [
  ['Dashboard', '/dashboard'],
  ['Kanji', '/kanji'],
  ['Vocabulary', '/vocabulary'],
  ['Grammar', '/grammar'],
  ['Reading', '/reading'],
  ['Listening', '/listening'],
  ['Review', '/review'],
  ['Progress', '/progress'],
  ['Settings', '/settings']
] as const;

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-jp text-2xl font-bold text-primary">日本語マスター</Link>
        <nav className="flex flex-wrap gap-2 text-xs">
          {routes.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-white/15 px-3 py-1 hover:border-primary/70 hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
      {children}
    </motion.div>
  );
}
