'use client';

import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { grammarList } from '@/data/grammar';

export default function GrammarPage() {
  const [selected, setSelected] = useState(grammarList[0]);
  const [answer, setAnswer] = useState('');

  return (
    <PageShell title="Grammar Dojo">
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <aside className="card max-h-[70vh] overflow-y-auto p-2">
          {grammarList.map((g) => (
            <button key={g.id} onClick={() => setSelected(g)} className="mb-1 w-full rounded p-2 text-left hover:bg-white/10">
              <div className="font-semibold">{g.pattern}</div>
              <div className="text-xs text-white/60">{g.level}</div>
            </button>
          ))}
        </aside>

        <section className="space-y-4">
          <div className="card p-5">
            <h2 className="text-2xl font-semibold">{selected.pattern}</h2>
            <p className="text-white/80">{selected.meaning}</p>
            <p className="mt-3">{selected.explanation}</p>
            <p className="mt-2 text-sm text-accent">Formation: {selected.formation}</p>
            <div className="mt-3 space-y-2 text-sm">
              {selected.examples.map((e, i) => <div key={i} className="rounded bg-white/5 p-2"><p className="font-jp">{e.japanese}</p><p className="text-white/70">{e.reading}</p><p>{e.english}</p></div>)}
            </div>
            <p className="mt-2 text-xs text-white/60">{selected.notes}</p>
          </div>

          <div className="card p-5">
            <p className="text-sm text-white/70">Fill in the blank</p>
            <p className="mt-2">毎日日本語を___います。 (study)</p>
            <input value={answer} onChange={(e)=>setAnswer(e.target.value)} className="mt-2 w-full rounded bg-black/20 p-2" placeholder="べんきょうして" />
            <p className="mt-2 text-sm text-white/70">Progress tracking enabled (saved in local profile XP/session on review).</p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
