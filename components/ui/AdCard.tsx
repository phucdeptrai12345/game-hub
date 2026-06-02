'use client';

interface Props {
  variant?: 'default' | 'wide';
}

export default function AdCard({ variant = 'default' }: Props) {
  const isWide = variant === 'wide';

  return (
    <div
      className="game-card group flex flex-col h-full w-full rounded-xl overflow-hidden bg-surface border border-border/80 cursor-pointer active-click"
      onClick={() => window.open('https://gamemonetize.com/', '_blank')}
    >
      {/* Top Graphic */}
      <div className="relative overflow-hidden w-full flex-1 min-h-0">
        
        {/* Playful Pastel Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(97%_0.01_24)] to-[oklch(93%_0.008_24)] flex items-center justify-center p-4">
          <div className="text-center space-y-1">
            <span className={`animate-bounce duration-1000 ${isWide ? 'text-4xl' : 'text-3xl'}`} aria-hidden="true" style={{ display: 'inline-block' }}>🎯</span>
            <p className={`font-black tracking-widest text-accent uppercase title-display ${isWide ? 'text-xs' : 'text-[10px]'}`}>
              Premium Arcade
            </p>
          </div>
        </div>

        {/* Sponsored tag */}
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-white/90 border border-border/40 text-muted shadow-sm pointer-events-none">
          Sponsored
        </span>

      </div>

      {/* Info cabinet below */}
      <div className={`flex flex-col justify-between bg-surface border-t border-border/40 shrink-0 ${isWide ? 'p-4' : 'p-3'}`}>
        <div>
          <p className={`text-fg leading-snug line-clamp-1 mb-1 font-black tracking-tight title-display group-hover:text-accent transition-colors duration-150 ${isWide ? 'text-sm' : 'text-[0.78rem]'}`}>
            Play Retro Mini-Games
          </p>
          <p className={`text-muted font-bold line-clamp-1 mb-2.5 ${isWide ? 'text-xs' : 'text-[0.68rem]'}`}>
            100+ free arcade challenges online
          </p>
        </div>
        <div className="w-full">
          <div className="w-full py-1.5 rounded-lg bg-accent text-white text-[10px] font-black text-center transition-all duration-150 shadow-[0_2px_8px_oklch(64%_0.21_25/0.25)] flex items-center justify-center gap-1">
            <span>PLAY NOW</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
