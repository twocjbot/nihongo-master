# Enhancement Pass: Nihongo Master v2

The base app is already built. You are adding major feature expansions. Do NOT rebuild from scratch — enhance what exists.

---

## TECH ADDITIONS

Add these packages:
```
@react-three/fiber @react-three/drei three @types/three
react-hot-toast
```

Three.js + React Three Fiber is the 3D engine. Use it for all games.

---

## 1. GAMES HUB (`/games`)

### 1a. 🌌 Kanji Galaxy (3D)
**The flagship game. Must look stunning.**

Using React Three Fiber + @react-three/drei:
- 3D space scene with starfield background (use `<Stars>` from drei)
- 100+ kanji float in 3D space as glowing orbs (use `<Sphere>` + `<Text>` from drei)
- Player "flies" through space using mouse/touch to rotate the camera (OrbitControls)
- Click/tap a kanji orb → it expands, shows meaning + reading + example
- Correct answer → orb explodes in particle burst (use Points geometry), XP gained
- Wrong answer → orb turns red, shrinks back
- Kanji are color-coded by JLPT level (N5=pink, N4=gold, N3=blue, N2=purple)
- Background music atmosphere using Web Audio API (generate simple tones)
- Score + combo multiplier displayed as 3D floating text
- Absolutely stunning visually — this is the hero feature

### 1b. ⚔️ Kanji Dojo (3D)
- 3D Japanese dojo scene (simple geometric shapes: floor, pillars, lanterns using Box/Cylinder geometries)
- Enemy characters walk toward the player from the horizon
- Each enemy has a kanji floating above them
- Type the reading correctly → enemy is defeated with flash animation
- 3 lives system (shown as 3D torii gates at bottom)
- Speed increases every 10 enemies
- Boss every 50 enemies (larger enemy, harder kanji)
- Use Three.js for the 3D scene, anime-style colors

### 1c. 🌀 Word Vortex (3D)
- Words spiral toward the camera in a vortex/tunnel effect (3D perspective)
- Each word gets closer every second
- Type the meaning in English before it reaches you
- Words that get past reduce a health bar
- Frantic, fast-paced, uses depth perception to create urgency
- Different "tunnels" themed by content: kanji tunnel, vocab tunnel, grammar tunnel

### 1d. 🏯 Memory Palace (3D)
- A 3D Japanese room/palace environment using Three.js
- Objects in the room (table, window, door, lamp, book, cup...) have invisible labels
- Player "walks" through the room (WASD or click-to-move)
- Touch/click an object → Japanese word floats up + TTS pronunciation
- Associate words with physical locations (the memory palace technique)
- Collect all words in the room to complete the level
- Multiple rooms unlock as you progress

### 1e. ⚡ Speed Typer (2.5D)
- Not full 3D but use perspective transforms for depth effect
- Words fly from far away and get bigger as they approach
- CSS 3D transforms + Framer Motion for the perspective effect
- Type the hiragana reading before the word reaches the screen edge
- Neon cyberpunk aesthetic (dark background, glowing text)
- Combo system + high score leaderboard

### 1f. 🎴 Listening Bingo
- 4x4 bingo card grid
- TTS reads a Japanese word
- Tap the correct card before time runs out
- Get 4 in a row to win
- Visual celebration with Framer Motion confetti

### 1g. 🧩 Grammar Builder
- English sentence shown at top
- Japanese word tiles scattered at bottom
- Click tiles to assemble the correct Japanese sentence
- Tiles snap into place with satisfying animation
- Hint system (3 hints per session, earned via XP)

---

## 2. MEDIA IMMERSION (`/immersion`)

**Every show should be addable. This is the key feature.**

### Architecture
There are NO preset shows baked in (or minimal ones as examples). The entire system is user-driven:

#### Show Search & Add
1. User types any show name (anime, J-drama, movie, YouTube channel)
2. App searches **AniList GraphQL API** (completely free, no key): 
   ```
   POST https://graphql.anilist.co
   query { Media(search: "show name", type: ANIME) { id title { romaji native } description } }
   ```
3. Returns show info + cover art URL
4. App then searches **Jisho API** for vocabulary associated with common themes from the show description
5. User can also manually paste vocabulary (one per line: `word,reading,meaning`)
6. All show data saved to localStorage/Supabase

