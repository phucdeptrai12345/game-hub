export default function SkeletonCard() {
  return (
    <div
      className="rounded-[14px] overflow-hidden bg-surface border border-border"
      aria-hidden="true"
    >
      <div className="skeleton w-full" style={{ aspectRatio: '4/3' }} />
      <div className="px-3 pt-2.5 pb-3 space-y-2">
        <div className="skeleton h-3.5 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
