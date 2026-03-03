import { ReadingPassage } from '@/lib/types';

export const readingPassages: ReadingPassage[] = [
  {
    id: 'r1',
    title: 'わたしの一日',
    level: 'N5',
    text: 'わたしは毎朝六時に起きます。七時に朝ごはんを食べて、八時に学校へ行きます。',
    furigana_text: 'わたしは毎朝(まいあさ)六時(ろくじ)に起(お)きます。七時(しちじ)に朝(あさ)ごはんを食(た)べて、八時(はちじ)に学校(がっこう)へ行(い)きます。',
    translation: 'I wake up at 6 every morning. I eat breakfast at 7 and go to school at 8.',
    vocabulary: [
      { word: '毎朝', reading: 'まいあさ', meaning: 'every morning' },
      { word: '学校', reading: 'がっこう', meaning: 'school' }
    ],
    comprehension_questions: [
      { question: '何時に起きますか。', options: ['六時', '七時', '八時'], correct: 0 }
    ]
  },
  {
    id: 'r2',
    title: '駅のお知らせ',
    level: 'N4',
    text: '本日、強い雨のため、電車が少し遅れています。ご迷惑をおかけして申し訳ありません。',
    furigana_text: '本日(ほんじつ)、強(つよ)い雨(あめ)のため、電車(でんしゃ)が少(すこ)し遅(おく)れています。ご迷惑(めいわく)をおかけして申(もう)し訳(わけ)ありません。',
    translation: 'Today, due to heavy rain, trains are slightly delayed. We apologize for the inconvenience.',
    vocabulary: [
      { word: '遅れる', reading: 'おくれる', meaning: 'to be delayed' },
      { word: '迷惑', reading: 'めいわく', meaning: 'trouble/inconvenience' }
    ],
    comprehension_questions: [
      { question: 'なぜ電車が遅れていますか。', options: ['事故', '雨', '雪'], correct: 1 }
    ]
  },
  {
    id: 'r3',
    title: '週末の計画',
    level: 'N4',
    text: '今週末、友達と京都へ旅行する予定です。神社を見たり、おいしい料理を食べたりしたいです。',
    furigana_text: '今週末(こんしゅうまつ)、友達(ともだち)と京都(きょうと)へ旅行(りょこう)する予定(よてい)です。神社(じんじゃ)を見(み)たり、おいしい料理(りょうり)を食(た)べたりしたいです。',
    translation: 'This weekend, I plan to travel to Kyoto with friends. I want to see shrines and eat delicious food.',
    vocabulary: [
      { word: '予定', reading: 'よてい', meaning: 'plan' },
      { word: '料理', reading: 'りょうり', meaning: 'cuisine' }
    ],
    comprehension_questions: [
      { question: 'どこへ旅行しますか。', options: ['大阪', '京都', '東京'], correct: 1 }
    ]
  },
  {
    id: 'r4',
    title: '小さな失敗',
    level: 'N3',
    text: '昨日、会議の時間を間違えてしまい、十分遅れて到着した。次回からは前日に必ず確認しようと思う。',
    furigana_text: '昨日(きのう)、会議(かいぎ)の時間(じかん)を間違(まちが)えてしまい、十分(じゅっぷん)遅(おく)れて到着(とうちゃく)した。次回(じかい)からは前日(ぜんじつ)に必(かなら)ず確認(かくにん)しようと思(おも)う。',
    translation: 'Yesterday I got the meeting time wrong and arrived 10 minutes late. Next time I will make sure to check the day before.',
    vocabulary: [
      { word: '間違える', reading: 'まちがえる', meaning: 'to make a mistake' },
      { word: '到着', reading: 'とうちゃく', meaning: 'arrival' }
    ],
    comprehension_questions: [
      { question: '話者は何を間違えましたか。', options: ['場所', '時間', '資料'], correct: 1 }
    ]
  },
  {
    id: 'r5',
    title: '町の新しい図書館',
    level: 'N3',
    text: '私の町に新しい図書館ができた。静かな学習スペースや外国語の本が充実していて、毎週利用している。',
    furigana_text: '私(わたし)の町(まち)に新(あたら)しい図書館(としょかん)ができた。静(しず)かな学習(がくしゅう)スペースや外国語(がいこくご)の本(ほん)が充実(じゅうじつ)していて、毎週(まいしゅう)利用(りよう)している。',
    translation: 'A new library opened in my town. It has quiet study spaces and a rich foreign-language collection, so I use it every week.',
    vocabulary: [
      { word: '充実', reading: 'じゅうじつ', meaning: 'fulfillment/enrichment' },
      { word: '利用', reading: 'りよう', meaning: 'use' }
    ],
    comprehension_questions: [
      { question: '図書館の特徴は何ですか。', options: ['古い建物', '本が少ない', '外国語の本が多い'], correct: 2 }
    ]
  }
];
