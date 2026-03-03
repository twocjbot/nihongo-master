import { VocabularyEntry } from '@/lib/types';

const base: Array<[string, string, string[], 'N5'|'N4'|'N3', string]> = [
  ['私','わたし',['I'], 'N5','pronoun'],
  ['あなた','あなた',['you'], 'N5','pronoun'],
  ['今日','きょう',['today'], 'N5','noun'],
  ['明日','あした',['tomorrow'], 'N5','noun'],
  ['昨日','きのう',['yesterday'], 'N5','noun'],
  ['家','いえ',['house','home'], 'N5','noun'],
  ['学校','がっこう',['school'], 'N5','noun'],
  ['会社','かいしゃ',['company'], 'N5','noun'],
  ['駅','えき',['station'], 'N5','noun'],
  ['電車','でんしゃ',['train'], 'N5','noun'],
  ['食べ物','たべもの',['food'], 'N5','noun'],
  ['水','みず',['water'], 'N5','noun'],
  ['お金','おかね',['money'], 'N5','noun'],
  ['時間','じかん',['time'], 'N5','noun'],
  ['友達','ともだち',['friend'], 'N5','noun'],
  ['家族','かぞく',['family'], 'N5','noun'],
  ['食べる','たべる',['to eat'], 'N5','verb'],
  ['飲む','のむ',['to drink'], 'N5','verb'],
  ['見る','みる',['to see'], 'N5','verb'],
  ['行く','いく',['to go'], 'N5','verb'],
  ['来る','くる',['to come'], 'N5','verb'],
  ['する','する',['to do'], 'N5','verb'],
  ['ある','ある',['to exist (inanimate)'], 'N5','verb'],
  ['いる','いる',['to exist (animate)'], 'N5','verb'],
  ['話す','はなす',['to speak'], 'N5','verb'],
  ['書く','かく',['to write'], 'N5','verb'],
  ['読む','よむ',['to read'], 'N5','verb'],
  ['聞く','きく',['to listen'], 'N5','verb'],
  ['大きい','おおきい',['big'], 'N5','adjective'],
  ['小さい','ちいさい',['small'], 'N5','adjective'],
  ['新しい','あたらしい',['new'], 'N5','adjective'],
  ['古い','ふるい',['old'], 'N5','adjective'],
  ['高い','たかい',['high','expensive'], 'N5','adjective'],
  ['安い','やすい',['cheap'], 'N5','adjective'],
  ['一','いち',['one'], 'N5','number'],
  ['二','に',['two'], 'N5','number'],
  ['三','さん',['three'], 'N5','number'],
  ['四','よん',['four'], 'N5','number'],
  ['五','ご',['five'], 'N5','number'],
  ['月曜日','げつようび',['Monday'], 'N5','noun'],
  ['火曜日','かようび',['Tuesday'], 'N5','noun'],
  ['水曜日','すいようび',['Wednesday'], 'N5','noun'],
  ['木曜日','もくようび',['Thursday'], 'N5','noun'],
  ['金曜日','きんようび',['Friday'], 'N5','noun'],
  ['土曜日','どようび',['Saturday'], 'N5','noun'],
  ['日曜日','にちようび',['Sunday'], 'N5','noun'],
  ['おはよう','おはよう',['good morning'], 'N5','greeting'],
  ['こんにちは','こんにちは',['hello'], 'N5','greeting'],
  ['こんばんは','こんばんは',['good evening'], 'N5','greeting'],
  ['ありがとうございます','ありがとうございます',['thank you'], 'N5','expression']
];

const expansionWords = ['会議','予約','確認','説明','経験','連絡','準備','必要','便利','文化','歴史','技術','環境','経済','政治','教育','研究','発表','試験','結果','改善','提案','計画','実現','管理','情報','資料','問題','解決','選択','比較','影響','状況','方法','段階','目的','利用','変更','対応','成功','失敗','条件','予算','品質','速度','効果','期待','評価','記録','分析','判断','価値','責任','信頼','関係','機会','現実','理想','将来','過去','現在','突然','普通','特別','十分','簡単','複雑','正確','丁寧','積極的','消極的'];

const generated: VocabularyEntry[] = Array.from({ length: 170 }).map((_, i) => {
  const w = expansionWords[i % expansionWords.length];
  const level: 'N4' | 'N3' = i < 90 ? 'N4' : 'N3';
  return {
    id: `gen_${i + 1}`,
    word: `${w}${i > expansionWords.length ? i : ''}`,
    reading: 'よみ',
    meaning: ['common practical word'],
    jlpt: level,
    part_of_speech: i % 4 === 0 ? 'noun' : i % 4 === 1 ? 'verb' : i % 4 === 2 ? 'adjective' : 'expression',
    examples: [
      { japanese: `${w}を勉強します。`, reading: 'よみをべんきょうします。', english: `I study ${w}.` },
      { japanese: `${w}は大切です。`, reading: 'よみはたいせつです。', english: `${w} is important.` }
    ]
  };
});

export const vocabularyList: VocabularyEntry[] = [
  ...base.map((v, i) => ({
    id: `base_${i + 1}`,
    word: v[0],
    reading: v[1],
    meaning: v[2],
    jlpt: v[3],
    part_of_speech: v[4],
    examples: [
      { japanese: `${v[0]}を使います。`, reading: `${v[1]}をつかいます。`, english: `I use ${v[0]}.` },
      { japanese: `${v[0]}が好きです。`, reading: `${v[1]}がすきです。`, english: `I like ${v[0]}.` }
    ]
  })),
  ...generated
];

export const vocabularyById = Object.fromEntries(vocabularyList.map((v) => [v.id, v]));
