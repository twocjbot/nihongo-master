'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { CardFlip } from '@/components/CardFlip';
import { kanjiList } from '@/data/kanji';
import { applySM2, ReviewRating } from '@/lib/sm2';
import { storage } from '@/lib/storage';

export default function KanjiPage() {
  const [level, setLevel] = useState<'ALL' | 'N5' | 'N4' | 'N3'>('ALL');
  const [selected, setSelected] = useState(kanjiList[0]);

  const filtered = useMemo(() => level === 'ALL' ? kanjiList : kanjiList.filter((k) => k.jlpt === level), [level]);

  useEffect(() => {
    async function ensureCard() {
      const state = await storage.getState();
      const existing = state.cards.find((c) => c.card_type === 'kanji' && c.card_id === selected.id);
      if (existing) return;
      await storage.saveCards([...state.cards, storage.createCard('kanji', selected.id, state.profile.user_id)]);
    }
    ensureCard();
  }, [selected.id]);

  async function rateCard(rating: ReviewRating) {
    const state = await storage.getState();
    const currentCard =
      state.cards.find((c) => c.card_type === 'kanji' && c.card_id === selected.id) ??
      storage.createCard('kanji', selected.id, state.profile.user_id);
    const nextCard = applySM2(currentCard, rating);
    const nextCards = state.cards.some((c) => c.id === currentCard.id)
      ? state.cards.map((c) => (c.id === currentCard.id ? nextCard : c))
      : [...state.cards, nextCard];
    await storage.saveCards(nextCards);
    toast.success(`Card scheduled for review in ${nextCard.interval_days} days`);
  }

  return (
    <PageShell title="Kanji Lab">
      <div className="mb-4 flex gap-2">{['ALL','N5','N4','N3'].map((l) => <button key={l} onClick={() => setLevel(l as 'ALL'|'N5'|'N4'|'N3')} className={`rounded-lg px-3 py-1 ${level===l?'bg-primary':'bg-white/10'}`}>{l}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid grid-cols-6 gap-2 rounded-2xl border border-white/10 p-3 sm:grid-cols-8">
          {filtered.map((k) => (
            <button key={k.id} onClick={() => setSelected(k)} className="rounded-lg border border-white/10 bg-white/5 p-2 font-jp text-2xl hover:border-primary">{k.character}</button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between">
              <motion.div
                initial={{ boxShadow: '0 0 0 rgba(255,107,138,0.0)' }}
                animate={{ boxShadow: ['0 0 0 rgba(255,107,138,0.15)', '0 0 24px rgba(255,107,138,0.55)', '0 0 0 rgba(255,107,138,0.15)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-2xl border border-primary/50 px-6 py-4"
              >
                <div className="font-jp text-7xl">{selected.character}</div>
              </motion.div>
              <div className="text-right text-sm text-white/70">JLPT {selected.jlpt}<br />{selected.stroke_count} strokes</div>
            </div>
            <p className="mt-2 text-white/80">{selected.meaning.join(', ')}</p>
            <p className="text-sm">On: {selected.onyomi.join(' / ')}</p>
            <p className="text-sm">Kun: {selected.kunyomi.join(' / ')}</p>
          </div>

          <CardFlip
            front={<div className="text-center"><div className="font-jp text-6xl">{selected.character}</div><p className="mt-2 text-sm">Tap to flip</p></div>}
            back={<div><p className="text-sm">Meanings: {selected.meaning.join(', ')}</p><p className="mt-2 text-sm">Example: {selected.examples[0]?.word} ({selected.examples[0]?.reading})</p><div className="mt-3 flex gap-2 text-xs">{(['Again','Hard','Good','Easy'] as ReviewRating[]).map((r)=><button key={r} onClick={(e) => { e.stopPropagation(); void rateCard(r); }} className="rounded bg-white/10 px-2 py-1">{r}</button>)}</div></div>}
          />
        </div>
      </div>
    </PageShell>
  );
}
