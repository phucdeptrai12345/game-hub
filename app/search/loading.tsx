import GameGridSkeleton from '@/components/ui/GameGridSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="skeleton h-7 w-56 rounded-[2px] mb-4" aria-hidden="true" />
      <div className="skeleton h-11 w-full max-w-lg rounded-sm mb-8" aria-hidden="true" />
      <GameGridSkeleton count={8} columns={4} />
    </div>
  );
}
