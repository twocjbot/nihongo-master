'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PageShell } from '@/components/PageShell';
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
      <div className="mb-4 flex flex-wrap gap-2">
        {['ALL', 'N5', 'N4', 'N3'].map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l as 'ALL' | 'N5' | 'N4' | 'N3')}
            className={`px-3 py-1 text-xs ${level === l ? 'border border-[#C8391A] bg-[#C8391A]/15 text-[#C8391A]' : 'border border-[#D4CFC7]/30'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <div className="card grid max-h-[76vh] grid-cols-5 gap-2 overflow-y-auto p-3 sm:grid-cols-7 xl:grid-cols-8">
          {filtered.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelected(k)}
              className={`flex aspect-square items-center justify-center border text-2xl font-jp transition-colors ${selected.id === k.id ? 'border-[#C8391A] bg-[#C8391A] text-[#FDFAF4]' : 'border-[#D4CFC7]/20 bg-[#0f0d0b] text-[#FDFAF4] hover:border-[#C8391A]/60'}`}
            >
              {k.character}
            </button>
          ))}
        </div>

        <div className="card relative overflow-hidden p-5">
          <span className="pointer-events-none absolute -right-6 top-0 font-shippori text-[16rem] leading-none text-[#FDFAF4]/[0.04]">
            {selected.character}
          </span>
          <div className="relative z-10">
            <div className="text-center xl:text-left">
              <p className="font-jp text-[12rem] leading-[0.9] sm:text-[16rem] xl:text-[20rem]">{selected.character}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#D4CFC7]">JLPT {selected.jlpt} · {selected.stroke_count} strokes</p>
            </div>

            <div className="mt-5 overflow-hidden border border-[#D4CFC7]/20">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-[#D4CFC7]/15">
                    <td className="w-32 bg-[#FDFAF4]/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#D4CFC7]">Meanings</td>
                    <td className="px-3 py-2">{selected.meaning.join(', ')}</td>
                  </tr>
                  <tr className="border-b border-[#D4CFC7]/15">
                    <td className="w-32 bg-[#FDFAF4]/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#D4CFC7]">Onyomi</td>
                    <td className="px-3 py-2">{selected.onyomi.join(' / ')}</td>
                  </tr>
                  <tr>
                    <td className="w-32 bg-[#FDFAF4]/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#D4CFC7]">Kunyomi</td>
                    <td className="px-3 py-2">{selected.kunyomi.join(' / ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 border border-[#D4CFC7]/20 bg-[#FDFAF4]/[0.02] p-3 text-sm">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D4CFC7]">Example</p>
              <p className="mt-2 font-jp text-2xl">{selected.examples[0]?.word}</p>
              <p className="text-[#FDFAF4]/70">{selected.examples[0]?.reading} · {selected.examples[0]?.meaning}</p>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              {(['Again', 'Hard', 'Good', 'Easy'] as ReviewRating[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { void rateCard(r); }}
                  className="border border-[#D4CFC7]/30 px-2 py-2 hover:border-[#C8391A]/70"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
