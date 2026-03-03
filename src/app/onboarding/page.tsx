'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PageShell } from '@/components/PageShell';
import { storage } from '@/lib/storage';
import { buildThemeVocabulary, estimateLevelFromVocab, searchAniListShow } from '@/lib/immersion';
import { ImmersionShow } from '@/lib/types';
import { uid } from '@/lib/utils';

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
  ['「〜ている」often means?', ['ongoing action', 'command', 'quotation'], 0]
] as const;

function mapLevel(score: number) {
  if (score <= 3) return 'N5';
  if (score <= 6) return 'N4';
  if (score <= 8) return 'N3';
  return 'N2';
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(10);
  const [motivation, setMotivation] = useState<'Anime' | 'Travel' | 'Work' | 'School' | 'Culture'>('Anime');
  const [prefersImmersion, setPrefersImmersion] = useState(true);

  const [showQuery, setShowQuery] = useState('');
  const [loadingShow, setLoadingShow] = useState(false);
  const [seedShow, setSeedShow] = useState<ImmersionShow | null>(null);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const level = useMemo(() => mapLevel(score), [score]);

  async function addSeedShow() {
    if (!showQuery.trim()) return;
    setLoadingShow(true);
    try {
      const media = await searchAniListShow(showQuery.trim());
      const vocab = await buildThemeVocabulary(media.description ?? '');
      const show: ImmersionShow = {
        id: uid('show'),
        anilist_id: media.id,
        title: media.title?.romaji ?? showQuery,
        native_title: media.title?.native,
        description: media.description ?? '',
        cover_image: media.coverImage?.large ?? media.coverImage?.medium,
        status: 'Watching',
        level_estimate: estimateLevelFromVocab(vocab),
        vocabulary: vocab,
        phrases: [],
        watch_logs: [],
        created_at: new Date().toISOString()
      };
      setSeedShow(show);
      toast.success('Show linked to your profile');
    } catch {
      toast.error('Could not find that show right now');
    } finally {
      setLoadingShow(false);
    }
  }

  async function finish() {
    const state = await storage.getState();
    const finalLevel = seedShow ? estimateLevelFromVocab(seedShow.vocabulary) : level;
    await storage.saveProfile({
      ...state.profile,
      name: name || 'Guest',
      daily_goal_minutes: goal,
      jlpt_level: finalLevel,
      prefers_immersion: prefersImmersion,
      motivation,
      current_show_id: seedShow?.id
    });

    if (seedShow) {
      await storage.saveImmersionShows([seedShow, ...state.immersionShows]);
    }

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
              <p className="mt-3 text-white/80">Personalize your Nihongo Master v2 experience.</p>
              <button onClick={() => setStep(1)} className="mt-6 rounded-lg bg-primary px-5 py-2">Begin</button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4 p-8">
              <div>
                <label className="block text-sm">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-white/20 bg-black/20 p-3" placeholder="Aiko" />
              </div>
              <div>
                <p className="text-sm">Daily goal (minutes)</p>
                <div className="mt-2 flex gap-2">{[5, 10, 15, 20].map((m) => <button key={m} onClick={() => setGoal(m)} className={`rounded-lg px-3 py-2 ${goal === m ? 'bg-primary' : 'bg-white/10'}`}>{m}</button>)}</div>
              </div>
              <div>
                <p className="text-sm">What is your main motivation?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['Anime', 'Travel', 'Work', 'School', 'Culture'] as const).map((m) => (
                    <button key={m} onClick={() => setMotivation(m)} className={`rounded-lg px-3 py-2 text-sm ${motivation === m ? 'bg-primary' : 'bg-white/10'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm">Are you learning for anime/manga?</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setPrefersImmersion(true)} className={`rounded-lg px-3 py-2 ${prefersImmersion ? 'bg-primary' : 'bg-white/10'}`}>Yes</button>
                  <button onClick={() => setPrefersImmersion(false)} className={`rounded-lg px-3 py-2 ${!prefersImmersion ? 'bg-primary' : 'bg-white/10'}`}>No</button>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="rounded-lg bg-primary px-5 py-2">Continue</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="shows" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8">
              <p className="text-sm">Any shows you are currently watching?</p>
              <div className="mt-3 flex gap-2">
                <input value={showQuery} onChange={(e) => setShowQuery(e.target.value)} className="w-full rounded-lg border border-white/20 bg-black/20 p-3" placeholder="e.g. 鬼滅の刃 / Attack on Titan" />
                <button onClick={addSeedShow} disabled={loadingShow} className="rounded-lg bg-primary px-4 py-2">{loadingShow ? '...' : 'Add'}</button>
              </div>
              {seedShow && <p className="mt-3 text-sm text-emerald-300">Added: {seedShow.native_title || seedShow.title}</p>}
              <button onClick={() => setStep(3)} className="mt-5 rounded-lg border border-white/20 px-5 py-2">Continue</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-8">
              <p className="text-sm text-white/70">Assessment {idx + 1}/{questions.length}</p>
              <h2 className="mt-2 text-xl">{questions[idx][0]}</h2>
              <div className="mt-4 grid gap-2">
                {questions[idx][1].map((opt, oi) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (oi === questions[idx][2]) setScore((s) => s + 1);
                      if (idx === questions.length - 1) setStep(4);
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

          {step === 4 && (
            <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
              <p className="text-sm text-white/70">Assessment complete</p>
              <div className="mt-3 text-3xl font-bold">Estimated level: {seedShow ? estimateLevelFromVocab(seedShow.vocabulary) : level}</div>
              <p className="mt-2 text-white/80">Score: {score}/{questions.length}</p>
              <p className="mt-2 text-sm text-white/70">Motivation: {motivation} · Immersion-first dashboard: {prefersImmersion ? 'Enabled' : 'Disabled'}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button onClick={finish} className="rounded-lg bg-primary px-4 py-2">Start Learning</button>
                <button onClick={finish} className="rounded-lg border border-white/20 px-4 py-2">Continue as guest</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
