'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { kanjiList } from '@/data/kanji';
import { vocabularyList } from '@/data/vocabulary';
import { speakJapanese } from '@/lib/tts';

type GameId = 'galaxy' | 'dojo' | 'vortex' | 'typer' | 'bingo' | 'builder' | null;

const GAMES = [
  { id: 'galaxy', emoji: '🌌', title: 'Kanji Galaxy', desc: 'Float through space and collect kanji orbs', color: 'from-indigo-900 to-purple-900' },
  { id: 'dojo', emoji: '⚔️', title: 'Kanji Dojo', desc: 'Defeat enemies by typing their kanji readings', color: 'from-red-900 to-orange-900' },
  { id: 'vortex', emoji: '🌀', title: 'Word Vortex', desc: 'Words spiral toward you — type fast or lose', color: 'from-cyan-900 to-blue-900' },
  { id: 'typer', emoji: '⚡', title: 'Speed Typer', desc: 'Race against the clock to type readings', color: 'from-yellow-900 to-orange-900' },
  { id: 'bingo', emoji: '🎴', title: 'Listening Bingo', desc: 'Hear the word, find it on your card', color: 'from-green-900 to-teal-900' },
  { id: 'builder', emoji: '🧩', title: 'Grammar Builder', desc: 'Arrange tiles to form correct sentences', color: 'from-pink-900 to-rose-900' },
] as const;

// ── Kanji Galaxy ──────────────────────────────────────────────────────────────
function KanjiGalaxy() {
  const items = kanjiList.slice(0, 24);
  const [selected, setSelected] = useState<typeof items[0] | null>(null);
  const [answered, setAnswered] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);

  function attempt() {
    if (!selected) return;
    const correct = [...selected.onyomi, ...selected.kunyomi].some(r =>
      r.replace(/-/g, '').toLowerCase() === input.trim().toLowerCase()
    );
    setAnswered(a => ({ ...a, [selected.id]: correct ? 'correct' : 'wrong' }));
    if (correct) setScore(s => s + 10);
    setInput('');
    setSelected(null);
  }

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#02040f]">
      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.7 + 0.3 }} />
      ))}

      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">🌌 Kanji Galaxy</h2>
          <span className="text-accent font-bold">Score: {score}</span>
        </div>

        {/* Orb grid */}
        <div className="grid grid-cols-6 gap-3 mb-4">
          {items.map((k) => {
            const state = answered[k.id];
            return (
              <motion.button
                key={k.id}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { if (!answered[k.id]) setSelected(k); }}
                className="relative flex h-12 w-12 items-center justify-center rounded-full font-jp text-xl shadow-lg"
                style={{
                  background: state === 'correct' ? 'radial-gradient(circle, #22c55e, #166534)' :
                    state === 'wrong' ? 'radial-gradient(circle, #ef4444, #7f1d1d)' :
                    k.jlpt === 'N5' ? 'radial-gradient(circle, #ff6b8a, #9d1735)' :
                    k.jlpt === 'N4' ? 'radial-gradient(circle, #f5c842, #92610a)' :
                    'radial-gradient(circle, #60a5fa, #1e3a8a)',
                  boxShadow: selected?.id === k.id ? '0 0 16px 4px rgba(255,255,255,0.5)' :
                    k.jlpt === 'N5' ? '0 0 8px 1px rgba(255,107,138,0.5)' : '0 0 6px 1px rgba(96,165,250,0.3)',
                }}
              >
                {k.character}
              </motion.button>
            );
          })}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="font-jp text-3xl text-center mb-1">{selected.character}</p>
            <p className="text-sm text-center text-white/70 mb-3">{selected.meaning.join(', ')}</p>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && attempt()}
                placeholder="Type the reading..." autoFocus
                className="flex-1 rounded bg-black/30 px-3 py-2 text-white placeholder-white/40 outline-none border border-white/20" />
              <button onClick={attempt} className="rounded bg-primary px-4 py-2 font-semibold">Go</button>
            </div>
            <p className="text-xs text-white/50 mt-2">On: {selected.onyomi.join('、')} / Kun: {selected.kunyomi.join('、')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Kanji Dojo ────────────────────────────────────────────────────────────────
function KanjiDojo() {
  const pool = kanjiList.slice(0, 30);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null);

  const current = pool[idx % pool.length];

  function attack() {
    const correct = [...current.onyomi, ...current.kunyomi].some(r =>
      r.replace(/-/g, '').toLowerCase() === input.trim().toLowerCase()
    );
    setFlash(correct ? 'hit' : 'miss');
    setTimeout(() => setFlash(null), 400);
    if (correct) { setScore(s => s + 15); setIdx(i => i + 1); }
    else setLives(l => Math.max(0, l - 1));
    setInput('');
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-stone-900 to-stone-950 p-6 min-h-[480px]">
      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold">⚔️ Kanji Dojo</span>
        <span className="text-accent font-bold">Score: {score}</span>
      </div>
      <div className="flex gap-2 mb-6">{Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className="text-2xl">{i < lives ? '⛩️' : '💀'}</span>
      ))}</div>

      {lives > 0 ? (
        <>
          <div className="relative flex justify-center mb-8">
            <motion.div animate={{ x: flash === 'hit' ? [0, 30, 100] : flash === 'miss' ? [-5, 5, -5, 5, 0] : 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-2">
              <span className="text-5xl">👹</span>
              <span className={`font-jp text-4xl font-bold ${flash === 'hit' ? 'text-green-400' : flash === 'miss' ? 'text-red-400' : 'text-white'}`}>
                {current.character}
              </span>
            </motion.div>
          </div>
          <p className="text-center text-white/60 text-sm mb-4">{current.meaning.join(', ')}</p>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && attack()}
              placeholder="Type reading to defeat..." autoFocus
              className="flex-1 rounded bg-black/30 px-3 py-2 outline-none border border-white/20" />
            <button onClick={attack} className="rounded bg-red-600 px-4 py-2 font-semibold">⚔️</button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">💀 Defeated!</p>
          <p className="text-white/60 mb-4">Final score: {score}</p>
          <button onClick={() => { setLives(3); setScore(0); setIdx(0); }} className="rounded bg-primary px-6 py-2">Play Again</button>
        </div>
      )}
    </div>
  );
}

