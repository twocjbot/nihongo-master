'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/PageShell';
import { storage } from '@/lib/storage';
import { ImmersionShow, ImmersionTab, ShowStatus, ShowVocabulary } from '@/lib/types';
import { buildThemeVocabulary, estimateLevelFromVocab, parseBulkVocabulary, searchAniListShow, searchJishoWord } from '@/lib/immersion';
import { computeImmersionHours } from '@/lib/rewards';
import { speakJapanese } from '@/lib/tts';
import { uid } from '@/lib/utils';

const tabs: ImmersionTab[] = ['overview', 'vocabulary', 'phrases', 'practice', 'watchlog'];

function dedupeVocab(items: ShowVocabulary[]) {
  const map = new Map<string, ShowVocabulary>();
  items.forEach((item) => map.set(`${item.word}|${item.reading}`, item));
  return [...map.values()].sort((a, b) => b.frequency - a.frequency);
}

export default function ImmersionPage() {
  const [shows, setShows] = useState<ImmersionShow[]>([]);
  const [statusFilter, setStatusFilter] = useState<ShowStatus | 'All'>('All');
  const [selectedId, setSelectedId] = useState<string>('');
  const [tab, setTab] = useState<ImmersionTab>('overview');

  const [query, setQuery] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState('');

  const [jishoQuery, setJishoQuery] = useState('');
  const [loadingWord, setLoadingWord] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  const [phraseJa, setPhraseJa] = useState('');
  const [phraseEn, setPhraseEn] = useState('');
  const [phraseCtx, setPhraseCtx] = useState('');

  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const [episode, setEpisode] = useState('');
  const [minutes, setMinutes] = useState(24);
  const [note, setNote] = useState('');

  useEffect(() => {
    storage.getState().then((s) => {
      setShows(s.immersionShows);
      setSelectedId(s.profile.current_show_id ?? s.immersionShows[0]?.id ?? '');
    });
  }, []);

  const filtered = useMemo(() => (statusFilter === 'All' ? shows : shows.filter((s) => s.status === statusFilter)), [shows, statusFilter]);
  const selected = shows.find((s) => s.id === selectedId) ?? null;
  const totalHours = useMemo(() => computeImmersionHours(shows), [shows]);
  const totalWords = useMemo(() => shows.reduce((sum, s) => sum + s.vocabulary.length, 0), [shows]);
  const completed = useMemo(() => shows.filter((s) => s.status === 'Completed').length, [shows]);

  async function saveShows(next: ImmersionShow[]) {
    setShows(next);
    await storage.saveImmersionShows(next);
  }

  async function updateSelected(update: (show: ImmersionShow) => ImmersionShow) {
    if (!selected) return;
    const nextShow = update(selected);
    const next = shows.map((s) => (s.id === selected.id ? nextShow : s));
    await saveShows(next);
  }

  async function handleSearchAdd(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingAdd(true);
    setErrorAdd('');
    try {
      const media = await searchAniListShow(query.trim());
      const autoVocab = await buildThemeVocabulary(media.description ?? '');
      const show: ImmersionShow = {
        id: uid('show'),
        anilist_id: media.id,
        title: media.title?.romaji ?? query,
        native_title: media.title?.native,
        description: media.description ?? '',
        cover_image: media.coverImage?.large ?? media.coverImage?.medium,
        status: 'Watching',
        level_estimate: estimateLevelFromVocab(autoVocab),
        vocabulary: autoVocab,
        phrases: [],
        watch_logs: [],
        created_at: new Date().toISOString()
      };
      const next = [show, ...shows];
      await saveShows(next);
      setSelectedId(show.id);
      setQuery('');
      toast.success('Show added to library');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add show';
      setErrorAdd(msg);
    } finally {
      setLoadingAdd(false);
    }
  }

  async function addJishoWord(e: FormEvent) {
    e.preventDefault();
    if (!selected || !jishoQuery.trim()) return;
    setLoadingWord(true);
    try {
      const found = await searchJishoWord(jishoQuery.trim());
      await updateSelected((show) => ({ ...show, vocabulary: dedupeVocab([...show.vocabulary, ...found]) }));
      setJishoQuery('');
      toast.success('Word(s) added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch Jisho');
    } finally {
      setLoadingWord(false);
    }
  }

  async function addBulk() {
    if (!selected) return;
    const parsed = parseBulkVocabulary(bulkInput);
    if (!parsed.length) return toast.error('No valid lines found');
    await updateSelected((show) => ({ ...show, vocabulary: dedupeVocab([...show.vocabulary, ...parsed]) }));
    setBulkInput('');
    toast.success(`Imported ${parsed.length} vocab`);
  }

  async function addPhrase(e: FormEvent) {
    e.preventDefault();
    if (!selected || !phraseJa.trim() || !phraseEn.trim()) return;
    await updateSelected((show) => ({
      ...show,
      phrases: [{ id: uid('phrase'), japanese: phraseJa, english: phraseEn, context: phraseCtx || undefined }, ...show.phrases]
    }));
    setPhraseJa('');
    setPhraseEn('');
    setPhraseCtx('');
  }

  async function pushToMainSrs() {
    if (!selected) return;
    const state = await storage.getState();
    const nextCards = [...state.cards];
    selected.vocabulary.forEach((v) => {
      const id = `showvocab:${selected.id}:${v.word}`;
      if (!nextCards.some((c) => c.card_id === id && c.card_type === 'vocabulary')) {
        nextCards.push(storage.createCard('vocabulary', id, state.profile.user_id));
      }
    });
    await storage.saveCards(nextCards);
    toast.success('Show vocabulary added to main SRS queue');
  }

  async function logWatch(e: FormEvent) {
    e.preventDefault();
    if (!selected || !episode.trim() || minutes <= 0) return;
    await updateSelected((show) => ({
      ...show,
      watch_logs: [{ id: uid('watch'), date: new Date().toISOString(), episode, minutes, note: note || undefined }, ...show.watch_logs]
    }));
    setEpisode('');
    setMinutes(24);
    setNote('');
  }

  const practiceCard = selected?.vocabulary[practiceIndex % Math.max(1, selected?.vocabulary.length || 1)];

  return (
    <PageShell title="Media Immersion">
      <section className="card p-4">
        <form onSubmit={handleSearchAdd} className="grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any anime / show title (AniList)"
            className="w-full rounded border border-white/20 bg-black/20 p-2"
          />
          <button disabled={loadingAdd} className="rounded bg-primary px-4 py-2 text-sm disabled:opacity-50">{loadingAdd ? 'Searching...' : 'Add Show'}</button>
        </form>
        {errorAdd && <p className="mt-2 text-sm text-red-300">{errorAdd}</p>}
        <p className="mt-2 text-xs text-white/60">No API keys required. Uses free AniList GraphQL + Jisho API with full loading/error states.</p>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-3">
          <div className="card p-3">
            <p className="text-sm text-white/70">My Library</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(['All', 'Watching', 'Completed', 'Plan to Watch'] as const).map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`rounded px-2 py-1 text-xs ${statusFilter === status ? 'bg-primary' : 'bg-white/10'}`}>
                  {status}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {filtered.map((show) => {
                const mastered = show.vocabulary.filter((v) => v.mastered).length;
                const pct = show.vocabulary.length ? Math.round((mastered / show.vocabulary.length) * 100) : 0;
                return (
                  <button
                    key={show.id}
                    onClick={() => setSelectedId(show.id)}
                    className={`w-full rounded border p-2 text-left ${selectedId === show.id ? 'border-primary bg-primary/10' : 'border-white/15 bg-white/5'}`}
                  >
                    <p className="truncate text-sm font-semibold">{show.native_title || show.title}</p>
                    <p className="text-xs text-white/60">{show.status}</p>
                    <div className="mt-1 h-1.5 rounded bg-white/10">
                      <div className="h-full rounded bg-emerald-400" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="text-xs text-white/60">No shows yet. Add one above.</p>}
            </div>
          </div>

          <div className="card p-3 text-sm">
            <p>Total immersion hours: {totalHours}</p>
            <p>Total words encountered: {totalWords}</p>
            <p>Shows completed: {completed}</p>
          </div>
        </aside>

        <div className="space-y-3">
          {!selected && <div className="card p-5 text-sm text-white/70">Select or add a show to enter study mode.</div>}
          {selected && (
            <>
              <div className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/60">Show Study Mode</p>
                    <h2 className="text-2xl font-semibold">{selected.native_title || selected.title}</h2>
                    <p className="text-sm text-white/70">Estimated level: {selected.level_estimate}</p>
                  </div>
                  <select
                    value={selected.status}
                    onChange={(e) => updateSelected((show) => ({ ...show, status: e.target.value as ShowStatus }))}
                    className="rounded border border-white/20 bg-black/30 p-2 text-sm"
                  >
                    <option>Watching</option>
                    <option>Completed</option>
                    <option>Plan to Watch</option>
                  </select>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tabs.map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`rounded px-3 py-1.5 text-sm ${tab === t ? 'bg-primary' : 'bg-white/10'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {tab === 'overview' && (
                <div className="card p-4">
                  <p className="text-sm text-white/80">{selected.description || 'No description provided.'}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button onClick={pushToMainSrs} className="rounded bg-primary px-3 py-2 text-sm">Add to Main SRS</button>
                    <div className="rounded bg-white/10 p-3 text-xs">
                      <p className="font-semibold">Subtitle import hint</p>
                      <p className="mt-1 text-white/70">Extract subtitle vocab externally, then paste lines as `word,reading,meaning` in bulk import mode.</p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'vocabulary' && (
                <div className="card p-4">
                  <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                    <form onSubmit={addJishoWord} className="flex gap-2">
                      <input value={jishoQuery} onChange={(e) => setJishoQuery(e.target.value)} placeholder="Jisho search word" className="w-full rounded border border-white/20 bg-black/30 p-2" />
                      <button disabled={loadingWord} className="rounded bg-primary px-3 py-2 text-sm">{loadingWord ? '...' : 'Add'}</button>
                    </form>
                    <button onClick={() => selected.vocabulary.slice(0, 1).forEach((v) => speakJapanese(v.word))} className="rounded border border-white/20 px-3 py-2 text-sm">TTS Sample</button>
                  </div>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Bulk paste: word,reading,meaning (one per line)"
                    className="mt-3 h-28 w-full rounded border border-white/20 bg-black/30 p-2"
                  />
                  <button onClick={addBulk} className="mt-2 rounded border border-white/25 px-3 py-2 text-sm">Import Bulk</button>

                  <div className="mt-4 space-y-2">
                    {selected.vocabulary.map((v) => (
                      <div key={v.id} className="flex items-center justify-between rounded bg-white/5 p-2 text-sm">
                        <div>
                          <p className="font-jp">{v.word} ({v.reading})</p>
                          <p className="text-xs text-white/70">{v.meaning}</p>
                        </div>
                        <button onClick={() => speakJapanese(v.word)} className="rounded bg-white/10 px-2 py-1 text-xs">TTS</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'phrases' && (
                <div className="card p-4">
                  <form onSubmit={addPhrase} className="grid gap-2">
                    <input value={phraseJa} onChange={(e) => setPhraseJa(e.target.value)} placeholder="Japanese phrase" className="rounded border border-white/20 bg-black/30 p-2" />
                    <input value={phraseEn} onChange={(e) => setPhraseEn(e.target.value)} placeholder="English meaning" className="rounded border border-white/20 bg-black/30 p-2" />
                    <input value={phraseCtx} onChange={(e) => setPhraseCtx(e.target.value)} placeholder="Context (episode, scene)" className="rounded border border-white/20 bg-black/30 p-2" />
                    <button className="rounded bg-primary px-3 py-2 text-sm">Add Phrase</button>
                  </form>
                  <div className="mt-4 space-y-2">
                    {selected.phrases.map((p) => (
                      <div key={p.id} className="rounded bg-white/5 p-3">
                        <p className="font-jp">{p.japanese}</p>
                        <p className="text-sm text-white/70">{p.english}</p>
                        {p.context && <p className="text-xs text-white/50">{p.context}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'practice' && (
                <div className="card p-4">
                  {!practiceCard && <p className="text-sm text-white/60">Add vocabulary to practice.</p>}
                  {practiceCard && (
                    <>
                      <motion.div layout className="rounded bg-white/5 p-5 text-center">
                        <p className="font-jp text-4xl">{practiceCard.word}</p>
                        <p className="text-sm text-white/70">{practiceCard.reading}</p>
                        {showMeaning && <p className="mt-2">{practiceCard.meaning}</p>}
                      </motion.div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => setShowMeaning((v) => !v)} className="rounded border border-white/20 px-3 py-2 text-sm">Flip</button>
                        <button
                          onClick={() => {
                            setShowMeaning(false);
                            setPracticeIndex((i) => i + 1);
                          }}
                          className="rounded bg-primary px-3 py-2 text-sm"
                        >
                          Next
                        </button>
                        <button
                          onClick={() => {
                            updateSelected((show) => ({
                              ...show,
                              vocabulary: show.vocabulary.map((v) => (v.id === practiceCard.id ? { ...v, mastered: true } : v))
                            }));
                          }}
                          className="rounded border border-emerald-400/40 px-3 py-2 text-sm"
                        >
                          Mark Mastered
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-white/60">Practice is scoped to this show only.</p>
                    </>
                  )}
                </div>
              )}

              {tab === 'watchlog' && (
                <div className="card p-4">
                  <form onSubmit={logWatch} className="grid gap-2 md:grid-cols-3">
                    <input value={episode} onChange={(e) => setEpisode(e.target.value)} placeholder="Episode (e.g. S1E3)" className="rounded border border-white/20 bg-black/30 p-2" />
                    <input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="rounded border border-white/20 bg-black/30 p-2" />
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" className="rounded border border-white/20 bg-black/30 p-2" />
                    <button className="rounded bg-primary px-3 py-2 text-sm md:col-span-3">Log Episode</button>
                  </form>
                  <div className="mt-3 space-y-2 text-sm">
                    {selected.watch_logs.map((w) => (
                      <div key={w.id} className="rounded bg-white/5 p-2">
                        <p>{w.episode} - {w.minutes} min</p>
                        <p className="text-xs text-white/60">{new Date(w.date).toLocaleDateString()} {w.note ? `· ${w.note}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
