# 日本語マスター (Nihongo Master)

Premium Japanese learning app built with Next.js 14, TypeScript, Tailwind, Framer Motion, SM-2 SRS, and optional Supabase persistence.

## Features

- Onboarding wizard with 20-question level assessment (N5-N2 mapping)
- Dashboard with streak, XP, SRS due reviews, word-of-the-day, activity
- Kanji module (100+ kanji including required N5 set)
- Vocabulary module (200+ words, filtering, search, TTS)
- Grammar module (30+ patterns with examples + exercise)
- Reading module (N5-N3 passages, furigana toggle, comprehension)
- Listening module (dictation, shadowing, numbers, kana quiz)
- Unified review queue with SM-2 algorithm (Again/Hard/Good/Easy)
- Progress dashboard (heatmap, XP chart, mastery, accuracy, forecast)
- Settings (daily goal, Supabase/OpenAI key storage, reset, export JSON)

## Tech Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS + Framer Motion
- Supabase (`@supabase/supabase-js`) with localStorage demo fallback
- Web Speech API for Japanese TTS
- Recharts for analytics visualizations

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables (Optional)

Create `.env.local` for Supabase mode:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If missing, app runs in demo mode (localStorage only) with full functionality.

## Demo Mode vs Supabase Mode

- Demo mode: all progress/settings/cards stored in browser localStorage
- Supabase mode: profile/cards/sessions use PostgreSQL tables; localStorage still stores UI-only settings/activity cache

Storage abstraction lives in `src/lib/storage.ts`.

## Supabase Migration

SQL schema file:

- `supabase/migrations/001_init.sql`

Apply it in your Supabase SQL editor or migration workflow.

## Build

```bash
npm run build
npm start
```

## Notes

- AI features in Listening are intentionally mock/disabled with CTA to add OpenAI key.
- TTS relies on browser voice availability (`ja-JP` voice preferred).
