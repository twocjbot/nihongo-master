# Complete Visual Redesign: Nihongo Master

The app is fully functional. You are ONLY redesigning the visual layer — CSS, layout, typography, colors, animations. Do NOT touch logic, data files, lib files, or API routes. Preserve all functionality.

---

## Aesthetic Direction: Editorial Ink Print

Think: a premium Tokyo design magazine printed on matte paper, digitized. Not a tech startup. Not a language app. A designed artifact.

**The unforgettable detail:** Giant kanji characters (single characters, 30-50vw) bleed off the edges of layouts as pure typographic art — decorative, not functional. The content sits on top of or next to them.

---

## Design System

### Colors (update globals.css CSS variables)
```css
:root {
  --bg: #F5F0E8;           /* warm off-white, like aged paper */
  --bg-dark: #1A1714;      /* deep charcoal ink */
  --ink: #1A1714;          /* primary text */
  --ink-light: #6B6560;    /* secondary text */
  --accent: #C8391A;       /* vermillion red — the ONLY color accent */
  --accent-hover: #A02D14;
  --border: #D4CFC7;       /* subtle warm border */
  --white: #FDFAF4;        /* card surfaces */
}
```

Use dark mode (`bg-dark` as background) for the app pages (dashboard, kanji, etc.). Use the warm off-white for the landing page.

### Typography
Load from Google Fonts in layout.tsx:
- **Shippori Mincho** (weights 400, 700) — Japanese serif, primary display font
- **DM Mono** (weights 400, 500) — monospace, UI text, labels, metadata
- **Noto Sans JP** (keep for Japanese characters in content)

Apply:
- All headings: `font-shippori` (Shippori Mincho)
- All UI labels, nav, metadata: `font-mono` (DM Mono)  
- Japanese content text: `font-jp` (Noto Sans JP)
- Body text: DM Mono

Update tailwind.config.ts to add `shippori` font family.

### Grain Overlay
Add to the root layout as a fixed pseudo-element using CSS:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  z-index: 9999;
}
```

---

## Landing Page (`/`) — Light theme

Full redesign:

**Hero section:**
- Off-white background
- Giant decorative kanji character `学` — position: absolute, font-size: clamp(200px, 40vw, 500px), Shippori Mincho, color: rgba(26,23,20,0.06), top-right corner bleeding off screen
- Left side: stacked editorial layout
  - Small DM Mono label: `日本語マスター — LEARN JAPANESE`
  - Huge Shippori Mincho headline: `Master the language.` (first line) `Master the craft.` (second line, vermillion)
  - Thin horizontal rule (1px, warm border color)
  - Two-column micro-stat row: `15,000+ vocab` | `100+ kanji` | `SRS system` | `No subscription`
  - Two buttons: Primary (vermillion filled, DM Mono text "Begin →") and Secondary (outlined "View demo")

**Features section:**
- Dark background section (`bg-dark`)
- 3-column grid, each feature card has: a giant Japanese character as background (opacity 0.08), feature name in DM Mono caps, one-line description
- Asymmetric: first card is 2 cols wide

**Footer:**
- Minimal. `日本語マスター` in Shippori Mincho, `© 2026` in DM Mono

---

## Navigation / PageShell

Redesign `src/components/PageShell.tsx`:
- Dark background (`bg-dark`)
- Left sidebar (desktop) or top bar (mobile)
- Sidebar: vertical stack of nav items in DM Mono, all caps, small text
- Active item: vermillion red left border (3px) + vermillion text
- Page title: large Shippori Mincho, with a decorative kanji behind it (different per page, very low opacity)
- Each page has its own background kanji character:
  - Dashboard: `学`
  - Kanji: `字`
  - Vocabulary: `語`
  - Grammar: `文`
  - Reading: `読`
  - Listening: `聴`
  - Games: `遊`
  - Immersion: `観`
  - Progress: `進`
  - Review: `復`

---

## Card Component

Replace all `.card` usage with a refined style:
```css
.card {
  background: rgba(253, 250, 244, 0.04);
  border: 1px solid rgba(212, 207, 199, 0.12);
  border-radius: 2px; /* almost sharp — no soft rounded corners */
}
```

Hover state: border becomes vermillion at 40% opacity, subtle.

---

## Buttons

Primary: `background: var(--accent)`, no border radius (or 1px), DM Mono font, uppercase, letter-spacing 0.1em
Secondary: transparent, 1px border (--border), same typography
Hover: slight opacity change + cursor shift

---

## Dashboard Page

Keep all logic. Redesign layout:
- Top: editorial header with page kanji behind
- Stats row: 4 cards in a horizontal scroll — XP, Streak, Level, Due Reviews. Each card: number in huge Shippori Mincho, label in tiny DM Mono caps
- Module grid: 6 cards, 2 or 3 columns, each with decorative kanji background, module name in DM Mono caps
- Remove the Three.js orb (too heavy for a redesign, keep it clean)

---

## Kanji Page

Keep all logic. Redesign:
- Left panel: kanji grid with cells styled as ink squares — dark bg, white kanji, vermillion highlight on selected
- Right panel: selected kanji displayed at enormous size (20rem) with its JLPT level in DM Mono below
- Readings and meanings in a clean table layout
- Remove the fake SVG stroke order entirely (already done)

---

## Review Page

Keep all logic. Redesign the flashcard:
- Full-screen card design — takes up 80% of viewport
- Front: kanji/word at enormous scale, centered
- Back: clean breakdown with clear visual hierarchy
- Rating buttons: minimal row at bottom, DM Mono labels

---

## Animations

Use Framer Motion (already installed) sparingly:
- Page entry: single fade-up, 400ms, ease-out
- Card flip: smooth 3D rotation (already exists, just ensure it looks right with new styles)
- Navigation transitions: none — instant feels more editorial
- Hover on module cards: subtle translateY(-2px) + border color change

---

## globals.css

Complete rewrite. Key additions:
```css
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;500;700&display=swap');

* { box-sizing: border-box; }

body {
  background: var(--bg-dark);
  color: var(--white);
  font-family: 'DM Mono', monospace;
  -webkit-font-smoothing: antialiased;
}

.font-shippori { font-family: 'Shippori Mincho', serif; }
.font-mono { font-family: 'DM Mono', monospace; }
.font-jp { font-family: 'Noto Sans JP', sans-serif; }

/* Decorative kanji */
.deco-kanji {
  position: absolute;
  font-family: 'Shippori Mincho', serif;
  font-size: clamp(120px, 25vw, 400px);
  color: rgba(253, 250, 244, 0.04);
  pointer-events: none;
  user-select: none;
  line-height: 1;
  z-index: 0;
}
```

---

## tailwind.config.ts

Add:
```js
fontFamily: {
  shippori: ['Shippori Mincho', 'serif'],
  mono: ['DM Mono', 'monospace'],
  jp: ['Noto Sans JP', 'sans-serif'],
}
```

---

## After Redesign

1. Run `npm run build` and fix ALL errors
2. `git add -A && git commit -m "Redesign: editorial ink-print aesthetic - Shippori Mincho + DM Mono + vermillion accent"`
3. `git push origin master`
4. `vercel deploy --prod --yes 2>&1 | tail -10`
5. `openclaw system event --text "Nihongo Master redesign deployed! New editorial aesthetic live at nihongo-master-rose.vercel.app" --mode now`
