# Build: Nihongo Master - Japanese Language Learning App

Build a world-class Japanese language learning web application called "日本語マスター" (Nihongo Master). This should be genuinely impressive — think Duolingo meets WaniKani meets a premium language school.

## Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + Framer Motion for animations
- Supabase for auth + PostgreSQL (demo mode: localStorage fallback when env vars missing)
- Web Speech API for TTS (free, no API key needed)
- SM-2 spaced repetition algorithm (implement from scratch)

## Storage Abstraction
Create `src/lib/storage.ts` — when Supabase env vars present, use Supabase; otherwise use localStorage. Everything works in both modes.

## Onboarding Flow (/onboarding)
Multi-step animated wizard:
1. Welcome screen with Japanese aesthetic
2. Name + daily study goal (5/10/15/20 min)
3. Level assessment — 20 questions testing hiragana, basic vocab, kanji readings, grammar → maps to JLPT N5/N4/N3/N2
4. Results + optional account creation (or continue as guest)

## Main Dashboard (/dashboard)
- Daily streak with fire animation
- XP progress bar
- 6 module cards: Kanji, Vocabulary, Grammar, Reading, Listening, Progress
- SRS review count
- Word of the day
- Recent activity

## Kanji Module (/kanji)
Bundle 100+ kanji in `src/data/kanji.ts`:
```
{ id, character, meaning[], onyomi[], kunyomi[], jlpt, stroke_count, radicals[], examples[{word,reading,meaning}] }
```
Include all N5 kanji: 日月火水木金土山川田人口大小中上下左右白百千万本文学生先名年時間見聞食飲来行帰入出会分車電気力男女子父母友体手足目耳口心 and N4 kanji to reach 100+.

Features:
- Kanji grid browsable by level
- Detail view: large character, animated stroke order (SVG with Framer Motion draw animation), readings, meanings, example words
- SRS flashcards with 3D flip animation
- SM-2 rating: Again/Hard/Good/Easy

## Vocabulary Module (/vocabulary)
Bundle 200+ words in `src/data/vocabulary.ts`:
```
{ id, word, reading, meaning[], jlpt, part_of_speech, examples[{japanese,reading,english}] }
```
Include N5-N3 vocabulary: numbers, days, time, greetings, common verbs (食べる、飲む、見る、行く、来る、する、ある、いる、話す、書く、読む、聞く), adjectives, nouns (家、学校、会社、駅、電車、食べ物、水、お金、時間、友達、家族).

Features:
- Browse by level, search, filter by part of speech
- TTS pronunciation via Web Speech API (ja-JP voice)
- SRS flashcards: multiple choice + typing modes
- Context sentences

## Grammar Module (/grammar)
Bundle 30+ patterns in `src/data/grammar.ts`:
```
{ id, pattern, level, meaning, explanation, formation, examples[{japanese,reading,english}], notes }
```
Include: です/ます, て-form, た-form, ない-form, potential form, て-form uses, conditionals (と、ば、たら、なら), particles, comparison, giving/receiving verbs, time expressions, N5-N3 patterns.

Features:
- Lesson view with explanation + examples
- Fill-in-the-blank exercises
- Progress tracking per pattern

## Reading Module (/reading)
Bundle 5+ passages in `src/data/reading.ts`:
```
{ id, title, level, text, furigana_text, translation, vocabulary[], comprehension_questions[{question,options[],correct}] }
```
Write actual Japanese passages at N5/N4/N3 levels (short diary entries, announcements, stories).

Features:
- Furigana toggle
- Tap word → definition popup
- TTS reading
- Comprehension questions after reading
- Add passage vocab to SRS

## Listening Module (/listening)
All using Web Speech API (no external APIs):
- Sentence dictation: hear → type
- Shadowing practice with speed control (0.5x/0.75x/1x)
- Number practice (Japanese numbers)
- Kana listening quiz

AI Features section (demo/mockup):
- AI Conversation Partner (show sample conversation UI, grayed out)
- AI Grammar Correction (show correction UI, grayed out)
- Each with "Connect OpenAI API key in Settings to unlock" CTA

## SRS Review Session (/review)
- Unified queue: kanji + vocab + grammar
- SM-2 algorithm:
  ```
  new_interval = old_interval * ease_factor (min 1.3)
  Again: interval=1, ease-=0.2
  Hard: interval*=1.2, ease-=0.15  
  Good: interval*=ease_factor
  Easy: interval*=ease_factor*1.3, ease+=0.1
  ```
- Session summary: cards reviewed, accuracy, XP earned
- Smooth 3D card flip animations with Framer Motion

## Progress Dashboard (/progress)
- Study heatmap (GitHub contribution style, last 6 months)
- XP and level chart
- Kanji/Vocab/Grammar mastery % by JLPT level
- Review accuracy line chart
- Total study time
- SRS review forecast (7 days)
- Achievement badges: "7-day streak", "100 kanji", "N5 Complete", etc.

## Settings (/settings)
- Daily study goal
- Supabase URL + anon key (for full persistence)
- OpenAI API key (for AI features)
- Reset progress
- Export data as JSON

## Landing Page (/)
Stunning marketing page:
- Hero: animated falling Japanese characters (CSS/canvas), "Master Japanese. Your way."
- Feature highlights
- "Start Learning Free" → /onboarding

## Design System
- Background: deep navy #0a0e1a
- Primary: sakura pink #ff6b8a
- Accent: gold #f5c842
- Text: white
- Fonts: Noto Sans JP (Japanese), Inter (UI) — load from Google Fonts
- Framer Motion: page transitions, card flips, streak animations
- Mobile-first, dark mode only
- Feels premium and polished

## Supabase Schema (create in supabase/migrations/001_init.sql)
```sql
create table user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  jlpt_level text default 'N5',
  xp integer default 0,
  streak_days integer default 0,
  last_study_date date,
  daily_goal_minutes integer default 10,
  created_at timestamptz default now()
);

create table srs_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  card_type text not null,
  card_id text not null,
  due_date timestamptz default now(),
  interval_days float default 1,
  ease_factor float default 2.5,
  reviews integer default 0,
  lapses integer default 0,
  unique(user_id, card_type, card_id)
);

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  session_type text,
  cards_reviewed integer default 0,
  correct integer default 0,
  duration_ms integer,
  created_at timestamptz default now()
);
```

## After Building

1. Run `npm run build` and fix ALL TypeScript/build errors
2. Create proper `.gitignore` (node_modules, .next, .env.local, .vercel)
3. Create `README.md` with full setup instructions, env vars, demo mode explanation
4. `git add -A && git commit -m "Initial commit: Nihongo Master - Japanese learning app"`
5. `gh repo create twocjbot/nihongo-master --public --source=. --remote=origin --push`
6. `vercel deploy --prod --yes 2>&1 | tail -30`
7. `openclaw system event --text "Nihongo Master is live! GitHub: https://github.com/twocjbot/nihongo-master" --mode now`

Build everything. Make it genuinely impressive. Clean TypeScript throughout. Every feature must work in demo mode (localStorage) without any env vars.
