import GameGridSkeleton from '@/components/ui/GameGridSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="skeleton h-9 w-40 rounded-xl mb-2" aria-hidden="true" />
      <div className="skeleton h-4 w-24 rounded-full mb-8" aria-hidden="true" />
      <div className="skeleton h-16 w-full rounded-2xl mb-8" aria-hidden="true" />
      <GameGridSkeleton count={24} columns={4} />
    </div>
  );
}
