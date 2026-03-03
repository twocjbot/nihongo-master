'use client';

import { useMemo, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { speakJapanese } from '@/lib/tts';

const sentences = ['今日はいい天気ですね。', '駅まで電車で行きます。', '日本語の勉強は毎日しています。'];
const numbers = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'];
const kana = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'];

export default function ListeningPage() {
  const [dictation, setDictation] = useState('');
  const [speed, setSpeed] = useState(1);
  const [target] = useState(sentences[1]);
  const [kanaAnswer, setKanaAnswer] = useState('');
  const kanaTarget = useMemo(() => kana[Math.floor(Math.random() * kana.length)], []);

  return (
    <PageShell title="Listening Lab">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <p className="font-semibold">Sentence Dictation</p>
          <button onClick={() => speakJapanese(target)} className="mt-2 rounded bg-primary px-3 py-1">Play sentence</button>
          <input value={dictation} onChange={(e)=>setDictation(e.target.value)} className="mt-2 w-full rounded bg-black/20 p-2" placeholder="Type what you hear..." />
          <p className="mt-2 text-sm">{dictation ? (dictation === target ? 'Perfect' : 'Keep listening') : ' '}</p>
        </div>

        <div className="card p-4">
          <p className="font-semibold">Shadowing Practice</p>
          <div className="mt-2 flex gap-2">{[0.5,0.75,1].map((s)=><button key={s} onClick={()=>setSpeed(s)} className={`rounded px-3 py-1 ${speed===s?'bg-primary':'bg-white/10'}`}>{s}x</button>)}</div>
          <button onClick={() => speakJapanese(sentences[0], speed)} className="mt-3 rounded bg-accent px-3 py-1 text-black">Play at {speed}x</button>
        </div>

        <div className="card p-4">
          <p className="font-semibold">Number Practice</p>
          <button onClick={() => speakJapanese(numbers[Math.floor(Math.random() * numbers.length)])} className="mt-2 rounded bg-primary px-3 py-1">Play random number</button>
        </div>

        <div className="card p-4">
          <p className="font-semibold">Kana Listening Quiz</p>
          <button onClick={() => speakJapanese(kanaTarget)} className="mt-2 rounded bg-primary px-3 py-1">Play kana</button>
          <input value={kanaAnswer} onChange={(e)=>setKanaAnswer(e.target.value)} className="mt-2 w-full rounded bg-black/20 p-2" placeholder="Type kana" />
          <p className="mt-2 text-sm">{kanaAnswer ? (kanaAnswer === kanaTarget ? 'Correct' : 'Try again') : ''}</p>
        </div>
      </div>

      <div className="mt-6 card p-5 opacity-60">
        <p className="text-lg font-semibold">AI Features (Demo)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-white/20 p-3">
            <p className="font-semibold">AI Conversation Partner</p>
            <p className="text-sm text-white/70">[Conversation UI preview disabled]</p>
          </div>
          <div className="rounded border border-white/20 p-3">
            <p className="font-semibold">AI Grammar Correction</p>
            <p className="text-sm text-white/70">[Correction UI preview disabled]</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-accent">Connect OpenAI API key in Settings to unlock.</p>
      </div>
    </PageShell>
  );
}
