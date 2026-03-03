'use client';

import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { readingPassages } from '@/data/reading';
import { speakJapanese } from '@/lib/tts';

export default function ReadingPage() {
  const [selected, setSelected] = useState(readingPassages[0]);
  const [furigana, setFurigana] = useState(true);
  const [popup, setPopup] = useState<{ word: string; meaning: string } | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);

  return (
    <PageShell title="Reading Room">
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <aside className="card p-2">
          {readingPassages.map((p) => (
            <button key={p.id} onClick={() => { setSelected(p); setAnswer(null); }} className="mb-1 w-full rounded p-3 text-left hover:bg-white/10">
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-white/60">{p.level}</div>
            </button>
          ))}
        </aside>

        <section className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFurigana((f) => !f)} className="rounded bg-white/10 px-3 py-1">Furigana: {furigana ? 'ON' : 'OFF'}</button>
              <button onClick={() => speakJapanese(selected.text)} className="rounded bg-primary px-3 py-1">Read Aloud</button>
            </div>
            <h2 className="mt-3 text-2xl font-semibold">{selected.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-lg leading-8 font-jp">{furigana ? selected.furigana_text : selected.text}</p>
            <p className="mt-3 text-white/75">{selected.translation}</p>
          </div>

          <div className="card p-5">
            <p className="mb-2 text-sm text-white/70">Tap vocabulary</p>
            <div className="flex flex-wrap gap-2">
              {selected.vocabulary.map((v) => (
                <button key={v.word} onClick={() => setPopup({ word: `${v.word} (${v.reading})`, meaning: v.meaning })} className="rounded border border-white/20 px-2 py-1 text-sm">{v.word}</button>
              ))}
            </div>
            {popup && <div className="mt-3 rounded bg-white/10 p-3 text-sm">{popup.word}: {popup.meaning}</div>}
          </div>

          <div className="card p-5">
            <p className="font-semibold">Comprehension</p>
            {selected.comprehension_questions.map((q, qi) => (
              <div key={qi} className="mt-2">
                <p>{q.question}</p>
                <div className="mt-1 grid gap-2 sm:grid-cols-3">
                  {q.options.map((o, oi) => (
                    <button key={o} onClick={() => setAnswer(oi)} className={`rounded p-2 ${answer===oi?'bg-primary':'bg-white/10'}`}>{o}</button>
                  ))}
                </div>
                {answer !== null && <p className="mt-2 text-sm">{answer === q.correct ? 'Correct' : `Try again. Correct: ${q.options[q.correct]}`}</p>}
              </div>
            ))}
            <button className="mt-3 rounded bg-accent px-3 py-1 text-black">Add Passage Vocab to SRS</button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
