import { SRSCard } from '@/lib/types';

export type ReviewRating = 'Again' | 'Hard' | 'Good' | 'Easy';

const DAY_MS = 24 * 60 * 60 * 1000;

export function applySM2(card: SRSCard, rating: ReviewRating): SRSCard {
  let interval = Math.max(1, card.interval_days);
  let ease = Math.max(1.3, card.ease_factor);

  if (rating === 'Again') {
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  } else if (rating === 'Hard') {
    interval = Math.max(1, interval * 1.2);
    ease = Math.max(1.3, ease - 0.15);
  } else if (rating === 'Good') {
    interval = Math.max(1, interval * ease);
  } else {
    interval = Math.max(1, interval * ease * 1.3);
    ease = Math.max(1.3, ease + 0.1);
  }

  const now = Date.now();
  return {
    ...card,
    due_date: new Date(now + interval * DAY_MS).toISOString(),
    interval_days: Number(interval.toFixed(2)),
    ease_factor: Number(ease.toFixed(2)),
    reviews: card.reviews + 1,
    lapses: rating === 'Again' ? card.lapses + 1 : card.lapses
  };
}

export function isDue(card: SRSCard, at = new Date()): boolean {
  return new Date(card.due_date).getTime() <= at.getTime();
}
