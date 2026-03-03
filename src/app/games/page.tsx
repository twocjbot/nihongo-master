import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

const GamesHub = nextDynamic(() => import('@/components/games/GamesHub'), {
  ssr: false,
  loading: () => <div className="mx-auto max-w-6xl p-6 text-white/60">Loading games...</div>
});

export default function GamesPage() {
  return <GamesHub />;
}
