export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="skeleton h-3.5 w-10 rounded-full" aria-hidden="true" />
        <div className="skeleton h-3 w-1.5 rounded-full" aria-hidden="true" />
        <div className="skeleton h-3.5 w-12 rounded-full" aria-hidden="true" />
        <div className="skeleton h-3 w-1.5 rounded-full" aria-hidden="true" />
        <div className="skeleton h-3.5 w-36 rounded-full" aria-hidden="true" />
      </div>

      {/* Game iframe area */}
      <div
        className="skeleton w-full rounded-[20px]"
        style={{ aspectRatio: '4/3', maxHeight: '80vh' }}
        aria-hidden="true"
      />

      {/* Title + badge */}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="skeleton h-8 w-72 rounded-xl" aria-hidden="true" />
        <div className="skeleton h-6 w-20 rounded-full shrink-0" aria-hidden="true" />
      </div>

      {/* Description lines */}
      <div className="mt-4 space-y-2.5">
        <div className="skeleton h-4 w-full rounded-full" aria-hidden="true" />
        <div className="skeleton h-4 w-5/6 rounded-full" aria-hidden="true" />
        <div className="skeleton h-4 w-3/5 rounded-full" aria-hidden="true" />
      </div>
    </div>
  );
}
