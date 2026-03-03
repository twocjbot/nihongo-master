'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PageShell } from '@/components/PageShell';
import { CardFlip } from '@/components/CardFlip';
import { achievements } from '@/data/achievements';
import { grammarList } from '@/data/grammar';
import { kanjiList } from '@/data/kanji';
import { vocabularyList } from '@/data/vocabulary';
import { detectAchievementUnlocks, levelFromXp, makeChallengeProgress, updateChallengeMetric } from '@/lib/rewards';
import { applySM2, isDue, ReviewRating } from '@/lib/sm2';
import { AppState, storage } from '@/lib/storage';

function seedQueue() {
  return [
    storage.createCard('kanji', kanjiList[0].id),
    storage.createCard('vocabulary', vocabularyList[0].id),
    storage.createCard('grammar', grammarList[0].id)
  ];
}

function showCardDetails(state: AppState | null, cardId: string) {
  if (!cardId.startsWith('showvocab:') || !state) return null;
  const parts = cardId.split(':');
  const showId = parts[1];
  const word = parts.slice(2).join(':');
  const show = state.immersionShows.find((s) => s.id === showId);
  return {
    word,
    showTitle: show?.native_title || show?.title || 'Unknown show'
  };
}

export default function ReviewPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [cards, setCards] = useState<AppState['cards']>([]);
  const [index, setIndex] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [start] = useState(Date.now());

  useEffect(() => {
    storage.getState().then(async (s) => {
      setAppState(s);
      const seeded = s.cards.length ? s.cards : seedQueue();
      setCards(seeded);
      if (!s.cards.length) await storage.saveCards(seeded);
    });
  }, []);

  const queue = useMemo(() => cards.filter((c) => isDue(c)), [cards]);
  const current = queue[index];

  const showCard = showCardDetails(appState, current?.card_id ?? '');
  const content = current
    ? current.card_type === 'kanji'
      ? kanjiList.find((k) => k.id === current.card_id)?.character
      : current.card_type === 'vocabulary'
        ? showCard?.word ?? vocabularyList.find((v) => v.id === current.card_id)?.word
        : grammarList.find((g) => g.id === current.card_id)?.pattern
    : null;

  async function rate(r: ReviewRating) {
    if (!current) return;
    const updated = cards.map((c) => (c.id === current.id ? applySM2(c, r) : c));
    setCards(updated);
    await storage.saveCards(updated);

    const reviewedNow = reviewed + 1;
    const correctNow = r === 'Good' || r === 'Easy' ? correct + 1 : correct;
    setReviewed(reviewedNow);
    setCorrect(correctNow);
    if (index < queue.length - 1) setIndex((i) => i + 1);

    const state = await storage.getState();
    const prevLevel = levelFromXp(state.profile.xp);
    const nextXp = state.profile.xp + 10;
    const nextLevel = levelFromXp(nextXp);

    const today = new Date().toISOString().slice(0, 10);
    const last = state.profile.last_study_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak =
      last === today
        ? state.profile.streak_days
        : last === yesterday
          ? state.profile.streak_days + 1
          : 1;

    await storage.saveProfile({ ...state.profile, xp: nextXp, streak_days: streak, last_study_date: today });
    await storage.addActivity({ text: `Reviewed ${current.card_type} card`, xp: 10 });

    if (nextLevel > prevLevel) toast.success(`Level up! Level ${nextLevel}`);
    if ([3, 7, 30, 100].includes(streak)) toast.success(`Streak milestone: ${streak} days`);

    const dateKey = new Date().toDateString();
    const daily = state.dailyChallenges?.date_key === dateKey ? state.dailyChallenges : makeChallengeProgress(dateKey);
    const nextDaily = updateChallengeMetric(daily, 'review', 1);
    await storage.saveDailyChallenges(nextDaily);
    if (nextDaily.completed.length > daily.completed.length) toast.success('Daily challenge complete');

    const totalReviewed = state.sessions.reduce((sum, s) => sum + s.cards_reviewed, 0) + reviewedNow;
    const unlocked = detectAchievementUnlocks({
      unlocked: state.unlockedAchievements,
      streak,
      totalReviews: totalReviewed,
      level: nextLevel,
      shows: state.immersionShows,
      immersionHours: state.immersionShows.flatMap((s) => s.watch_logs).reduce((sum, w) => sum + w.minutes, 0) / 60
    });
    const newOnes = unlocked.filter((id) => !state.unlockedAchievements.includes(id));
    if (newOnes.length) {
      const latest = newOnes[0];
      await storage.saveAchievements(unlocked, latest);
      const a = achievements.find((x) => x.id === latest);
      if (a) toast.success(`Achievement unlocked: ${a.icon} ${a.name}`);
    }

    setAppState(await storage.getState());
  }

  async function finishSession() {
    const state = await storage.getState();
    const accuracy = reviewed ? Math.round((correct / reviewed) * 100) : 0;
    await storage.addSession({
      user_id: state.profile.user_id,
      session_type: 'review',
      cards_reviewed: reviewed,
      correct,
      duration_ms: Date.now() - start
    });
    if (accuracy >= 95) {
      const unlocked = detectAchievementUnlocks({
        unlocked: state.unlockedAchievements,
        streak: state.profile.streak_days,
        totalReviews: state.sessions.reduce((sum, s) => sum + s.cards_reviewed, 0) + reviewed,
        accuracy,
        level: levelFromXp(state.profile.xp),
        shows: state.immersionShows,
        immersionHours: state.immersionShows.flatMap((s) => s.watch_logs).reduce((sum, w) => sum + w.minutes, 0) / 60
      });
      if (!state.unlockedAchievements.includes('acc_95') && unlocked.includes('acc_95')) {
        await storage.saveAchievements(unlocked, 'acc_95');
        toast.success('Achievement unlocked: 🎯 Precision Strike');
      }
    }
  }

  return (
    <PageShell title="SRS Review Session">
      {!current ? (
        <div className="card p-6">
          <p className="text-xl font-semibold">Session Complete</p>
          <p className="mt-2">Cards reviewed: {reviewed}</p>
          <p>Accuracy: {reviewed ? Math.round((correct / reviewed) * 100) : 0}%</p>
          <p>XP earned: {reviewed * 10}</p>
          <button onClick={finishSession} className="mt-3 rounded bg-primary px-4 py-2">Save Summary</button>
        </div>
      ) : (
        <div className="mx-auto max-w-xl space-y-4">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/70">{current.card_type.toUpperCase()} • card {index + 1} / {queue.length}</motion.p>
          <CardFlip front={<div className="text-center text-5xl font-jp">{content}</div>} back={<div className="text-center">Think of meaning + reading</div>} />
          {showCard && (
            <div className="rounded border border-amber-200/20 bg-amber-200/10 p-2 text-sm text-amber-100">
              🎬 You learned this from: {showCard.showTitle}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">{(['Again', 'Hard', 'Good', 'Easy'] as ReviewRating[]).map((r) => <button key={r} onClick={() => rate(r)} className="rounded p-2 text-sm bg-white/10 hover:bg-primary/60">{r}</button>)}</div>
        </div>
      )}
    </PageShell>
  );
}
