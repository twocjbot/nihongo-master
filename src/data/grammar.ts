import { GrammarEntry, JLPTLevel } from '@/lib/types';

const patterns: Array<[string, JLPTLevel, string, string, string, string]> = [
  ['です/ます','N5','polite sentence endings','Basic polite speech style.','N + です / Vます','Use in formal settings.'],
  ['て-form','N5','linking/requests','Connect actions and make requests.','Vて + ください','Core conjugation to master.'],
  ['た-form','N5','past tense','Describes completed actions.','Vた','Irregular verbs differ.'],
  ['ない-form','N5','negative form','Expresses not doing something.','Vない','Used with many patterns.'],
  ['potential form','N4','ability','Express can/cannot do.','Vれる/られる','Watch godan/ichidan split.'],
  ['〜ている','N5','ongoing state','Progressive and resultant states.','Vている','Context determines meaning.'],
  ['〜てもいい','N5','permission','Asking/giving permission.','Vてもいい','Politeness can vary.'],
  ['〜てはいけない','N5','prohibition','Saying must not do.','Vてはいけない','Soft forms exist.'],
  ['conditionals と','N4','natural result','If A, then naturally B.','AとB','Not for volitional result.'],
  ['conditionals ば','N4','hypothetical condition','General if condition.','Vば','Formal nuance.'],
  ['conditionals たら','N4','if/when after','Conditional after completion.','Vたら','Very common spoken form.'],
  ['conditionals なら','N4','if it is the case','Based on prior context.','N/普通形 + なら','Topic-based condition.'],
  ['particles は/が','N5','topic vs subject','Contrast and focus.','Nは / Nが','Common learner pain point.'],
  ['particles を/に/で','N5','object, target, place','Core sentence roles.','Nを, Nに, Nで','Use with movement verbs too.'],
  ['comparison より/ほど','N4','comparisons','Compare two items.','AはBより...','Add ほうが for preference.'],
  ['giving あげる/くれる/もらう','N4','giving/receiving','Perspective-based giving verbs.','XはYにVてあげる','Speaker viewpoint matters.'],
  ['time に/まで/から','N5','time expressions','Mark start/end/time point.','N時に, から, まで','Not all temporal nouns take に.'],
  ['〜たい','N5','want to do','Express desire.','Vます-stem + たい','Usually first person.'],
  ['〜つもり','N4','intend to','State intention.','V辞書形 + つもり','Plan may change.'],
  ['〜ながら','N4','while doing','Two simultaneous actions.','Vます-stem + ながら','Main action comes second.'],
  ['〜そうだ (appearance)','N4','looks like','Judging by appearance.','Vます-stem/Adj + そう','Different from hearsay そうだ.'],
  ['〜ようと思う','N4','decide to do','Volitional intention.','V意向形 + と思う','Personal decision nuance.'],
  ['〜ことがある','N4','have experience','Past experience.','Vた + ことがある','For life experiences.'],
  ['〜なければならない','N4','must do','Obligation.','Vない->なければならない','Colloquial contractions common.'],
  ['〜てもらう','N4','receive favor','Have someone do for you.','Vてもらう','Often indicates gratitude.'],
  ['〜らしい','N3','seems/hearsay','Reported or typical.','普通形 + らしい','Not same as そうだ.'],
  ['〜ようだ','N3','seems like','Inference by evidence.','普通形 + ようだ','Formal-ish written style.'],
  ['〜わけではない','N3','not necessarily','Partial negation.','普通形 + わけではない','Useful for nuance.'],
  ['〜ことになる','N3','it is decided that','Resulting decision/state.','V辞書形 + ことになる','External decision vibe.'],
  ['〜ようにする','N3','make effort to','Habitual effort.','V辞書形 + ようにする','Good for goals.'],
  ['〜おかげで','N3','thanks to','Positive cause.','N/普通形 + おかげで','For gratitude context.'],
  ['〜せいで','N3','because of (negative)','Negative cause.','N/普通形 + せいで','Opposite emotional tone of おかげで.']
];

export const grammarList: GrammarEntry[] = patterns.map((p, i) => ({
  id: `grammar_${i + 1}`,
  pattern: p[0],
  level: p[1],
  meaning: p[2],
  explanation: p[3],
  formation: p[4],
  examples: [
    { japanese: '日本語を勉強しています。', reading: 'にほんごをべんきょうしています。', english: 'I am studying Japanese.' },
    { japanese: '毎日れんしゅうすると上手になります。', reading: 'まいにちれんしゅうするとじょうずになります。', english: 'If you practice every day, you improve.' }
  ],
  notes: p[5]
}));
