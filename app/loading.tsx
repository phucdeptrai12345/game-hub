export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">

      {/* Section header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="skeleton w-[3px] h-5 rounded-none" />
          <div className="skeleton h-5 w-28 rounded-[2px]" />
        </div>
        <div className="skeleton h-3.5 w-16 rounded-[2px]" />
      </div>

      {/* Category pills skeleton */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {[72, 56, 80, 64, 52, 68, 48].map((w, i) => (
          <div key={i} className="skeleton h-7 rounded-sm shrink-0"
            style={{ width: `${w}px`, animationDelay: `${i * 30}ms` }} />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid-poki">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="skeleton rounded-sm w-full aspect-square"
            style={{ animationDelay: `${i * 35}ms` }} />
        ))}
      </div>

      {/* Second section */}
      <div className="flex items-center gap-3 mt-12 mb-6">
        <div className="skeleton w-[3px] h-5 rounded-none" />
        <div className="skeleton h-5 w-24 rounded-[2px]" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid-standard">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton rounded-sm w-full aspect-square"
            style={{ animationDelay: `${(i + 20) * 35}ms` }} />
        ))}
      </div>
    </div>
  );
}
