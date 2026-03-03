'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { CardFlip } from '@/components/CardFlip';
import { kanjiList } from '@/data/kanji';
import { vocabularyList } from '@/data/vocabulary';
import { grammarList } from '@/data/grammar';
import { applySM2, isDue, ReviewRating } from '@/lib/sm2';
import { storage } from '@/lib/storage';

function seedQueue() {
  return [
    storage.createCard('kanji', kanjiList[0].id),
    storage.createCard('vocabulary', vocabularyList[0].id),
    storage.createCard('grammar', grammarList[0].id)
  ];
}

export default function ReviewPage() {
  const [cards, setCards] = useState<Awaited<ReturnType<typeof storage.getState>>['cards']>([]);
  const [index, setIndex] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [start] = useState(Date.now());

  useEffect(() => {
    storage.getState().then(async (s) => {
      const seeded = s.cards.length ? s.cards : seedQueue();
      setCards(seeded);
      if (!s.cards.length) await storage.saveCards(seeded);
    });
  }, []);

  const queue = useMemo(() => cards.filter((c) => isDue(c)), [cards]);
  const current = queue[index];

  const content = current ? current.card_type === 'kanji' ? kanjiList.find((k) => k.id === current.card_id)?.character : current.card_type === 'vocabulary' ? vocabularyList.find((v) => v.id === current.card_id)?.word : grammarList.find((g) => g.id === current.card_id)?.pattern : null;

  async function rate(r: ReviewRating) {
    if (!current) return;
    const updated = cards.map((c) => c.id === current.id ? applySM2(c, r) : c);
    setCards(updated);
    await storage.saveCards(updated);
    setReviewed((n) => n + 1);
    if (r === 'Good' || r === 'Easy') setCorrect((n) => n + 1);
    if (index < queue.length - 1) setIndex((i) => i + 1);

    const state = await storage.getState();
    await storage.saveProfile({ ...state.profile, xp: state.profile.xp + 10 });
    await storage.addActivity({ text: `Reviewed ${current.card_type} card`, xp: 10 });
  }

  async function finishSession() {
    const state = await storage.getState();
    await storage.addSession({
      user_id: state.profile.user_id,
      session_type: 'review',
      cards_reviewed: reviewed,
      correct,
      duration_ms: Date.now() - start
    });
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
          <div className="grid grid-cols-4 gap-2">{(['Again','Hard','Good','Easy'] as ReviewRating[]).map((r) => <button key={r} onClick={() => rate(r)} className="rounded p-2 text-sm bg-white/10 hover:bg-primary/60">{r}</button>)}</div>
        </div>
      )}
    </PageShell>
  );
}
