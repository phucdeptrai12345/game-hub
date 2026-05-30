export default function Loading() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* Hero skeleton */}
      <section className="py-10 md:py-16">
        <div className="max-w-2xl">
          <div className="skeleton h-6 w-52 rounded-full mb-5" aria-hidden="true" />
          <div className="skeleton h-14 w-80 rounded-xl mb-3" aria-hidden="true" />
          <div className="skeleton h-14 w-48 rounded-xl" aria-hidden="true" />
        </div>
      </section>

      {/* Section header */}
      <div className="pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="skeleton w-1.5 h-6 rounded-full" aria-hidden="true" />
            <div className="skeleton h-7 w-36 rounded-xl" aria-hidden="true" />
          </div>
          <div className="skeleton h-4 w-20 rounded-full" aria-hidden="true" />
        </div>

        {/* Game grid skeleton */}
        <div className="grid-poki">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="skeleton rounded-xl w-full h-full" aria-hidden="true" />
          ))}
        </div>
      </div>
    </div>
  );
}
