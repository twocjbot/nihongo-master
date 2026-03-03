'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { storage } from '@/lib/storage';

export default function SettingsPage() {
  const [goal, setGoal] = useState(10);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [exported, setExported] = useState('');

  useEffect(() => {
    storage.getState().then((s) => {
      setGoal(s.profile.daily_goal_minutes);
      setSupabaseUrl(s.settings.supabaseUrl ?? '');
      setSupabaseAnonKey(s.settings.supabaseAnonKey ?? '');
      setOpenaiApiKey(s.settings.openaiApiKey ?? '');
    });
  }, []);

  async function save() {
    const s = await storage.getState();
    await storage.saveProfile({ ...s.profile, daily_goal_minutes: goal });
    await storage.saveSettings({ supabaseUrl, supabaseAnonKey, openaiApiKey });
  }

  async function exportJson() {
    setExported(await storage.exportData());
  }

  return (
    <PageShell title="Settings">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3 p-5">
          <label className="text-sm">Daily Study Goal (minutes)</label>
          <input type="number" value={goal} onChange={(e)=>setGoal(Number(e.target.value) || 10)} className="w-full rounded bg-black/20 p-2" />
          <label className="text-sm">Supabase URL</label>
          <input value={supabaseUrl} onChange={(e)=>setSupabaseUrl(e.target.value)} className="w-full rounded bg-black/20 p-2" placeholder="https://..." />
          <label className="text-sm">Supabase anon key</label>
          <input value={supabaseAnonKey} onChange={(e)=>setSupabaseAnonKey(e.target.value)} className="w-full rounded bg-black/20 p-2" placeholder="ey..." />
          <label className="text-sm">OpenAI API key</label>
          <input value={openaiApiKey} onChange={(e)=>setOpenaiApiKey(e.target.value)} className="w-full rounded bg-black/20 p-2" placeholder="sk-..." />
          <button onClick={save} className="rounded bg-primary px-4 py-2">Save settings</button>
        </div>

        <div className="card space-y-3 p-5">
          <button onClick={() => storage.resetAll()} className="rounded bg-red-500 px-4 py-2">Reset Progress</button>
          <button onClick={exportJson} className="rounded bg-accent px-4 py-2 text-black">Export Data as JSON</button>
          <textarea value={exported} readOnly className="h-64 w-full rounded bg-black/20 p-2 text-xs" />
        </div>
      </div>
    </PageShell>
  );
}
