export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="skeleton h-9 w-48 rounded-xl mb-2.5" />
          <div className="skeleton h-4 w-72 rounded-full" />
        </div>
        <div className="flex gap-1.5 mt-1">
          {[64, 56, 44].map((w, i) => (
            <div key={i} className="skeleton h-8 rounded-full" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
      {/* Grid */}
      <div className="grid-standard">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl w-full aspect-square"
            style={{ animationDelay: `${i * 30}ms` }} />
        ))}
      </div>
    </div>
  );
}
