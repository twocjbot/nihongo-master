import { JLPTLevel, ShowVocabulary } from '@/lib/types';
import { uid } from '@/lib/utils';

type AniListResponse = {
  data?: {
    Media?: {
      id: number;
      description?: string;
      title?: { romaji?: string; native?: string };
      coverImage?: { large?: string; medium?: string };
    };
  };
  errors?: { message: string }[];
};

type JishoResponse = {
  data?: Array<{
    slug?: string;
    japanese?: Array<{ word?: string; reading?: string }>;
    senses?: Array<{ english_definitions?: string[] }>;
  }>;
};

const themeWordMap: Record<string, string[]> = {
  school: ['学校', '先生', '授業', '勉強', '試験'],
  battle: ['戦い', '強い', '勝つ', '武器', '仲間'],
  romance: ['恋', '好き', '気持ち', '約束', '会う'],
  fantasy: ['魔法', '王国', '伝説', '運命', '冒険'],
  city: ['駅', '電車', '会社', '店', '道'],
  mystery: ['事件', '証拠', '秘密', '調査', '推理'],
  sports: ['試合', '練習', '勝負', 'チーム', '努力'],
  music: ['音楽', '歌', '練習', '舞台', '夢']
};

export async function searchAniListShow(search: string) {
  const query = `query ($search: String) { Media(search: $search, type: ANIME) { id title { romaji native } description(asHtml: false) coverImage { large medium } } }`;

  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { search } })
  });

  if (!res.ok) throw new Error(`AniList error: ${res.status}`);
  const data = (await res.json()) as AniListResponse;
  if (data.errors?.length) throw new Error(data.errors[0].message);
  if (!data.data?.Media) throw new Error('No matching show found');
  return data.data.Media;
}

export function inferThemeWords(description = '') {
  const lower = description.toLowerCase();
  const picked = new Set<string>();
  Object.entries(themeWordMap).forEach(([theme, words]) => {
    if (lower.includes(theme)) words.forEach((w) => picked.add(w));
  });

  if (picked.size < 8) {
    ['主人公', '友達', '家族', '時間', '気持ち', '見る', '聞く', '言う', '行く', '思う'].forEach((w) => picked.add(w));
  }

  return [...picked].slice(0, 12);
}

export async function searchJishoWord(word: string): Promise<ShowVocabulary[]> {
  const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error(`Jisho error: ${res.status}`);
  const data = (await res.json()) as JishoResponse;
  return (data.data ?? []).slice(0, 5).map((entry, i) => ({
    id: uid('show_vocab'),
    word: entry.japanese?.[0]?.word ?? entry.slug ?? word,
    reading: entry.japanese?.[0]?.reading ?? '',
    meaning: entry.senses?.[0]?.english_definitions?.slice(0, 2).join(', ') ?? 'meaning unavailable',
    source: 'jisho',
    frequency: 100 - i
  }));
}

export async function buildThemeVocabulary(description = ''): Promise<ShowVocabulary[]> {
  const keywords = inferThemeWords(description);
  const chunks = await Promise.allSettled(keywords.map((k) => searchJishoWord(k)));
  const words: ShowVocabulary[] = [];
  for (const result of chunks) {
    if (result.status === 'fulfilled') {
      for (const item of result.value) {
        if (!words.some((w) => w.word === item.word && w.reading === item.reading)) {
          words.push({ ...item, source: 'anilist-theme' });
        }
      }
    }
  }
  return words.slice(0, 80);
}

export function parseBulkVocabulary(input: string): ShowVocabulary[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [word, reading, meaning] = line.split(',').map((s) => (s ?? '').trim());
      return {
        id: uid('show_vocab'),
        word,
        reading,
        meaning,
        source: 'manual' as const,
        frequency: Math.max(1, 100 - i)
      };
    })
    .filter((w) => w.word && w.meaning);
}

export function estimateLevelFromVocab(words: ShowVocabulary[]): JLPTLevel {
  const hard = words.filter((w) => w.word.length >= 3).length;
  if (hard > 40) return 'N2';
  if (hard > 25) return 'N3';
  if (hard > 12) return 'N4';
  return 'N5';
}
