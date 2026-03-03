'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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

function seedQueue(userId: string) {
  const seededKanji = kanjiList.filter((k) => k.jlpt === 'N5').slice(0, 7).map((k) => storage.createCard('kanji', k.id, userId));
  const seededVocab = vocabularyList.filter((v) => v.jlpt === 'N5').slice(0, 7).map((v) => storage.createCard('vocabulary', v.id, userId));
  const seededGrammar = grammarList.filter((g) => g.level === 'N5').slice(0, 6).map((g) => storage.createCard('grammar', g.id, userId));
  return [
    ...seededKanji,
    ...seededVocab,
    ...seededGrammar
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
  const router = useRouter();
  const [appState, setAppState] = useState<AppState | null>(null);
  const [cards, setCards] = useState<AppState['cards']>([]);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [start] = useState(Date.now());

  useEffect(() => {
    storage.getState().then(async (s) => {
      setAppState(s);
      const seeded = s.cards.length ? s.cards : seedQueue(s.profile.user_id);
      setCards(seeded);
      if (!s.cards.length) await storage.saveCards(seeded);
    });
  }, []);

  const queue = useMemo(() => cards.filter((c) => isDue(c)), [cards]);
  const current = queue[0];

  const showCard = showCardDetails(appState, current?.card_id ?? '');
  const kanji = current?.card_type === 'kanji' ? kanjiList.find((k) => k.id === current.card_id) : undefined;
  const vocab = current?.card_type === 'vocabulary' ? vocabularyList.find((v) => v.id === current.card_id || v.word === current.card_id) : undefined;
  const grammar = current?.card_type === 'grammar' ? grammarList.find((g) => g.id === current.card_id) : undefined;

  const front =
    current?.card_type === 'kanji'
      ? <div className="text-center text-7xl font-jp">{kanji?.character ?? current.card_id}</div>
      : current?.card_type === 'vocabulary'
        ? (
          <div className="text-center">
            <p className="text-4xl font-jp">{showCard?.word ?? vocab?.word ?? current.card_id}</p>
            <p className="mt-2 text-sm text-white/70">{vocab?.reading ?? 'Reading unavailable'}</p>
          </div>
        )
        : current?.card_type === 'grammar'
          ? (
            <div className="text-center">
              <p className="text-3xl font-semibold">{grammar?.pattern ?? current?.card_id}</p>
              <p className="mt-2 text-sm text-white/70">{grammar?.meaning}</p>
            </div>
          )
          : null;

  const back =
    current?.card_type === 'kanji'
      ? (
        <div className="text-center text-sm">
          <p>Meaning: {kanji?.meaning.join(', ')}</p>
          <p className="mt-1">Readings: {kanji?.onyomi.join(' / ')} | {kanji?.kunyomi.join(' / ')}</p>
          <p className="mt-1">Example: {kanji?.examples[0]?.word} ({kanji?.examples[0]?.meaning})</p>
        </div>
      )
      : current?.card_type === 'vocabulary'
        ? (
          <div className="text-center text-sm">
            <p>Meaning: {vocab?.meaning.join(', ') ?? 'N/A'}</p>
            <p className="mt-1">Example: {vocab?.examples[0]?.japanese ?? 'N/A'}</p>
            <p className="mt-1 text-white/70">{vocab?.examples[0]?.english ?? 'No example available'}</p>
          </div>
        )
        : current?.card_type === 'grammar'
          ? (
            <div className="text-center text-sm">
              <p>Formation: {grammar?.formation}</p>
              <p className="mt-1">Example: {grammar?.examples[0]?.japanese}</p>
              <p className="mt-1 text-white/70">{grammar?.examples[0]?.english}</p>
            </div>
          )
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
    toast.success('Review session complete');
    router.push('/dashboard');
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/70">{current.card_type.toUpperCase()} • due cards left: {queue.length}</motion.p>
          <CardFlip front={front} back={back} />
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
