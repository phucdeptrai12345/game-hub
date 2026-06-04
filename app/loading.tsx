export default function Loading() {
  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-10 min-h-[60vh] flex flex-col">

      {/* Centered loader */}
      <div className="flex flex-col items-center justify-center flex-1 py-16">
        {/* Pulsing logo */}
        <div className="relative mb-6">
          {/* Outer pulse ring */}
          <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          {/* Inner circle */}
          <div className="relative w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6H6a4 4 0 0 0-4 4v3a4 4 0 0 0 4 4h1.5a3 3 0 0 1 2.5 1.5L11 20a1 1 0 0 0 2 0l1-1.5a3 3 0 0 1 2.5-1.5H18a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.15"/>
              <path d="M6 12h4M8 10v4"/>
              <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none"/>
              <circle cx="17.5" cy="13.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
        </div>

        {/* Text */}
        <p className="text-lg font-black uppercase tracking-widest text-fg title-display mb-2">
          Play<span className="text-accent">za</span>
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-accent"
              style={{
                animation: 'bounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
                display: 'inline-block',
              }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton preview below — gives sense of content loading */}
      <div className="opacity-40">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-1.5 h-6 rounded-full" />
            <div className="skeleton h-6 w-32 rounded-lg" />
          </div>
          <div className="skeleton h-4 w-20 rounded-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid-poki">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="skeleton rounded-xl w-full aspect-square"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