#### Show Study Mode (per show)
- **Overview tab**: show title, description, level estimate, your watch status
- **Vocabulary tab**: all vocab for this show, frequency-sorted, each with TTS button
- **Phrases tab**: user-added authentic phrases with context
- **Practice tab**: SRS flashcards using ONLY this show's vocab
- **"Add to Main SRS"**: pushes all show vocab to global SRS queue
- **Watch Log**: log episodes watched, auto-calculate immersion hours

#### My Library
- Shelf view of shows user has added (card grid with emoji/image art)
- Filter by: Watching / Completed / Plan to Watch
- Progress bar per show (% of vocab "mastered")
- Immersion stats: total hours, total words encountered, shows completed

#### Vocabulary Import Modes
1. **AniList search** → auto-fetch show metadata
2. **Jisho search** → search individual words to add
3. **Bulk paste** → paste `word,reading,meaning` one per line
4. **Subtitle import hint** → instructions for how to extract vocab from subtitle files (manual process, but app ready to accept the data)

#### Cross-reference with SRS
- When a show vocab word appears in SRS, show a tiny anime emoji badge on the card
- "You learned this from: 鬼滅の刃" attribution on review cards

---

## 3. REWARDS & PERSISTENCE

### XP & Level System
- Levels 1–100
- XP thresholds: `level * 150` XP to reach next level
- Level titles:
  - L1-5: "Hiragana Hero"
  - L6-15: "Kanji Curious"  
  - L16-25: "Shrine Visitor"
  - L26-35: "Tokyo Tourist"
  - L36-50: "Manga Reader"
  - L51-65: "Anime Scholar"
  - L66-80: "JLPT Challenger"
  - L81-95: "Kanji Master"
  - L96-100: "日本語の神" (God of Japanese)
- Level-up: 3D particle burst animation using Three.js Points

### Achievements (30+)
Create `src/data/achievements.ts`:
- Streak: 3/7/30/100 days
- Volume: 10/50/100/500/1000 reviews
- Accuracy: 95%+ in a session
- Speed: complete Speed Typer level in under 30s
- Games: beat each game once, beat each game on hard
- Immersion: add first show, add 5 shows, reach 10h immersion
- Social: share a word
- Level milestones: reach level 10/25/50/100
- Secret: open the app at midnight, study 3 days in a row starting Monday
- JLPT: complete all N5/N4/N3 content

### Daily Challenges
Each day (seeded by `new Date().toDateString()`):
- Pick 3 daily missions from a pool of ~20
- Examples: "Review 15 cards", "Play Kanji Galaxy for 5 min", "Add a new show to your library", "Complete a reading passage"
- Reward: bonus XP + streak protection

### Toast Notifications
Use `react-hot-toast` for:
- Achievement unlocked (with badge icon)
- Level up
- Streak milestone
- Daily challenge complete

---

## 4. DASHBOARD ENHANCEMENT

Add sections:
- **Immersion widget**: "Currently watching: [show]" with episode count, vocab progress ring
- **Daily challenges**: 3 missions, progress checkboxes, reward preview
- **Recent achievement**: last unlocked badge with glow
- **3D element**: embed a small Three.js canvas showing a rotating kanji orb (teaser of Kanji Galaxy)

---

## 5. ONBOARDING ENHANCEMENT

New steps:
- "Are you learning for anime/manga?" → if yes, show Immersion section first in dashboard
- "Any shows you're currently watching?" → search box, add their show immediately
- "What's your main motivation?" → choose 1 of: Anime, Travel, Work, School, Culture
- Store answers in profile for personalized dashboard

---

## TECHNICAL REQUIREMENTS

- React Three Fiber canvas must have `style={{ background: 'transparent' }}` or match dark theme
- All 3D scenes must have loading states (suspend + Loader component from drei)
- Games must save high scores to storage (localStorage key: `highscores`)
- AniList + Jisho API calls should have proper error handling and loading states
- All features work in demo mode without any API keys

---

## AFTER BUILDING

1. Run `npm run build` and fix ALL TypeScript/build errors
2. `git add -A && git commit -m "v2: 3D games, media immersion for any show, achievements, rewards"`
3. `git push origin master`
4. `vercel deploy --prod --yes 2>&1 | tail -20`
5. `openclaw system event --text "Nihongo Master v2 deployed! 3D games, media immersion, achievements. Check Vercel for the live URL." --mode now`
