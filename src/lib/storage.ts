'use client';

import { hasSupabase, supabase } from '@/lib/supabase';
import {
  Activity,
  DailyChallengeProgress,
  ImmersionShow,
  SRSCard,
  SRSCardType,
  StudySession,
  UserProfile
} from '@/lib/types';
import { uid } from '@/lib/utils';

export type AppState = {
  profile: UserProfile;
  cards: SRSCard[];
  sessions: StudySession[];
  activities: Activity[];
  immersionShows: ImmersionShow[];
  unlockedAchievements: string[];
  recentAchievementId?: string;
  dailyChallenges?: DailyChallengeProgress;
  highscores: Record<string, number>;
  onboardingDone: boolean;
  settings: {
    supabaseUrl?: string;
    supabaseAnonKey?: string;
    openaiApiKey?: string;
  };
};

const LS_KEY = 'nihongo_master_state_v1';
const GUEST_USER = 'guest-user';

const defaultProfile: UserProfile = {
  id: uid('profile'),
  user_id: GUEST_USER,
  jlpt_level: 'N5',
  xp: 0,
  streak_days: 0,
  daily_goal_minutes: 10,
  created_at: new Date().toISOString(),
  name: 'Guest',
  prefers_immersion: false,
  motivation: 'Anime'
};

function makeInitialState(): AppState {
  return {
    profile: defaultProfile,
    cards: [],
    sessions: [],
    activities: [],
    immersionShows: [],
    unlockedAchievements: [],
    recentAchievementId: undefined,
    dailyChallenges: undefined,
    highscores: {},
    onboardingDone: false,
    settings: {}
  };
}

function readLocal(): AppState {
  if (typeof window === 'undefined') {
    return makeInitialState();
  }

  const raw = window.localStorage.getItem(LS_KEY);
  if (!raw) {
    const fresh = makeInitialState();
    window.localStorage.setItem(LS_KEY, JSON.stringify(fresh));
    return fresh;
  }
  const parsed = JSON.parse(raw) as Partial<AppState>;
  return {
    ...makeInitialState(),
    ...parsed,
    profile: { ...defaultProfile, ...(parsed.profile ?? {}) },
    highscores: parsed.highscores ?? (typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('highscores') ?? '{}') : {})
  };
}

function writeLocal(state: AppState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(state));
}

async function getSupabaseUserId(): Promise<string> {
  if (!supabase) return GUEST_USER;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? GUEST_USER;
}

export const storage = {
  isSupabaseMode: hasSupabase,

  async getState(): Promise<AppState> {
    if (!hasSupabase || !supabase) return readLocal();
    const userId = await getSupabaseUserId();
    if (userId === GUEST_USER) return readLocal();

    const [profileRes, cardsRes, sessionsRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('srs_cards').select('*').eq('user_id', userId),
      supabase.from('study_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    ]);

    const local = readLocal();
    return {
      profile: (profileRes.data as UserProfile | null) ?? { ...defaultProfile, user_id: userId },
      cards: (cardsRes.data as SRSCard[] | null) ?? [],
      sessions: (sessionsRes.data as StudySession[] | null) ?? [],
      activities: local.activities,
      immersionShows: local.immersionShows,
      unlockedAchievements: local.unlockedAchievements,
      recentAchievementId: local.recentAchievementId,
      dailyChallenges: local.dailyChallenges,
      highscores: local.highscores,
      onboardingDone: local.onboardingDone,
      settings: local.settings
    };
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    if (!hasSupabase || !supabase || profile.user_id === GUEST_USER) {
      const state = readLocal();
      state.profile = profile;
      writeLocal(state);
      return;
    }

    await supabase.from('user_profiles').upsert(profile, { onConflict: 'id' });
  },

  async saveCards(cards: SRSCard[]): Promise<void> {
    if (!hasSupabase || !supabase) {
      const state = readLocal();
      state.cards = cards;
      writeLocal(state);
      return;
    }
    const userId = await getSupabaseUserId();
    if (userId === GUEST_USER) {
      const state = readLocal();
      state.cards = cards;
      writeLocal(state);
      return;
    }
    await supabase.from('srs_cards').upsert(cards, { onConflict: 'user_id,card_type,card_id' });
  },

  async addSession(session: Omit<StudySession, 'id' | 'created_at'>): Promise<void> {
    const full: StudySession = { ...session, id: uid('session'), created_at: new Date().toISOString() };
    if (!hasSupabase || !supabase || session.user_id === GUEST_USER) {
      const state = readLocal();
      state.sessions = [full, ...state.sessions].slice(0, 100);
      writeLocal(state);
      return;
    }
    await supabase.from('study_sessions').insert(full);
  },

  async addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void> {
    const state = readLocal();
    state.activities = [{ ...activity, id: uid('activity'), timestamp: new Date().toISOString() }, ...state.activities].slice(0, 50);
    writeLocal(state);
  },

  async saveImmersionShows(shows: ImmersionShow[]): Promise<void> {
    const state = readLocal();
    state.immersionShows = shows;
    writeLocal(state);
  },

  async upsertImmersionShow(show: ImmersionShow): Promise<void> {
    const state = readLocal();
    const next = state.immersionShows.some((s) => s.id === show.id)
      ? state.immersionShows.map((s) => (s.id === show.id ? show : s))
      : [show, ...state.immersionShows];
    state.immersionShows = next;
    writeLocal(state);
  },

  async saveAchievements(ids: string[], recentAchievementId?: string): Promise<void> {
    const state = readLocal();
    state.unlockedAchievements = ids;
    state.recentAchievementId = recentAchievementId;
    writeLocal(state);
  },

  async saveDailyChallenges(payload: DailyChallengeProgress): Promise<void> {
    const state = readLocal();
    state.dailyChallenges = payload;
    writeLocal(state);
  },

  async saveHighScore(gameId: string, score: number): Promise<void> {
    const state = readLocal();
    const prev = state.highscores[gameId] ?? 0;
    if (score > prev) {
      state.highscores[gameId] = score;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('highscores', JSON.stringify(state.highscores));
      }
      writeLocal(state);
    }
  },

  async setOnboardingDone(done: boolean): Promise<void> {
    const state = readLocal();
    state.onboardingDone = done;
    writeLocal(state);
  },

  async saveSettings(settings: AppState['settings']): Promise<void> {
    const state = readLocal();
    state.settings = settings;
    writeLocal(state);
  },

  async resetAll(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LS_KEY);
      window.localStorage.removeItem('highscores');
    }
  },

  async exportData(): Promise<string> {
    const state = await this.getState();
    return JSON.stringify(state, null, 2);
  },

  createCard(card_type: SRSCardType, card_id: string, user_id = GUEST_USER): SRSCard {
    return {
      id: uid('card'),
      user_id,
      card_type,
      card_id,
      due_date: new Date().toISOString(),
      interval_days: 1,
      ease_factor: 2.5,
      reviews: 0,
      lapses: 0
    };
  }
};
