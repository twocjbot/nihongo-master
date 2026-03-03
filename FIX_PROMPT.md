# Fix Pass: Nihongo Master

The app exists and builds. Fix ALL broken functionality. Do not rebuild from scratch. Only fix what's broken.

---

## 1. KANJI PAGE (`src/app/kanji/page.tsx`)

**Problems:**
- SRS rating buttons (Again/Hard/Good/Easy) in CardFlip back do nothing
- Stroke order SVG is a hardcoded square path

**Fixes:**
- Wire SRS rating buttons to call `storage.saveCards()` with `applySM2(card, rating)` from `@/lib/sm2`
- When a kanji is selected, check if a card exists for it in storage; if not, create one with `storage.createCard('kanji', k.id)`
- After rating, show a toast "Card scheduled for review in X days"
- Remove the hardcoded square SVG. Replace with a simple animated border/glow effect around the character (not fake stroke order — just make it look good without pretending to show strokes)

---

## 2. VOCABULARY PAGE (`src/app/vocabulary/page.tsx`)

**Problems:**
- Multiple choice options are hardcoded as "dummy 1", "dummy 2", "dummy 3"
- No feedback on correct/wrong answer
- SRS not integrated (clicking options does nothing meaningful)

**Fixes:**
- Generate real wrong answers from other vocabulary items in the list (pick 3 random words whose meaning differs from the correct one)
- Track if user answered correctly: correct answer → green highlight + XP via storage, wrong → red highlight + show correct answer
- After answering, show a "Next Card" button
- On correct answer, call `applySM2(card, 'Good')` and save. On wrong, call `applySM2(card, 'Again')`.
- Use `storage.createCard('vocabulary', word.id)` if no card exists yet for the word

---

## 3. GRAMMAR PAGE (`src/app/grammar/page.tsx`)

**Problems:**
- Fill-in-the-blank is hardcoded to one sentence
- Answer checking doesn't work (no feedback, no correct answer revealed)
- Progress is not saved

**Fixes:**
- Each grammar pattern should have its own fill-in exercise using data from the pattern's examples array
- Format: show `selected.examples[0].english` as the prompt, show the Japanese with a blank `___` replacing a key word
- Check the user's input against the expected answer (case-insensitive, trimmed)
- Show ✅ or ❌ with the correct answer on submit
- On correct: award XP and save progress via storage
- Add a "Next exercise" button that cycles through examples

---

## 4. READING PAGE (`src/app/reading/page.tsx`)

**Problems:**
- "Add Passage Vocab to SRS" button has no onClick handler — does nothing

**Fix:**
```typescript
async function addVocabToSRS() {
  const state = await storage.getState();
  const newCards = selected.vocabulary
    .filter(v => !state.cards.find(c => c.card_id === v.word))
    .map(v => storage.createCard('vocabulary', v.word));
  await storage.saveCards([...state.cards, ...newCards]);
  toast.success(`Added ${newCards.length} words to SRS`);
}
```
Wire this to the button's onClick.

Also fix: comprehension question answer state should reset when selecting a new passage.

---

## 5. REVIEW PAGE (`src/app/review/page.tsx`)

**Problems:**
- Only seeds 3 cards (one kanji, one vocab, one grammar)
- Review queue is too small to be useful
- The `seedQueue` function uses hardcoded index [0] items

**Fix:**
- Change `seedQueue` to seed 20 cards: first 7 N5 kanji, first 7 N5 vocabulary, first 6 N5 grammar patterns
- Use the actual IDs from the data arrays
- After completing a review session, redirect to dashboard with a success toast
- Display the card content properly:
  - Kanji card front: large character. Back: meaning, readings, example word
  - Vocab card front: Japanese word + reading. Back: English meaning + example sentence
  - Grammar card front: pattern + meaning. Back: formation + examples

---

## 6. DASHBOARD (`src/app/dashboard/page.tsx`)

**Problems:**
- XP, streak, level shown might not reflect actual storage values

**Fix:**
- Load profile from `storage.getState()` on mount via useEffect
- Display real xp, streak, level from profile
- Show real SRS due card count from `cards.filter(isDue).length`

---

## 7. ONBOARDING (`src/app/onboarding/page.tsx`)

**Problems:**
- After completing onboarding, verify it actually routes to /dashboard
- Ensure profile is saved with chosen JLPT level and daily goal

**Fix:**
- After final step, call `storage.saveProfile({ jlpt_level: detectedLevel, daily_goal_minutes: goalMinutes })` then `router.push('/dashboard')`

---

## 8. GLOBAL: XP PERSISTENCE

Make sure that:
- `storage.addXp(amount)` is called when user correctly answers in vocab, grammar, reading
- `storage.getState()` is called fresh on each page to show current XP
- Toast notifications fire on XP gain and level up

---

## AFTER FIXING

1. Run `npm run build` and fix ALL TypeScript errors
2. `git add -A && git commit -m "Fix: wire up all broken functionality - SRS, vocab MC, grammar exercises, reading SRS, review queue"`
3. `git push origin master`
4. `vercel deploy --prod --yes 2>&1 | tail -10`
5. `openclaw system event --text "Nihongo Master fixes deployed - SRS, vocab, grammar, reading all working now" --mode now`
