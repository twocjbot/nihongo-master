# Enhancement Pass: Nihongo Master v2

The base app is already built. You are now adding major feature expansions. Do NOT rebuild from scratch — enhance what exists.

---

## 1. GAMES (`/games`)

Add a dedicated games hub with at least 5 distinct games:

### 1a. Kanji Dojo (matching game)
- 4x4 grid of face-down cards
- Cards contain kanji on one side, meaning/reading on the other
- Player flips two at a time to find matching pairs
- Timer, move counter, score
- Difficulty: N5/N4/N3
- Unlock new card sets as you level up

### 1b. Speed Typer
- A kanji or vocab word appears on screen
- Player must type the correct romaji/hiragana reading before a countdown bar depletes
- Speeds up as you progress
- Combo multiplier for consecutive correct answers
- Leaderboard (stored locally or Supabase)

### 1c. Falling Kanji (arcade)
- Kanji fall from the top of the screen (CSS animation)
- Player types the reading to "destroy" them before they hit the bottom
- 3 lives system
- Score multiplier based on speed
- Uses canvas or pure CSS/Tailwind for the effect

### 1d. Listening Bingo
- 5x5 bingo grid of Japanese words/kana
- TTS reads a word aloud
- Player clicks the matching cell
- Get 5 in a row to win
- Multiple difficulty modes

### 1e. Grammar Builder
- Player is shown an English sentence and must arrange Japanese word tiles in correct order
- Drag-and-drop tile interface (or click-to-place)
- Progressive difficulty matching grammar patterns they've studied
- Hint system (uses one of their 3 hints per session)

---

## 2. ENHANCED REWARDS & PERSISTENCE

### XP & Leveling System
- Levels 1–100 with XP thresholds that scale (100xp for L1→L2, 200 for L2→L3, etc.)
- Level title displayed: "Beginner Samurai", "Shrine Visitor", "Tokyo Tourist", "Manga Reader", "Anime Fan", "JLPT N4 Scholar", "Kanji Master", etc.
- Visual level-up animation with Framer Motion (confetti/sakura petals burst)

### Achievement Badges (expand significantly)
Create `src/data/achievements.ts` with 30+ achievements:
- Streak achievements: 3-day, 7-day, 30-day, 100-day streak
- Volume: 10/50/100/500 cards reviewed
- Accuracy: 90%+ accuracy in a session
- Module-specific: "Read all N5 passages", "Completed Grammar Dojo"
- Game achievements: "Speed Demon" (type 10 words under 2s each), "Bingo Master"
- Milestone: "First 100 Kanji", "N5 Vocabulary Complete"
- Social: "Shared a word" (copy to clipboard)
- Secret achievements (unlocked by doing unexpected things)

### Daily Challenges
Add to dashboard: a fresh daily challenge each day (seeded by date):
- "Review 10 cards with 80%+ accuracy"
- "Complete a listening exercise"  
- "Master 3 new kanji today"
- Complete challenge → bonus XP + special badge

### Streak Freeze
- Once per week, player can use a "streak freeze" item
- Displayed as an inventory item on dashboard
- Earned via reaching milestones

---

## 3. MEDIA IMMERSION (`/immersion`)

This is the most innovative feature. Create a full `/immersion` section.

### Show Library
Create `src/data/shows.ts` with vocabulary/grammar lists for popular Japanese shows:

```typescript
export type ShowEntry = {
  id: string;
  title: string;
  title_jp: string;
  type: 'anime' | 'drama' | 'movie';
  level: 'N5' | 'N4' | 'N3' | 'N2';
  description: string;
  image_emoji: string; // use emoji as placeholder art
  vocabulary: { word: string; reading: string; meaning: string; frequency: number }[];
  grammar_patterns: string[]; // grammar IDs from grammar.ts
  kanji: string[]; // kanji characters used
  phrases: { japanese: string; reading: string; english: string; context: string }[];
}
```

Include these shows (create realistic vocab lists):
- **進撃の巨人** (Attack on Titan) — N3/N2 level, military vocab, action verbs
- **鬼滅の刃** (Demon Slayer) — N4/N3, classical speech patterns, emotional vocab
- **となりのトトロ** (My Neighbor Totoro) — N5/N4, nature, family, childhood vocab
- **千と千尋の神隠し** (Spirited Away) — N4/N3, spirit world, work, transformation vocab  
- **君の名は** (Your Name) — N3/N2, daily life, time, dreams, emotional vocab
- **コナン** (Detective Conan) — N3, mystery, deduction, crime vocab
- **ドラゴンボール** (Dragon Ball) — N4, fighting, training, friendship vocab

For each show, include 20+ vocabulary words, 5+ authentic phrases with context ("Said by character when..."), and relevant grammar patterns.

### My Media Log
- User can mark shows as "Watching", "Completed", "Plan to Watch"
- Shows they've watched appear in "My Library"
- Dashboard widget showing immersion progress

### Show Study Mode
When user opens a show:
1. **Vocabulary Tab** — all show-specific vocab, sortable by frequency/JLPT level, each with TTS
2. **Phrases Tab** — authentic phrases from the show, with reading and translation
3. **Grammar Tab** — grammar patterns highlighted in the show
4. **Practice Tab** — mini flashcard session using ONLY this show's vocab
5. **"Add to Main SRS"** button — adds show vocab to their global SRS queue

### Custom Show Addition
- Form where user can type a show name they're watching
- Search Jisho API (https://jisho.org/api/v1/search/words?keyword=) — no API key needed
- User can paste a list of words/phrases and the app parses and adds them
- These get their own "Custom: [Show Name]" section

### Immersion Stats
- Total unique words encountered across all shows
- "Shows completed" count
- Estimated listening hours
- Words learned through immersion vs. SRS

---

## 4. SOCIAL / SHARING

- "Word of the Day" shareable card (generates a nice image-like div using CSS)
- Copy vocab card to clipboard as formatted text
- Share progress stats (as text)

---

## 5. ENHANCED DASHBOARD

Update dashboard to show:
- Immersion section: "Currently watching: [show]" with progress ring
- Daily challenge card
- Recent achievement unlocked
- Level + XP with visual progress bar to next level
- "Continue where you left off" smart suggestion based on what they last studied

---

## 6. ONBOARDING ENHANCEMENT

Add a step asking:
- "Are you learning Japanese for anime/manga?" → if yes, immediately show immersion section as recommended
- "Do you have a favorite show?" → show picker from library → pre-loads that show's vocab into their learning queue

---

## TECHNICAL NOTES

- Jisho API: `https://jisho.org/api/v1/search/words?keyword=WORD` — free, no key, add to custom show search
- All games should store high scores in storage (localStorage/Supabase)
- Achievements should fire with a toast notification + animation when unlocked
- Add `react-hot-toast` or build a custom toast system for notifications
- Games accessible from: main nav, dashboard card, and `/games` hub
- All new features work in demo mode (localStorage)

---

## AFTER BUILDING

1. Run `npm run build` and fix ALL errors
2. `git add -A && git commit -m "v2: Games, enhanced rewards, media immersion, achievements"`
3. `git push origin master`
4. `vercel deploy --prod --yes 2>&1 | tail -20`
5. `openclaw system event --text "Nihongo Master v2 deployed with games, achievements, and media immersion! Check Vercel for the updated URL." --mode now`