// ── Word Vortex ───────────────────────────────────────────────────────────────
function WordVortex() {
  const words = vocabularyList.filter(v => v.jlpt === 'N5').slice(0, 20);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(5);
  const current = words[idx % words.length];

  function submit() {
    const correct = current.meaning.some(m => m.toLowerCase().includes(input.trim().toLowerCase()));
    if (correct) setScore(s => s + 10);
    else setHp(h => h - 1);
    setInput('');
    setIdx(i => i + 1);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-blue-950 to-indigo-950 p-6 min-h-[400px] overflow-hidden">
      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold">🌀 Word Vortex</span>
        <span className="text-accent font-bold">Score: {score}</span>
      </div>
      <div className="flex gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < hp ? '❤️' : '🖤'}</span>
      ))}</div>

      <div className="flex flex-col items-center justify-center py-8">
        {[...Array(3)].map((_, i) => {
          const w = words[(idx + i + 1) % words.length];
          return (
            <motion.div key={`${idx}-${i}`}
              initial={{ scale: 0.2, opacity: 0.3, y: -40 }}
              animate={{ scale: 0.4 + i * 0.2, opacity: 0.3 + i * 0.3, y: i * 30 }}
              className="font-jp text-white/40 text-2xl mb-2">{w.word}</motion.div>
          );
        })}
        <motion.div key={idx} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }}
          className="font-jp text-5xl font-bold text-primary my-4">{current.word}</motion.div>
        <p className="text-white/60 text-sm mb-4">{current.reading}</p>
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="English meaning..."
          className="flex-1 rounded bg-black/30 px-3 py-2 outline-none border border-white/20" />
        <button onClick={submit} className="rounded bg-cyan-600 px-4 py-2">→</button>
      </div>
    </div>
  );
}

// ── Speed Typer ───────────────────────────────────────────────────────────────
function SpeedTyper() {
  const pool = vocabularyList.slice(0, 40);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const current = pool[idx % pool.length];

  function submit() {
    const correct = current.meaning.some(m => m.toLowerCase().includes(input.trim().toLowerCase()));
    if (correct) { setScore(s => s + 10 + combo * 2); setCombo(c => c + 1); }
    else setCombo(0);
    setInput('');
    setIdx(i => i + 1);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black p-6 min-h-[360px]"
      style={{ boxShadow: '0 0 40px rgba(245,200,66,0.15)' }}>
      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold text-yellow-400">⚡ Speed Typer</span>
        <span className="text-yellow-400 font-bold">Score: {score} {combo > 1 && <span className="text-orange-400">x{combo}</span>}</span>
      </div>

      <motion.div key={idx} initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="text-center py-8">
        <p className="font-jp text-6xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(245,200,66,0.8)' }}>{current.word}</p>
        <p className="text-white/50 text-sm">{current.reading}</p>
      </motion.div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="English meaning..." autoFocus
          className="flex-1 rounded bg-white/5 px-3 py-2 outline-none border border-yellow-400/30 text-yellow-100" />
        <button onClick={submit} className="rounded bg-yellow-500 px-4 py-2 text-black font-bold">→</button>
      </div>
    </div>
  );
}

