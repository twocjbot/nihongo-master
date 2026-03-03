'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  { title: 'KANJI DRILLS', desc: 'High-frequency character practice with memory intervals.', kanji: '字' },
  { title: 'VOCAB SYSTEM', desc: 'Useful words in context, not isolated lists.', kanji: '語' },
  { title: 'IMMERSION MODE', desc: 'Capture words from shows and review them later.', kanji: '観' }
];

export default function HomePage() {
  return (
    <main className="light-landing relative min-h-screen overflow-hidden">
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-32">
        <span className="pointer-events-none absolute -right-10 -top-16 font-shippori text-[clamp(200px,40vw,500px)] leading-none text-[rgba(26,23,20,0.06)]">
          学
        </span>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="relative z-10 max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#6B6560]">日本語マスター — LEARN JAPANESE</p>
          <h1 className="mt-5 font-shippori text-5xl leading-[1.02] text-[#1A1714] sm:text-7xl">
            <span className="block">Master the language.</span>
            <span className="mt-1 block text-[#C8391A]">Master the craft.</span>
          </h1>

          <div className="mt-8 h-px w-full bg-[#D4CFC7]" />

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-[11px] tracking-[0.12em] text-[#6B6560] sm:grid-cols-4">
            <span>15,000+ vocab</span>
            <span>100+ kanji</span>
            <span>SRS system</span>
            <span>No subscription</span>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/onboarding" className="bg-[#C8391A] px-6 py-3 font-mono text-[11px] tracking-[0.14em] text-[#FDFAF4] hover:bg-[#A02D14]">
              Begin →
            </Link>
            <Link href="/dashboard" className="border border-[#D4CFC7] px-6 py-3 font-mono text-[11px] tracking-[0.14em] text-[#1A1714]">
              View demo
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="bg-[#1A1714] px-6 py-16 text-[#FDFAF4]">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
              className={`card relative overflow-hidden p-6 ${idx === 0 ? 'md:col-span-2' : ''}`}
            >
              <span className="pointer-events-none absolute -right-2 -top-6 font-shippori text-[9rem] leading-none text-[#FDFAF4]/[0.08]">{feature.kanji}</span>
              <p className="relative z-10 font-mono text-[11px] tracking-[0.18em] text-[#D4CFC7]">{feature.title}</p>
              <p className="relative z-10 mt-3 max-w-md font-mono text-sm text-[#FDFAF4]/80">{feature.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#D4CFC7]/70 bg-[#F5F0E8] px-6 py-8 text-[#1A1714]">
        <div className="mx-auto flex max-w-6xl items-end justify-between">
          <p className="font-shippori text-2xl">日本語マスター</p>
          <p className="font-mono text-[11px] tracking-[0.16em]">© 2026</p>
        </div>
      </footer>
    </main>
  );
}
