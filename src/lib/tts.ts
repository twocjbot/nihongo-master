'use client';

export function speakJapanese(text: string, rate = 1) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find((v) => v.lang.startsWith('ja'));
  if (jaVoice) utterance.voice = jaVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
