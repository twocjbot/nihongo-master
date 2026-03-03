'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const chars = '日本語勉強漢字話聞読書学愛夢光道心空海火水木金土';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        {chars.split('').map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            initial={{ y: -40, x: `${(i * 7) % 100}%`, opacity: 0 }}
            animate={{ y: '110vh', opacity: [0, 0.4, 0.2] }}
            transition={{ duration: 10 + (i % 6), repeat: Infinity, delay: i * 0.2, ease: 'linear' }}
            className="pointer-events-none absolute font-jp text-2xl text-white/20"
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="font-jp text-5xl font-bold sm:text-7xl">
          日本語マスター
        </motion.h1>
        <p className="mt-4 max-w-2xl text-xl text-white/80">Master Japanese. Your way.</p>
        <div className="mt-8 flex gap-4">
          <Link href="/onboarding" className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:scale-105">Start Learning Free</Link>
          <Link href="/dashboard" className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:border-accent">View Demo</Link>
        </div>
        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {['SM-2 Spaced Repetition', 'Kanji + Vocab + Grammar', 'Reading + Listening Labs'].map((f) => (
            <div key={f} className="card p-5">{f}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
