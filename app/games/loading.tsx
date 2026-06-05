export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="skeleton h-8 w-36 rounded-[3px] mb-2" />
          <div className="skeleton h-3.5 w-24 rounded-[2px]" />
        </div>
        <div className="flex gap-1.5">
          {[56, 48, 40].map((w, i) => (
            <div key={i} className="skeleton h-7 rounded-sm" style={{ width: `${w}px`, animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      </div>
      <div className="grid-standard">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="skeleton rounded-sm w-full aspect-square"
            style={{ animationDelay: `${i * 30}ms` }} />
        ))}
      </div>
    </div>
  );
}
