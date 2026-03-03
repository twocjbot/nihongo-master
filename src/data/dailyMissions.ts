import { DailyMission } from '@/lib/types';

export const dailyMissionPool: DailyMission[] = [
  { id: 'review_15', text: 'Review 15 cards', target: 15, metric: 'review', reward_xp: 100 },
  { id: 'review_30', text: 'Review 30 cards', target: 30, metric: 'review', reward_xp: 180 },
  { id: 'review_50', text: 'Review 50 cards', target: 50, metric: 'review', reward_xp: 260 },
  { id: 'games_5', text: 'Play Kanji Galaxy for 5 min', target: 5, metric: 'game_minutes', reward_xp: 140 },
  { id: 'games_10', text: 'Play any game for 10 min', target: 10, metric: 'game_minutes', reward_xp: 180 },
  { id: 'add_show_1', text: 'Add a new show to your library', target: 1, metric: 'add_show', reward_xp: 140 },
  { id: 'add_show_2', text: 'Add 2 shows to your library', target: 2, metric: 'add_show', reward_xp: 250 },
  { id: 'reading_1', text: 'Complete a reading passage', target: 1, metric: 'reading', reward_xp: 120 },
  { id: 'reading_2', text: 'Complete 2 reading passages', target: 2, metric: 'reading', reward_xp: 220 },
  { id: 'immersion_20', text: 'Log 20 immersion minutes', target: 20, metric: 'immersion_minutes', reward_xp: 130 },
  { id: 'immersion_45', text: 'Log 45 immersion minutes', target: 45, metric: 'immersion_minutes', reward_xp: 240 },
  { id: 'vocab_5', text: 'Add 5 show vocabulary words', target: 5, metric: 'vocab_added', reward_xp: 150 },
  { id: 'vocab_15', text: 'Add 15 show vocabulary words', target: 15, metric: 'vocab_added', reward_xp: 290 },
  { id: 'dojo_1', text: 'Defeat 10 enemies in Kanji Dojo', target: 10, metric: 'game_minutes', reward_xp: 160 },
  { id: 'vortex_1', text: 'Survive one Word Vortex tunnel', target: 6, metric: 'game_minutes', reward_xp: 170 },
  { id: 'palace_1', text: 'Collect 5 words in Memory Palace', target: 5, metric: 'vocab_added', reward_xp: 170 },
  { id: 'bingo_1', text: 'Win one Listening Bingo', target: 1, metric: 'game_minutes', reward_xp: 130 },
  { id: 'grammar_1', text: 'Complete one Grammar Builder round', target: 1, metric: 'game_minutes', reward_xp: 130 },
  { id: 'combo_speed', text: 'Hit a 10 combo in Speed Typer', target: 10, metric: 'game_minutes', reward_xp: 180 },
  { id: 'practice_show', text: 'Run one show-specific SRS practice', target: 1, metric: 'review', reward_xp: 140 }
];
