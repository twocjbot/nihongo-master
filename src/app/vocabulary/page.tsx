'use client';

import { useMemo, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { vocabularyList } from '@/data/vocabulary';
import { speakJapanese } from '@/lib/tts';

export default function VocabularyPage() {
  const [q, setQ] = useState('');
  const [pos, setPos] = useState('all');
  const [jlpt, setJlpt] = useState<'ALL'|'N5'|'N4'|'N3'>('ALL');
  const [cardIdx, setCardIdx] = useState(0);
  const [mode, setMode] = useState<'mc'|'typing'>('mc');

  const words = useMemo(() => vocabularyList.filter((v) => {
    const matchQ = [v.word, v.reading, v.meaning.join(' ')].join(' ').toLowerCase().includes(q.toLowerCase());
    const matchPos = pos === 'all' || v.part_of_speech === pos;
    const matchJlpt = jlpt === 'ALL' || v.jlpt === jlpt;
    return matchQ && matchPos && matchJlpt;
  }), [q, pos, jlpt]);

  const card = words[cardIdx % Math.max(1, words.length)];

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
                {[card.meaning[0], 'dummy 1', 'dummy 2', 'dummy 3'].sort(() => Math.random() - 0.5).map((opt) => (
                  <button key={opt} className="rounded border border-white/15 p-2 text-left">{opt}</button>
                ))}
              </div>
            ) : <input className="mt-3 w-full rounded bg-black/20 p-2" placeholder="Type the meaning..." />}
            <button onClick={() => setCardIdx((i) => i + 1)} className="mt-3 rounded bg-primary px-3 py-2">Next</button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
