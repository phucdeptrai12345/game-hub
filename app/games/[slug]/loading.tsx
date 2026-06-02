export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

        {/* Left: iframe area */}
        <div className="min-w-0">
          <div className="skeleton w-full rounded-[20px]" style={{ aspectRatio: '4/3' }} aria-hidden="true" />

          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="skeleton h-8 w-72 rounded-xl" aria-hidden="true" />
            <div className="skeleton h-6 w-20 rounded-full shrink-0" aria-hidden="true" />
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="skeleton h-4 w-full rounded-full" aria-hidden="true" />
            <div className="skeleton h-4 w-5/6 rounded-full" aria-hidden="true" />
            <div className="skeleton h-4 w-3/5 rounded-full" aria-hidden="true" />
          </div>
        </div>

        {/* Right: ad + related */}
        <div className="flex flex-col gap-6">
          <div className="skeleton w-full rounded-2xl" style={{ minHeight: '250px' }} aria-hidden="true" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="skeleton aspect-square rounded-xl" aria-hidden="true" />
                <div className="skeleton h-3 rounded-full w-4/5" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
