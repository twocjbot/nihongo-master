'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { StatCard } from '@/components/StatCard';
import { achievementById } from '@/data/achievements';
import { vocabularyList } from '@/data/vocabulary';
import { storage } from '@/lib/storage';
import { isDue } from '@/lib/sm2';
import { levelFromXp, levelTitle, makeChallengeProgress, xpToNextLevel } from '@/lib/rewards';

const defaultModules = [
  ['Kanji', '/kanji', '字'],
  ['Vocabulary', '/vocabulary', '語'],
  ['Grammar', '/grammar', '文'],
  ['Reading', '/reading', '読'],
  ['Listening', '/listening', '聴'],
  ['Games', '/games', '遊'],
  ['Immersion', '/immersion', '観'],
  ['Progress', '/progress', '進']
] as const;

const immersionFirstModules = [
  ['Immersion', '/immersion', '観'],
  ['Games', '/games', '遊'],
  ['Review', '/review', '復'],
  ['Kanji', '/kanji', '字'],
  ['Vocabulary', '/vocabulary', '語'],
  ['Grammar', '/grammar', '文'],
  ['Reading', '/reading', '読'],
  ['Listening', '/listening', '聴']
] as const;

export default function DashboardPage() {
  const [state, setState] = useState<Awaited<ReturnType<typeof storage.getState>> | null>(null);

  useEffect(() => {
    storage.getState().then(async (s) => {
      const dateKey = new Date().toDateString();
      if (!s.dailyChallenges || s.dailyChallenges.date_key !== dateKey) {
        const daily = makeChallengeProgress(dateKey);
        await storage.saveDailyChallenges(daily);
        setState({ ...s, dailyChallenges: daily });
      } else {
        setState(s);
      }
    });
  }, []);

  const dueCount = useMemo(() => state?.cards.filter((c) => isDue(c)).length ?? 0, [state]);
  const level = useMemo(() => levelFromXp(state?.profile.xp ?? 0), [state]);
  const toNext = useMemo(() => xpToNextLevel(state?.profile.xp ?? 0), [state]);
  const wotd = vocabularyList[new Date().getDate() % vocabularyList.length];

  if (!state) return <PageShell title="Dashboard"><div>Loading...</div></PageShell>;

  const modules = (state.profile.prefers_immersion ? immersionFirstModules : defaultModules).slice(0, 6);
  const currentShow = state.immersionShows.find((s) => s.id === state.profile.current_show_id) ?? state.immersionShows[0];
  const mastered = currentShow?.vocabulary.filter((v) => v.mastered).length ?? 0;
  const masteredPct = currentShow?.vocabulary.length ? Math.round((mastered / currentShow.vocabulary.length) * 100) : 0;
  const recentAchievement = state.recentAchievementId ? achievementById[state.recentAchievementId] : undefined;

  return (
    <PageShell title="Dashboard">
      <section className="mb-6 border-b border-[#D4CFC7]/20 pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4CFC7]">Daily editorial</p>
        <p className="mt-2 max-w-2xl text-sm text-[#FDFAF4]/75">Focused repetition builds fluency. Today&apos;s due queue is {dueCount}. Keep the cycle moving.</p>
      </section>

      <section className="-mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-2">
        <StatCard label="XP" value={state.profile.xp} />
        <StatCard label="Streak" value={`${state.profile.streak_days}`} icon={<span className="text-[#C8391A]">🔥</span>} />
        <StatCard label="Level" value={`${level}`} />
        <StatCard label="Due Reviews" value={dueCount} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4CFC7]">Progress to next level</p>
          <p className="mt-2 font-shippori text-2xl">{levelTitle(level)}</p>
          <p className="mt-1 text-xs text-[#FDFAF4]/65">XP to next level: {toNext}</p>
          <div className="mt-4 h-2 overflow-hidden bg-[#FDFAF4]/10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((level * 150 - toNext) / (level * 150)) * 100)}%` }} className="h-full bg-[#C8391A]" />
          </div>
        </div>

        <div className="card p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4CFC7]">Word of the day</p>
          <p className="mt-2 font-jp text-4xl">{wotd.word}</p>
          <p className="text-sm text-[#FDFAF4]/70">{wotd.reading}</p>
          <p className="mt-2 text-sm text-[#FDFAF4]/80">{wotd.meaning.join(', ')}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(([label, href, kanji]) => (
          <Link key={href} href={href} className="card group relative overflow-hidden p-5 hover:-translate-y-[2px]">
            <span className="pointer-events-none absolute -right-2 -top-8 font-shippori text-8xl text-[#FDFAF4]/[0.07]">{kanji}</span>
            <p className="relative z-10 font-mono text-xs uppercase tracking-[0.16em] text-[#D4CFC7]">Module</p>
            <p className="relative z-10 mt-2 font-mono text-lg uppercase tracking-[0.08em]">{label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4CFC7]">Daily challenges</p>
          <div className="mt-3 space-y-2">
            {(state.dailyChallenges?.missions ?? []).map((m) => {
              const progress = state.dailyChallenges?.progress[m.id] ?? 0;
              const complete = (state.dailyChallenges?.completed ?? []).includes(m.id);
              return (
                <div key={m.id} className="border border-[#D4CFC7]/15 bg-[#FDFAF4]/[0.03] p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{complete ? '✓' : '○'} {m.text}</span>
                    <span className="text-[#C8391A]">+{m.reward_xp}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[#FDFAF4]/10">
                    <div className="h-full bg-[#C8391A]" style={{ width: `${Math.min(100, (progress / m.target) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4CFC7]">Immersion</p>
          {currentShow ? (
            <>
              <p className="mt-2 font-shippori text-2xl">{currentShow.native_title || currentShow.title}</p>
              <p className="text-xs text-[#FDFAF4]/65">Episodes logged: {currentShow.watch_logs.length}</p>
              <p className="mt-3 text-sm">Vocab mastered: {mastered}/{currentShow.vocabulary.length} ({masteredPct}%)</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-[#FDFAF4]/65">Add a show in Immersion to track progress.</p>
          )}
        </div>

        <div className="card p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4CFC7]">Recent achievement</p>
          {recentAchievement ? (
            <div className="mt-2 border border-[#C8391A]/40 bg-[#C8391A]/10 p-3">
              <p className="text-lg">{recentAchievement.icon} {recentAchievement.name}</p>
              <p className="text-xs text-[#FDFAF4]/70">{recentAchievement.description}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#FDFAF4]/65">No achievements unlocked yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
