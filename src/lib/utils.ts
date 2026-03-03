export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

export function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}
