'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { storage } from '@/lib/storage';
import { isDue } from '@/lib/sm2';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';

function sixMonthHeatmap() {
  return Array.from({ length: 180 }).map((_, i) => ({ day: i, value: Math.floor(Math.random() * 5) }));
}

export default function ProgressPage() {
  const [state, setState] = useState<Awaited<ReturnType<typeof storage.getState>> | null>(null);

  useEffect(() => { storage.getState().then(setState); }, []);

  const heatmap = useMemo(() => sixMonthHeatmap(), []);
  const xpData = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({ week: `W${i+1}`, xp: i * 120 + Math.floor(Math.random() * 80) })), []);
  const accData = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({ day: i + 1, acc: 60 + Math.floor(Math.random() * 40) })), []);
  const mastery = [
    { name: 'N5', kanji: 62, vocab: 71, grammar: 55 },
    { name: 'N4', kanji: 38, vocab: 47, grammar: 30 },
    { name: 'N3', kanji: 14, vocab: 18, grammar: 10 }
  ];

  if (!state) return <PageShell title="Progress"><div>Loading...</div></PageShell>;

  const dueForecast = Array.from({ length: 7 }).map((_, i) => ({ day: `+${i+1}`, due: state.cards.filter((c) => {
    const d = new Date(c.due_date).getTime();
    const lo = Date.now() + i * 86400000;
    const hi = Date.now() + (i + 1) * 86400000;
    return d >= lo && d < hi;
  }).length }));

  return (
    <PageShell title="Progress Dashboard">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <p className="mb-3 font-semibold">Study Heatmap (6 months)</p>
          <div className="grid grid-cols-18 gap-1">
            {heatmap.map((h) => <div key={h.day} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `rgba(255,107,138,${0.1 + h.value * 0.2})` }} />)}
          </div>
        </div>

        <div className="card p-4">
          <p className="mb-3 font-semibold">XP Growth</p>
          <div className="h-48"><ResponsiveContainer><AreaChart data={xpData}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" /><XAxis dataKey="week" stroke="#fff" /><YAxis stroke="#fff" /><Tooltip /><Area type="monotone" dataKey="xp" stroke="#ff6b8a" fill="#ff6b8a66" /></AreaChart></ResponsiveContainer></div>
        </div>

        <div className="card p-4">
          <p className="mb-3 font-semibold">Mastery by JLPT</p>
          <div className="h-52"><ResponsiveContainer><BarChart data={mastery}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" /><XAxis dataKey="name" stroke="#fff" /><YAxis stroke="#fff" /><Tooltip /><Bar dataKey="kanji" fill="#ff6b8a" /><Bar dataKey="vocab" fill="#f5c842" /><Bar dataKey="grammar" fill="#9be7ff" /></BarChart></ResponsiveContainer></div>
        </div>

        <div className="card p-4">
          <p className="mb-3 font-semibold">Review Accuracy</p>
          <div className="h-52"><ResponsiveContainer><LineChart data={accData}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" /><XAxis dataKey="day" stroke="#fff" /><YAxis stroke="#fff" /><Tooltip /><Line type="monotone" dataKey="acc" stroke="#f5c842" /></LineChart></ResponsiveContainer></div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="card p-4">Total study time: {Math.round(state.sessions.reduce((a,b)=>a+b.duration_ms,0)/60000)} min</div>
        <div className="card p-4">Due now: {state.cards.filter(isDue).length}</div>
        <div className="card p-4">Badges: 7-day streak, 100 kanji, N5 Complete</div>
      </div>

      <div className="mt-4 card p-4">
        <p className="mb-2 font-semibold">SRS Review Forecast (7 days)</p>
        <div className="grid grid-cols-7 gap-2">{dueForecast.map((d)=><div key={d.day} className="rounded bg-white/10 p-2 text-center text-sm">{d.day}<br />{d.due}</div>)}</div>
      </div>
    </PageShell>
  );
}
