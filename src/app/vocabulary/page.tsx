'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PageShell } from '@/components/PageShell';
import { vocabularyList } from '@/data/vocabulary';
import { applySM2 } from '@/lib/sm2';
import { storage } from '@/lib/storage';
import { speakJapanese } from '@/lib/tts';

export default function VocabularyPage() {
  const [q, setQ] = useState('');
  const [pos, setPos] = useState('all');
  const [jlpt, setJlpt] = useState<'ALL'|'N5'|'N4'|'N3'>('ALL');
  const [cardIdx, setCardIdx] = useState(0);
  const [mode, setMode] = useState<'mc'|'typing'>('mc');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const words = useMemo(() => vocabularyList.filter((v) => {
    const matchQ = [v.word, v.reading, v.meaning.join(' ')].join(' ').toLowerCase().includes(q.toLowerCase());
    const matchPos = pos === 'all' || v.part_of_speech === pos;
    const matchJlpt = jlpt === 'ALL' || v.jlpt === jlpt;
    return matchQ && matchPos && matchJlpt;
  }), [q, pos, jlpt]);

  const card = words[cardIdx % Math.max(1, words.length)];
  const correctAnswer = card?.meaning[0] ?? '';

  const options = useMemo(() => {
    if (!card) return [];
    const wrongPool = vocabularyList.filter((w) => w.id !== card.id && w.meaning[0] !== card.meaning[0]);
    const shuffled = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.meaning[0]);
    return [card.meaning[0], ...shuffled].sort(() => Math.random() - 0.5);
  }, [card]);

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
  }, [cardIdx, card?.id]);

  async function handleAnswer(option: string) {
    if (!card || selectedOption !== null) return;
    const correct = option === card.meaning[0];
    setSelectedOption(option);
    setIsCorrect(correct);

    const state = await storage.getState();
    const cardState =
      state.cards.find((c) => c.card_type === 'vocabulary' && c.card_id === card.id) ??
      storage.createCard('vocabulary', card.id, state.profile.user_id);
    const updatedCard = applySM2(cardState, correct ? 'Good' : 'Again');
    const nextCards = state.cards.some((c) => c.id === cardState.id)
      ? state.cards.map((c) => (c.id === cardState.id ? updatedCard : c))
      : [...state.cards, updatedCard];
    await storage.saveCards(nextCards);

    if (correct) {
      const xpResult = await storage.addXp(10);
      await storage.addActivity({ text: 'Vocabulary quiz correct answer', xp: 10 });
      toast.success('+10 XP');
      if (xpResult.leveledUp) toast.success(`Level up! Level ${xpResult.level}`);
    }
  }

  return (
    <PageShell title="Vocabulary Studio">
      <div className="card p-4">
        <div className="grid gap-2 sm:grid-cols-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search words..." className="rounded bg-black/20 p-2" />
          <select value={pos} onChange={(e) => setPos(e.target.value)} className="rounded bg-black/20 p-2">
            <option value="all">All POS</option><option value="noun">noun</option><option value="verb">verb</option><option value="adjective">adjective</option><option value="greeting">greeting</option><option value="expression">expression</option>
          </select>
          <select value={jlpt} onChange={(e) => setJlpt(e.target.value as 'ALL'|'N5'|'N4'|'N3')} className="rounded bg-black/20 p-2">
            <option>ALL</option><option>N5</option><option>N4</option><option>N3</option>
          </select>
          <button onClick={() => setMode((m) => m === 'mc' ? 'typing' : 'mc')} className="rounded bg-primary px-3 py-2">Mode: {mode}</button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="card max-h-[60vh] overflow-y-auto p-3">
          <div className="grid gap-2">
            {words.slice(0, 120).map((w) => (
              <div key={w.id} className="rounded border border-white/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-jp text-xl">{w.word} <span className="text-sm text-white/70">({w.reading})</span></p>
                  <button onClick={() => speakJapanese(w.word)} className="rounded bg-white/10 px-2 py-1 text-xs">Play</button>
                </div>
                <p className="text-sm text-white/80">{w.meaning.join(', ')} • {w.part_of_speech} • {w.jlpt}</p>
              </div>
            ))}
          </div>
        </div>
        {card && (
          <div className="card p-4">
            <p className="text-sm text-white/70">SRS Flashcard</p>
            <div className="mt-2 font-jp text-4xl">{card.word}</div>
            <p className="text-white/70">{card.reading}</p>
            {mode === 'mc' ? (
              <div className="mt-3 grid gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { void handleAnswer(opt); }}
                    disabled={selectedOption !== null}
                    className={`rounded border p-2 text-left ${
                      selectedOption === null
                        ? 'border-white/15'
                        : opt === correctAnswer
                          ? 'border-emerald-400 bg-emerald-500/30'
                          : opt === selectedOption
                            ? 'border-red-400 bg-red-500/30'
                            : 'border-white/15 opacity-70'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                {selectedOption !== null && (
                  <p className={`text-sm ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isCorrect ? 'Correct!' : `Incorrect. Correct answer: ${correctAnswer}`}
                  </p>
                )}
              </div>
            ) : <input className="mt-3 w-full rounded bg-black/20 p-2" placeholder="Type the meaning..." />}
            {selectedOption !== null && (
              <button onClick={() => setCardIdx((i) => i + 1)} className="mt-3 rounded bg-primary px-3 py-2">Next Card</button>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
