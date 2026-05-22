import GameGridSkeleton from '@/components/ui/GameGridSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="skeleton w-14 h-14 rounded-2xl shrink-0" aria-hidden="true" />
        <div>
          <div className="skeleton h-8 w-48 rounded-xl mb-2" aria-hidden="true" />
          <div className="skeleton h-4 w-32 rounded-full" aria-hidden="true" />
        </div>
      </div>
      <GameGridSkeleton count={12} columns={4} />
    </div>
  );
}
