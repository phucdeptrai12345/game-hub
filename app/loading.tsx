import GameGridSkeleton from '@/components/ui/GameGridSkeleton';

export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="border-b border-border/40" style={{ minHeight: '38vh' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: '38vh' }}>
          <div className="py-10 w-full max-w-2xl">
            <div className="skeleton h-6 w-48 rounded-full mb-5" aria-hidden="true" />
            <div className="skeleton h-14 w-80 rounded-xl mb-3" aria-hidden="true" />
            <div className="skeleton h-14 w-48 rounded-xl mb-6" aria-hidden="true" />
            <div className="skeleton h-12 w-full max-w-md rounded-2xl" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Category strip skeleton */}
      <div className="border-y border-border/40 bg-surface/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton shrink-0 h-7 w-20 rounded-full" aria-hidden="true" />
          ))}
        </div>
      </div>

      {/* Game grids */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-10 pb-4">
          <div className="skeleton h-6 w-32 rounded-xl mb-5" aria-hidden="true" />
          <GameGridSkeleton count={16} columns={4} />
        </div>
        <div className="pt-10 pb-16">
          <div className="skeleton h-6 w-24 rounded-xl mb-5" aria-hidden="true" />
          <GameGridSkeleton count={12} columns={4} />
        </div>
      </div>
    </>
  );
}
