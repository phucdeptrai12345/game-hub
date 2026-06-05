export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="skeleton h-8 w-44 rounded-[3px] mb-2" />
          <div className="skeleton h-3.5 w-64 rounded-[2px]" />
        </div>
        <div className="flex gap-1.5 mt-1">
          {[60, 52, 40].map((w, i) => (
            <div key={i} className="skeleton h-7 rounded-sm" style={{ width: `${w}px`, animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      </div>
      <div className="grid-standard">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="skeleton rounded-sm w-full aspect-square"
            style={{ animationDelay: `${i * 30}ms` }} />
        ))}
      </div>
    </div>
  );
}
