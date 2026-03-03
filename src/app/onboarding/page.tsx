'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { storage } from '@/lib/storage';

const questions = [
  ['「あ」はどれ？', ['ア', 'あ', '亜'], 1],
  ['「水」の読みは？', ['みず', 'ひ', 'き'], 0],
  ['「食べる」の意味は？', ['to eat', 'to read', 'to run'], 0],
  ['「学校」は？', ['station', 'school', 'hospital'], 1],
  ['「行きます」の辞書形は？', ['行く', '行った', '行ける'], 0],
  ['Particle for direct object?', ['を', 'に', 'で'], 0],
  ['Past form of 飲む', ['飲まない', '飲んだ', '飲める'], 1],
  ['「友達」means?', ['family', 'friend', 'teacher'], 1],
  ['Potential form expresses?', ['obligation', 'ability', 'comparison'], 1],
  ['「〜ている」often means?', ['ongoing action', 'command', 'quotation'], 0],
  ['Condition if/when completed?', ['たら', 'と', 'から'], 0],
  ['「高い」means?', ['cheap', 'expensive/high', 'early'], 1],
  ['Correct: 日本語___勉強します', ['を', 'が', 'で'], 0],
  ['「聞く」means?', ['to ask/listen', 'to write', 'to sleep'], 0],
  ['「京都へ___」', ['行きます', '見ます', '食べます'], 0],
  ['JLPT N5 mostly covers?', ['basic', 'advanced business', 'literature'], 0],
  ['「〜なければならない」', ['must', 'might', 'already'], 0],
  ['「昨日」is?', ['tomorrow', 'today', 'yesterday'], 2],
  ['「勉強する」is?', ['verb', 'adjective', 'particle'], 0],
  ['「雨」means?', ['snow', 'rain', 'wind'], 1]
] as const;

function mapLevel(score: number) {
  if (score <= 7) return 'N5';
  if (score <= 12) return 'N4';
  if (score <= 17) return 'N3';
  return 'N2';
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(10);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const level = useMemo(() => mapLevel(score), [score]);

  async function finish() {
    const state = await storage.getState();
    await storage.saveProfile({
      ...state.profile,
      name: name || 'Guest',
      daily_goal_minutes: goal,
      jlpt_level: level
    });
    await storage.setOnboardingDone(true);
    router.push('/dashboard');
  }

  return (
    <PageShell title="Onboarding">
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8 text-center">
              <div className="font-jp text-4xl">ようこそ</div>
              <p className="mt-3 text-white/80">Your premium path to Japanese mastery.</p>
              <button onClick={() => setStep(1)} className="mt-6 rounded-lg bg-primary px-5 py-2">Begin</button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8">
              <label className="block text-sm">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-white/20 bg-black/20 p-3" placeholder="Aiko" />
              <p className="mt-4 text-sm">Daily goal (minutes)</p>
              <div className="mt-2 flex gap-2">{[5,10,15,20].map((m) => <button key={m} onClick={() => setGoal(m)} className={`rounded-lg px-3 py-2 ${goal===m?'bg-primary':'bg-white/10'}`}>{m}</button>)}</div>
              <button onClick={() => setStep(2)} className="mt-6 rounded-lg bg-primary px-5 py-2">Continue</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8">
              <p className="text-sm text-white/70">Assessment {idx + 1}/20</p>
              <h2 className="mt-2 text-xl">{questions[idx][0]}</h2>
              <div className="mt-4 grid gap-2">
                {questions[idx][1].map((opt, oi) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (oi === questions[idx][2]) setScore((s) => s + 1);
                      if (idx === questions.length - 1) setStep(3);
                      else setIdx((i) => i + 1);
                    }}
                    className="rounded-lg border border-white/15 bg-white/5 p-3 text-left hover:border-primary"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
              <p className="text-sm text-white/70">Assessment complete</p>
              <div className="mt-3 text-3xl font-bold">Estimated level: {level}</div>
              <p className="mt-2 text-white/80">Score: {score}/20</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button onClick={finish} className="rounded-lg bg-primary px-4 py-2">Create account later</button>
                <button onClick={finish} className="rounded-lg border border-white/20 px-4 py-2">Continue as guest</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
