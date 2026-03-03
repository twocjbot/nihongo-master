import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const GamesHub = dynamicImport(() => import('@/components/games/GamesHub'), {
  ssr: false,
  loading: () => <div className="mx-auto max-w-6xl p-6">Loading games...</div>
});

export default function GamesPage() {
  return <GamesHub />;
}
