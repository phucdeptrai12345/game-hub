export default function Loading() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10">

      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="skeleton h-9 w-36 rounded-xl mb-2" aria-hidden="true" />
          <div className="skeleton h-4 w-28 rounded-full" aria-hidden="true" />
        </div>
        <div className="flex gap-1.5">
          <div className="skeleton h-8 w-20 rounded-full" aria-hidden="true" />
          <div className="skeleton h-8 w-16 rounded-full" aria-hidden="true" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid-standard">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="skeleton rounded-xl w-full h-full" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
