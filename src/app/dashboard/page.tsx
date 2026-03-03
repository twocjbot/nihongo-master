'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { StatCard } from '@/components/StatCard';
import { storage } from '@/lib/storage';
import { vocabularyList } from '@/data/vocabulary';
import { isDue } from '@/lib/sm2';

const modules = [
  ['Kanji', '/kanji'],
  ['Vocabulary', '/vocabulary'],
  ['Grammar', '/grammar'],
  ['Reading', '/reading'],
  ['Listening', '/listening'],
  ['Progress', '/progress']
] as const;

export default function DashboardPage() {
  const [state, setState] = useState<Awaited<ReturnType<typeof storage.getState>> | null>(null);

  useEffect(() => {
    storage.getState().then(setState);
  }, []);

  const dueCount = useMemo(() => state?.cards.filter((c) => isDue(c)).length ?? 0, [state]);
  const wotd = vocabularyList[new Date().getDate() % vocabularyList.length];

  if (!state) return <PageShell title="Dashboard"><div>Loading...</div></PageShell>;

  return (
    <PageShell title="Dashboard">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Streak" value={`${state.profile.streak_days} days`} icon={<motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} className="text-orange-400">🔥</motion.span>} />
        <StatCard label="XP" value={state.profile.xp} />
        <StatCard label="Due Reviews" value={dueCount} />
      </section>

      <section className="mt-6 card p-4">
        <p className="text-sm text-white/70">Daily XP progress</p>
        <div className="mt-2 h-3 overflow-hidden rounded bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (state.profile.xp % 1000) / 10)}%` }} className="h-full bg-gradient-to-r from-primary to-accent" />
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {modules.map(([label, href]) => (
          <Link key={href} href={href} className="card p-5 transition hover:scale-[1.02] hover:border-primary/70">{label}</Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-sm text-white/70">Word of the Day</p>
          <p className="mt-2 text-2xl font-jp">{wotd.word} ({wotd.reading})</p>
          <p className="text-white/80">{wotd.meaning.join(', ')}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-white/70">Recent Activity</p>
          <div className="mt-2 space-y-2">
            {state.activities.slice(0, 5).map((a) => (
              <div key={a.id} className="rounded bg-white/5 p-2 text-sm">{a.text} (+{a.xp} XP)</div>
            ))}
            {state.activities.length === 0 && <p className="text-sm text-white/60">No activity yet. Start a module.</p>}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
