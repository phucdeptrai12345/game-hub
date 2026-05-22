import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-32 min-h-[60vh]">
      <p
        className="text-[9rem] md:text-[12rem] font-black leading-none select-none"
        style={{ color: 'oklch(94% 0.005 255 / 0.07)' }}
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="text-3xl font-black text-fg -mt-4 mb-3">Page not found</h1>
      <p className="text-muted font-semibold max-w-xs mb-10 leading-relaxed">
        That page doesn't exist. Try searching for your game, or browse everything we have.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors duration-150"
        >
          Back to home
        </Link>
        <Link
          href="/games"
          className="px-6 py-3 bg-surface border border-border hover:border-accent/40 text-fg font-bold rounded-xl transition-colors duration-150"
        >
          Browse games
        </Link>
      </div>
    </div>
  );
}
