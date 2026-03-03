export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2';

export type KanjiEntry = {
  id: string;
  character: string;
  meaning: string[];
  onyomi: string[];
  kunyomi: string[];
  jlpt: JLPTLevel;
  stroke_count: number;
  radicals: string[];
  examples: { word: string; reading: string; meaning: string }[];
};

export type VocabularyEntry = {
  id: string;
  word: string;
  reading: string;
  meaning: string[];
  jlpt: JLPTLevel;
  part_of_speech: string;
  examples: { japanese: string; reading: string; english: string }[];
};

export type GrammarEntry = {
  id: string;
  pattern: string;
  level: JLPTLevel;
  meaning: string;
  explanation: string;
  formation: string;
  examples: { japanese: string; reading: string; english: string }[];
  notes: string;
};

export type ReadingPassage = {
  id: string;
  title: string;
  level: JLPTLevel;
  text: string;
  furigana_text: string;
  translation: string;
  vocabulary: { word: string; reading: string; meaning: string }[];
  comprehension_questions: { question: string; options: string[]; correct: number }[];
};

export type SRSCardType = 'kanji' | 'vocabulary' | 'grammar';

export type SRSCard = {
  id: string;
  user_id: string;
  card_type: SRSCardType;
  card_id: string;
  due_date: string;
  interval_days: number;
  ease_factor: number;
  reviews: number;
  lapses: number;
};

export type UserProfile = {
  id: string;
  user_id: string;
  name?: string;
  jlpt_level: JLPTLevel;
  xp: number;
  streak_days: number;
  last_study_date?: string;
  daily_goal_minutes: number;
  prefers_immersion?: boolean;
  motivation?: 'Anime' | 'Travel' | 'Work' | 'School' | 'Culture';
  current_show_id?: string;
  created_at: string;
};

export type StudySession = {
  id: string;
  user_id: string;
  session_type: string;
  cards_reviewed: number;
  correct: number;
  duration_ms: number;
  created_at: string;
};

export type Activity = {
  id: string;
  text: string;
  timestamp: string;
  xp: number;
};

export type ShowStatus = 'Watching' | 'Completed' | 'Plan to Watch';
export type ImmersionTab = 'overview' | 'vocabulary' | 'phrases' | 'practice' | 'watchlog';
export type ContentTunnel = 'kanji' | 'vocabulary' | 'grammar';

export type ShowVocabulary = {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  source: 'anilist-theme' | 'jisho' | 'manual' | 'subtitle';
  frequency: number;
  mastered?: boolean;
};

export type ShowPhrase = {
  id: string;
  japanese: string;
  reading?: string;
  english: string;
  context?: string;
};

export type ShowWatchLog = {
  id: string;
  date: string;
  episode: string;
  minutes: number;
  note?: string;
};

export type ImmersionShow = {
  id: string;
  anilist_id?: number;
  title: string;
  native_title?: string;
  description?: string;
  cover_image?: string;
  status: ShowStatus;
  level_estimate: JLPTLevel;
  vocabulary: ShowVocabulary[];
  phrases: ShowPhrase[];
  watch_logs: ShowWatchLog[];
  created_at: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'volume' | 'accuracy' | 'speed' | 'games' | 'immersion' | 'social' | 'level' | 'secret' | 'jlpt';
  xp_reward: number;
};

export type DailyMission = {
  id: string;
  text: string;
  target: number;
  metric: 'review' | 'game_minutes' | 'add_show' | 'reading' | 'immersion_minutes' | 'vocab_added';
  reward_xp: number;
};

export type DailyChallengeProgress = {
  date_key: string;
  missions: DailyMission[];
  progress: Record<string, number>;
  completed: string[];
  streak_protection: boolean;
};
