import { achievements } from '@/data/achievements';
import { dailyMissionPool } from '@/data/dailyMissions';
import { DailyChallengeProgress, DailyMission, ImmersionShow } from '@/lib/types';

export function levelFromXp(xp: number): number {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (level < 100 && remaining >= level * 150) {
    remaining -= level * 150;
    level += 1;
  }
  return level;
}

export function xpToNextLevel(xp: number): number {
  const level = levelFromXp(xp);
  let consumed = 0;
  for (let i = 1; i < level; i += 1) consumed += i * 150;
  return Math.max(0, level * 150 - (xp - consumed));
}

export function levelTitle(level: number): string {
  if (level <= 5) return 'Hiragana Hero';
  if (level <= 15) return 'Kanji Curious';
  if (level <= 25) return 'Shrine Visitor';
  if (level <= 35) return 'Tokyo Tourist';
  if (level <= 50) return 'Manga Reader';
  if (level <= 65) return 'Anime Scholar';
  if (level <= 80) return 'JLPT Challenger';
  if (level <= 95) return 'Kanji Master';
  return '日本語の神';
}

function seededNumber(seed: string) {
  return seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export function dailyChallengeSet(dateKey = new Date().toDateString()): DailyMission[] {
  const base = seededNumber(dateKey);
  const picked = new Set<number>();
  while (picked.size < 3) {
    picked.add((base + picked.size * 7) % dailyMissionPool.length);
  }
  return [...picked].map((i) => dailyMissionPool[i]);
}

export function makeChallengeProgress(dateKey = new Date().toDateString()): DailyChallengeProgress {
  const missions = dailyChallengeSet(dateKey);
  return {
    date_key: dateKey,
    missions,
    progress: Object.fromEntries(missions.map((m) => [m.id, 0])),
    completed: [],
    streak_protection: false
  };
}

export function updateChallengeMetric(state: DailyChallengeProgress, metric: DailyMission['metric'], amount = 1) {
  const next: DailyChallengeProgress = {
    ...state,
    progress: { ...state.progress },
    completed: [...state.completed]
  };

  for (const mission of next.missions) {
    if (mission.metric !== metric) continue;
    const current = next.progress[mission.id] ?? 0;
    const value = Math.min(mission.target, current + amount);
    next.progress[mission.id] = value;
    if (value >= mission.target && !next.completed.includes(mission.id)) {
      next.completed.push(mission.id);
    }
  }
  next.streak_protection = next.completed.length >= 3;
  return next;
}

export function computeImmersionHours(shows: ImmersionShow[]): number {
  const minutes = shows.flatMap((s) => s.watch_logs).reduce((sum, w) => sum + w.minutes, 0);
  return Number((minutes / 60).toFixed(1));
}

export function detectAchievementUnlocks(input: {
  unlocked: string[];
  streak: number;
  totalReviews: number;
  accuracy?: number;
  level: number;
  shows: ImmersionShow[];
  immersionHours: number;
  flags?: string[];
}): string[] {
  const unlocked = new Set(input.unlocked);
  const maybe = (id: string, ok: boolean) => {
    if (ok) unlocked.add(id);
  };

  maybe('streak_3', input.streak >= 3);
  maybe('streak_7', input.streak >= 7);
  maybe('streak_30', input.streak >= 30);
  maybe('streak_100', input.streak >= 100);
  maybe('reviews_10', input.totalReviews >= 10);
  maybe('reviews_50', input.totalReviews >= 50);
  maybe('reviews_100', input.totalReviews >= 100);
  maybe('reviews_500', input.totalReviews >= 500);
  maybe('reviews_1000', input.totalReviews >= 1000);
  maybe('acc_95', (input.accuracy ?? 0) >= 95);
  maybe('immersion_first_show', input.shows.length >= 1);
  maybe('immersion_5_shows', input.shows.length >= 5);
  maybe('immersion_10h', input.immersionHours >= 10);
  maybe('level_10', input.level >= 10);
  maybe('level_25', input.level >= 25);
  maybe('level_50', input.level >= 50);
  maybe('level_100', input.level >= 100);

  for (const flag of input.flags ?? []) unlocked.add(flag);
  return [...unlocked].filter((id) => achievements.some((a) => a.id === id));
}