// ── Listening Bingo ───────────────────────────────────────────────────────────
function ListeningBingo() {
  const pool = vocabularyList.slice(0, 16).map(v => v.word);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState(0);
  const [won, setWon] = useState(false);

  function play() {
    speakJapanese(pool[current]);
  }

  function mark(i: number) {
    if (pool[i] !== pool[current]) return;
    const next = new Set(marked).add(i);
    setMarked(next);
    setCurrent(c => (c + 1) % pool.length);
    // check rows
    for (let r = 0; r < 4; r++) {
      if ([0,1,2,3].map(c => r*4+c).every(idx => next.has(idx))) { setWon(true); return; }
    }
    for (let c = 0; c < 4; c++) {
      if ([0,1,2,3].map(r => r*4+c).every(idx => next.has(idx))) { setWon(true); return; }
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-green-950 to-teal-950 p-6 min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">🎴 Listening Bingo</span>
        <button onClick={play} className="rounded bg-green-600 px-4 py-2">🔊 Play</button>
      </div>
      {won ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-2">🎉 BINGO!</p>
          <button onClick={() => { setMarked(new Set()); setCurrent(0); setWon(false); }} className="rounded bg-primary px-6 py-2 mt-4">New Game</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {pool.map((w, i) => (
            <button key={i} onClick={() => mark(i)}
              className={`rounded-lg border p-3 font-jp text-lg transition-all ${marked.has(i) ? 'bg-green-500 border-green-400 text-white' : 'bg-white/5 border-white/20 hover:border-green-400'}`}>
              {w}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-white/40 mt-3 text-center">Press Play, then tap the word you hear</p>
    </div>
  );
}

// ── Grammar Builder ───────────────────────────────────────────────────────────
function GrammarBuilder() {
  const puzzles = [
    { english: 'I eat sushi every day.', answer: ['毎日', 'すしを', '食べます', '。'], scrambled: ['食べます', '。', '毎日', 'すしを'] },
    { english: 'I go to school by train.', answer: ['電車で', '学校に', '行きます', '。'], scrambled: ['行きます', '学校に', '。', '電車で'] },
    { english: 'This book is interesting.', answer: ['この', '本は', '面白いです', '。'], scrambled: ['面白いです', 'この', '。', '本は'] },
  ];
  const [pidx, setPidx] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState([...puzzles[0].scrambled]);
  const [hints, setHints] = useState(3);
  const puzzle = puzzles[pidx];
  const correct = placed.join('') === puzzle.answer.join('');

  function place(tile: string) {
    setPlaced(p => [...p, tile]);
    setAvailable(a => { const next = [...a]; next.splice(next.indexOf(tile), 1); return next; });
  }

  function remove(i: number) {
    const tile = placed[i];
    setPlaced(p => p.filter((_, idx) => idx !== i));
    setAvailable(a => [...a, tile]);
  }

  function useHint() {
    if (hints <= 0) return;
    const nextPos = placed.length;
    if (nextPos >= puzzle.answer.length) return;
    const needed = puzzle.answer[nextPos];
    if (available.includes(needed)) { place(needed); setHints(h => h - 1); }
  }

  function next() {
    const ni = (pidx + 1) % puzzles.length;
    setPidx(ni);
    setPlaced([]);
    setAvailable([...puzzles[ni].scrambled]);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-pink-950 to-rose-950 p-6 min-h-[400px]">
      <div className="flex justify-between mb-4">
        <span className="text-lg font-semibold">🧩 Grammar Builder</span>
        <button onClick={useHint} className="rounded bg-white/10 px-3 py-1 text-sm">💡 Hint ({hints})</button>
      </div>
      <p className="text-white/70 mb-4 text-sm">"{puzzle.english}"</p>

      <div className="min-h-[56px] rounded-xl border-2 border-dashed border-white/30 p-3 flex flex-wrap gap-2 mb-4">
        {placed.map((t, i) => (
          <motion.button key={`${t}-${i}`} layout onClick={() => remove(i)}
            className="rounded-lg bg-primary/80 px-3 py-1 font-jp text-lg">{t}</motion.button>
        ))}
        {placed.length === 0 && <span className="text-white/30 text-sm">Tap tiles below to build the sentence</span>}
      </div>

      {correct && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-3 mb-4">
          <p className="text-green-400 text-xl font-bold">✅ Correct!</p>
          <button onClick={next} className="mt-2 rounded bg-primary px-4 py-2">Next Puzzle →</button>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {available.map((t, i) => (
          <motion.button key={`${t}-${i}`} layout whileHover={{ scale: 1.05 }} onClick={() => place(t)}
            className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 font-jp text-lg hover:bg-white/20">{t}</motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────────
export default function GamesHubComponent() {
  const [active, setActive] = useState<GameId>(null);

  const GameComponent = active === 'galaxy' ? KanjiGalaxy
    : active === 'dojo' ? KanjiDojo
    : active === 'vortex' ? WordVortex
    : active === 'typer' ? SpeedTyper
    : active === 'bingo' ? ListeningBingo
    : active === 'builder' ? GrammarBuilder
    : null;

  return (
    <PageShell title="Games">
      {active && GameComponent ? (
        <div>
          <button onClick={() => setActive(null)} className="mb-4 rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20">← Back to Games</button>
          <GameComponent />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => (
            <motion.button key={g.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActive(g.id as GameId)}
              className={`rounded-2xl bg-gradient-to-br ${g.color} border border-white/10 p-6 text-left`}>
              <div className="text-4xl mb-2">{g.emoji}</div>
              <div className="font-semibold text-lg">{g.title}</div>
              <div className="text-white/60 text-sm mt-1">{g.desc}</div>
            </motion.button>
          ))}
        </div>
      )}
    </PageShell>
  );
}
