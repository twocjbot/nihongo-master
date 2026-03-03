import { Achievement } from '@/lib/types';

export const achievements: Achievement[] = [
  { id: 'streak_3', name: 'Spark Streak', description: 'Study 3 days in a row', icon: '🔥', category: 'streak', xp_reward: 80 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Study 7 days in a row', icon: '🗓️', category: 'streak', xp_reward: 150 },
  { id: 'streak_30', name: 'Monthly Monk', description: 'Study 30 days in a row', icon: '⛩️', category: 'streak', xp_reward: 500 },
  { id: 'streak_100', name: 'Unbroken Flame', description: 'Study 100 days in a row', icon: '🌋', category: 'streak', xp_reward: 1500 },

  { id: 'reviews_10', name: 'First Ten', description: 'Complete 10 reviews', icon: '📘', category: 'volume', xp_reward: 50 },
  { id: 'reviews_50', name: 'Review Rookie', description: 'Complete 50 reviews', icon: '📚', category: 'volume', xp_reward: 120 },
  { id: 'reviews_100', name: 'Review Ranger', description: 'Complete 100 reviews', icon: '🧠', category: 'volume', xp_reward: 250 },
  { id: 'reviews_500', name: 'Review Titan', description: 'Complete 500 reviews', icon: '🏯', category: 'volume', xp_reward: 900 },
  { id: 'reviews_1000', name: 'Memory Machine', description: 'Complete 1000 reviews', icon: '⚙️', category: 'volume', xp_reward: 1800 },

  { id: 'acc_95', name: 'Precision Strike', description: 'Hit 95%+ accuracy in a session', icon: '🎯', category: 'accuracy', xp_reward: 180 },
  { id: 'speed_typer_30', name: 'Blink Speed', description: 'Beat Speed Typer in under 30s', icon: '⚡', category: 'speed', xp_reward: 220 },

  { id: 'game_galaxy', name: 'Star Reader', description: 'Beat Kanji Galaxy once', icon: '🌌', category: 'games', xp_reward: 180 },
  { id: 'game_dojo', name: 'Dojo Victor', description: 'Beat Kanji Dojo once', icon: '⚔️', category: 'games', xp_reward: 180 },
  { id: 'game_vortex', name: 'Vortex Survivor', description: 'Beat Word Vortex once', icon: '🌀', category: 'games', xp_reward: 180 },
  { id: 'game_palace', name: 'Palace Explorer', description: 'Complete Memory Palace', icon: '🏮', category: 'games', xp_reward: 180 },
  { id: 'game_speed', name: 'Neon Fingers', description: 'Beat Speed Typer once', icon: '💿', category: 'games', xp_reward: 180 },
  { id: 'game_bingo', name: 'Lucky Ear', description: 'Win Listening Bingo once', icon: '🎴', category: 'games', xp_reward: 180 },
  { id: 'game_grammar', name: 'Tile Tactician', description: 'Win Grammar Builder once', icon: '🧩', category: 'games', xp_reward: 180 },
  { id: 'game_galaxy_hard', name: 'Galaxy Hard Clear', description: 'Beat Kanji Galaxy on hard', icon: '💫', category: 'games', xp_reward: 350 },
  { id: 'game_dojo_hard', name: 'Dojo Hard Clear', description: 'Beat Kanji Dojo on hard', icon: '🗡️', category: 'games', xp_reward: 350 },
  { id: 'game_vortex_hard', name: 'Vortex Hard Clear', description: 'Beat Word Vortex on hard', icon: '🌪️', category: 'games', xp_reward: 350 },
  { id: 'game_palace_hard', name: 'Palace Hard Clear', description: 'Beat Memory Palace hard room', icon: '🏰', category: 'games', xp_reward: 350 },

  { id: 'immersion_first_show', name: 'First Show Added', description: 'Add your first show', icon: '📺', category: 'immersion', xp_reward: 120 },
  { id: 'immersion_5_shows', name: 'Shelf Builder', description: 'Add 5 shows', icon: '🗃️', category: 'immersion', xp_reward: 280 },
  { id: 'immersion_10h', name: 'Immersion Apprentice', description: 'Reach 10 immersion hours', icon: '⌛', category: 'immersion', xp_reward: 360 },

  { id: 'social_share_word', name: 'Word Shouted Out', description: 'Share a word', icon: '📣', category: 'social', xp_reward: 90 },

  { id: 'level_10', name: 'Level 10', description: 'Reach level 10', icon: '🔟', category: 'level', xp_reward: 300 },
  { id: 'level_25', name: 'Level 25', description: 'Reach level 25', icon: '🥈', category: 'level', xp_reward: 650 },
  { id: 'level_50', name: 'Level 50', description: 'Reach level 50', icon: '🥇', category: 'level', xp_reward: 1400 },
  { id: 'level_100', name: 'Level 100', description: 'Reach level 100', icon: '👑', category: 'level', xp_reward: 5000 },

  { id: 'secret_midnight', name: 'Midnight Scholar', description: 'Open the app at midnight', icon: '🌙', category: 'secret', xp_reward: 250 },
  { id: 'secret_monday_3day', name: 'Monday Momentum', description: 'Study 3 days in a row starting Monday', icon: '🧭', category: 'secret', xp_reward: 300 },

  { id: 'jlpt_n5_done', name: 'N5 Complete', description: 'Complete all N5 content', icon: '📝', category: 'jlpt', xp_reward: 350 },
  { id: 'jlpt_n4_done', name: 'N4 Complete', description: 'Complete all N4 content', icon: '📜', category: 'jlpt', xp_reward: 500 },
  { id: 'jlpt_n3_done', name: 'N3 Complete', description: 'Complete all N3 content', icon: '🏆', category: 'jlpt', xp_reward: 700 }
];

export const achievementById = Object.fromEntries(achievements.map((a) => [a.id, a]));
