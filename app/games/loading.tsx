export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="skeleton h-9 w-40 rounded-xl mb-2.5" />
          <div className="skeleton h-4 w-28 rounded-full" />
        </div>
        <div className="flex gap-1.5">
          {[60, 52, 44].map((w, i) => (
            <div key={i} className="skeleton h-8 rounded-full" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
      <div className="grid-standard">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl w-full aspect-square"
            style={{ animationDelay: `${i * 30}ms` }} />
        ))}
      </div>
    </div>
  );
}
