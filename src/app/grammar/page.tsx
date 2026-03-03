'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PageShell } from '@/components/PageShell';
import { grammarList } from '@/data/grammar';
import { storage } from '@/lib/storage';

export default function GrammarPage() {
  const [selected, setSelected] = useState(grammarList[0]);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const exercise = selected.examples[exerciseIdx % selected.examples.length];
  const expectedAnswer = useMemo(() => {
    const stripped = exercise.japanese.replace(/[。！？]/g, '');
    const chunks = stripped
      .split(/は|が|を|に|で|と|へ|から|まで|も/)
      .map((c) => c.trim())
      .filter((c) => c.length >= 2);
    return chunks[chunks.length - 1] ?? stripped;
  }, [exercise.japanese]);
  const blankedJapanese = useMemo(
    () => exercise.japanese.replace(expectedAnswer, '___'),
    [exercise.japanese, expectedAnswer]
  );

  async function submitAnswer() {
    const ok = answer.trim().toLowerCase() === expectedAnswer.trim().toLowerCase();
    setSubmitted(true);
    setCorrect(ok);
    if (!ok) return;

    const xpResult = await storage.addXp(10);
    await storage.addActivity({ text: `Grammar exercise correct: ${selected.pattern}`, xp: 10 });
    toast.success('+10 XP');
    if (xpResult.leveledUp) toast.success(`Level up! Level ${xpResult.level}`);
  }

  function nextExercise() {
    setExerciseIdx((i) => (i + 1) % selected.examples.length);
    setAnswer('');
    setSubmitted(false);
    setCorrect(false);
  }

  function pickGrammar(gid: string) {
    const next = grammarList.find((g) => g.id === gid);
    if (!next) return;
    setSelected(next);
    setExerciseIdx(0);
    setAnswer('');
    setSubmitted(false);
    setCorrect(false);
  }

  return (
    <PageShell title="Grammar Dojo">
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <aside className="card max-h-[70vh] overflow-y-auto p-2">
          {grammarList.map((g) => (
            <button key={g.id} onClick={() => pickGrammar(g.id)} className="mb-1 w-full rounded p-2 text-left hover:bg-white/10">
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
            <p className="mt-2 text-sm text-white/70">Prompt: {exercise.english}</p>
            <p className="mt-2 font-jp text-lg">{blankedJapanese}</p>
            <input value={answer} onChange={(e)=>setAnswer(e.target.value)} className="mt-2 w-full rounded bg-black/20 p-2" placeholder="Type missing Japanese" />
            <div className="mt-3 flex gap-2">
              <button onClick={() => { void submitAnswer(); }} className="rounded bg-primary px-3 py-2">Submit</button>
              <button onClick={nextExercise} className="rounded bg-white/10 px-3 py-2">Next exercise</button>
            </div>
            {submitted && (
              <p className={`mt-2 text-sm ${correct ? 'text-emerald-300' : 'text-red-300'}`}>
                {correct ? '✅ Correct' : `❌ Incorrect. Correct answer: ${expectedAnswer}`}
              </p>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
