export default function GameLoading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="min-w-0 space-y-5">
          <div className="skeleton w-full rounded-[20px]" style={{ aspectRatio: "16/9" }} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="skeleton h-8 w-3/4 rounded-lg" />
            <div className="skeleton h-6 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-4/6 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="skeleton h-48 rounded-xl" />
          <div>
            <div className="skeleton h-5 w-40 rounded mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="skeleton aspect-square rounded-xl" />
                  <div className="skeleton h-3 w-4/5 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}