'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { CardFlip } from '@/components/CardFlip';
import { kanjiList } from '@/data/kanji';

export default function KanjiPage() {
  const [level, setLevel] = useState<'ALL' | 'N5' | 'N4' | 'N3'>('ALL');
  const [selected, setSelected] = useState(kanjiList[0]);

  const filtered = useMemo(() => level === 'ALL' ? kanjiList : kanjiList.filter((k) => k.jlpt === level), [level]);

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
              <div className="font-jp text-7xl">{selected.character}</div>
              <div className="text-right text-sm text-white/70">JLPT {selected.jlpt}<br />{selected.stroke_count} strokes</div>
            </div>
            <motion.svg viewBox="0 0 120 120" className="mt-3 h-28 w-28">
              <motion.path d="M20,20 L100,20 L100,100 L20,100 Z" fill="none" stroke="#ff6b8a" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
            </motion.svg>
            <p className="mt-2 text-white/80">{selected.meaning.join(', ')}</p>
            <p className="text-sm">On: {selected.onyomi.join(' / ')}</p>
            <p className="text-sm">Kun: {selected.kunyomi.join(' / ')}</p>
          </div>

          <CardFlip
            front={<div className="text-center"><div className="font-jp text-6xl">{selected.character}</div><p className="mt-2 text-sm">Tap to flip</p></div>}
            back={<div><p className="text-sm">Meanings: {selected.meaning.join(', ')}</p><p className="mt-2 text-sm">Example: {selected.examples[0]?.word} ({selected.examples[0]?.reading})</p><div className="mt-3 flex gap-2 text-xs">{['Again','Hard','Good','Easy'].map((r)=><button key={r} className="rounded bg-white/10 px-2 py-1">{r}</button>)}</div></div>}
          />
        </div>
      </div>
    </PageShell>
  );
}
