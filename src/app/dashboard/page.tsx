'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { StatCard } from '@/components/StatCard';
import { achievementById } from '@/data/achievements';
import { vocabularyList } from '@/data/vocabulary';
import { storage } from '@/lib/storage';
import { isDue } from '@/lib/sm2';
import { levelFromXp, levelTitle, makeChallengeProgress, xpToNextLevel } from '@/lib/rewards';

const RotatingKanjiOrb = dynamic(
  () => import('@/components/three/RotatingKanjiOrb').then((m) => m.RotatingKanjiOrb),
  { ssr: false, loading: () => <div className="h-44 rounded bg-white/5" /> }
);

const defaultModules = [
  ['Kanji', '/kanji'],
  ['Vocabulary', '/vocabulary'],
  ['Grammar', '/grammar'],
  ['Reading', '/reading'],
  ['Listening', '/listening'],
  ['Games', '/games'],
  ['Immersion', '/immersion'],
  ['Progress', '/progress']
] as const;

const immersionFirstModules = [
  ['Immersion', '/immersion'],
  ['Games', '/games'],
  ['Review', '/review'],
  ['Kanji', '/kanji'],
  ['Vocabulary', '/vocabulary'],
  ['Grammar', '/grammar'],
  ['Reading', '/reading'],
  ['Listening', '/listening']
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

  const modules = state.profile.prefers_immersion ? immersionFirstModules : defaultModules;
  const currentShow = state.immersionShows.find((s) => s.id === state.profile.current_show_id) ?? state.immersionShows[0];
  const mastered = currentShow?.vocabulary.filter((v) => v.mastered).length ?? 0;
  const masteredPct = currentShow?.vocabulary.length ? Math.round((mastered / currentShow.vocabulary.length) * 100) : 0;
  const recentAchievement = state.recentAchievementId ? achievementById[state.recentAchievementId] : undefined;

  return (
    <PageShell title="Dashboard">
      <section className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Streak" value={`${state.profile.streak_days} days`} icon={<motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} className="text-orange-400">🔥</motion.span>} />
        <StatCard label="XP" value={state.profile.xp} />
        <StatCard label="Level" value={`${level} · ${levelTitle(level)}`} />
        <StatCard label="Due Reviews" value={dueCount} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-sm text-white/70">XP to next level: {toNext}</p>
            <div className="mt-2 h-3 overflow-hidden rounded bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((level * 150 - toNext) / (level * 150)) * 100)}%` }} className="h-full bg-gradient-to-r from-primary to-accent" />
            </div>
          </div>

          <div className="card p-4">
            <p className="text-sm text-white/70">Daily Challenges</p>
            <div className="mt-2 space-y-2">
              {(state.dailyChallenges?.missions ?? []).map((m) => {
                const progress = state.dailyChallenges?.progress[m.id] ?? 0;
                const complete = (state.dailyChallenges?.completed ?? []).includes(m.id);
                return (
                  <div key={m.id} className="rounded bg-white/5 p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>{complete ? '✅' : '⬜'} {m.text}</span>
                      <span className="text-xs text-emerald-300">+{m.reward_xp} XP</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded bg-white/10">
                      <div className="h-full rounded bg-emerald-400" style={{ width: `${Math.min(100, (progress / m.target) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-white/60">Reward includes bonus XP and streak protection on full completion.</p>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-sm text-white/70">Immersion</p>
            {currentShow ? (
              <>
                <p className="mt-1 font-semibold">Currently watching: {currentShow.native_title || currentShow.title}</p>
                <p className="text-sm text-white/70">Episodes logged: {currentShow.watch_logs.length}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full border-4 border-primary/60 text-center leading-[3.1rem]">{masteredPct}%</div>
                  <p className="text-sm text-white/70">Vocab mastered {mastered}/{currentShow.vocabulary.length}</p>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-white/60">Add a show in Immersion to track episode and vocab progress.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-sm text-white/70">Kanji Galaxy Teaser</p>
            <RotatingKanjiOrb char={wotd.word.slice(0, 1)} />
            <Link href="/games" className="mt-2 inline-block rounded bg-primary px-3 py-2 text-sm">Launch Games</Link>
          </div>

          <div className="card p-4">
            <p className="text-sm text-white/70">Recent achievement</p>
            {recentAchievement ? (
              <div className="mt-2 rounded border border-amber-300/40 bg-amber-200/10 p-3 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                <p className="text-lg">{recentAchievement.icon} {recentAchievement.name}</p>
                <p className="text-xs text-white/70">{recentAchievement.description}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-white/60">No achievements unlocked yet.</p>
            )}
          </div>

          <div className="card p-4">
            <p className="text-sm text-white/70">Word of the Day</p>
            <p className="mt-1 text-2xl font-jp">{wotd.word} ({wotd.reading})</p>
            <p className="text-sm text-white/80">{wotd.meaning.join(', ')}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        {modules.map(([label, href]) => (
          <Link key={href} href={href} className="card p-5 transition hover:scale-[1.02] hover:border-primary/70">{label}</Link>
        ))}
      </section>

      <section className="mt-6 card p-4">
        <p className="text-sm text-white/70">Recent Activity</p>
        <div className="mt-2 space-y-2">
          {state.activities.slice(0, 5).map((a) => (
            <div key={a.id} className="rounded bg-white/5 p-2 text-sm">{a.text} (+{a.xp} XP)</div>
          ))}
          {state.activities.length === 0 && <p className="text-sm text-white/60">No activity yet. Start a module.</p>}
        </div>
      </section>
    </PageShell>
  );
}
