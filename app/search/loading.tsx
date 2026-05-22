import GameGridSkeleton from '@/components/ui/GameGridSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="skeleton h-9 w-64 rounded-xl mb-5" aria-hidden="true" />
      <div className="skeleton h-12 w-full max-w-lg rounded-2xl mb-8" aria-hidden="true" />
      <GameGridSkeleton count={8} columns={4} />
    </div>
  );
}
