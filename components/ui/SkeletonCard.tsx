export default function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="rounded-sm overflow-hidden bg-surface border border-border"
      aria-hidden="true"
      style={{ '--sk-delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className="skeleton w-full" style={{ aspectRatio: '4/3', animationDelay: `${delay}ms` }} />
      <div className="px-3 pt-2.5 pb-3 space-y-2">
        <div className="skeleton h-3.5 w-3/4 rounded-[2px]" style={{ animationDelay: `${delay}ms` }} />
        <div className="skeleton h-3 w-2/5 rounded-[2px]" style={{ animationDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} delay={i * 35} />
      ))}
    </div>
  );
}
