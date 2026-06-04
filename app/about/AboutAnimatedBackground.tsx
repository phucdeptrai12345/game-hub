'use client';

export default function AboutAnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dynamic Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundSize: '32px 32px' }}
      />
      
      {/* 1. Emerald / Cyan Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/40 dark:bg-emerald-500/30 blur-[100px] mix-blend-screen animate-float-blob" />
      
      {/* 2. Fuchsia / Rose Glow */}
      <div className="absolute top-[20%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-fuchsia-500/40 dark:bg-fuchsia-500/30 blur-[100px] mix-blend-screen animate-float-blob" style={{ animationDelay: '-2s', animationDuration: '14s' }} />
      
      {/* 3. Blue / Indigo Glow */}
      <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-blue-500/40 dark:bg-blue-500/30 blur-[120px] mix-blend-screen animate-float-blob" style={{ animationDelay: '-4s', animationDuration: '18s' }} />

      {/* 4. Amber / Yellow Glow (Center) */}
      <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-amber-500/40 dark:bg-amber-500/30 blur-[90px] mix-blend-screen animate-float-blob" style={{ animationDelay: '-6s', animationDuration: '12s' }} />

      {/* 5. Violet Glow (Bottom Right) */}
      <div className="absolute bottom-[10%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-violet-500/40 dark:bg-violet-500/30 blur-[80px] mix-blend-screen animate-float-blob" style={{ animationDelay: '-1s', animationDuration: '10s' }} />
      
      {/* 6. Rose Glow (Top Right) */}
      <div className="absolute top-[10%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-rose-500/40 dark:bg-rose-500/30 blur-[100px] mix-blend-screen animate-float-blob" style={{ animationDelay: '-3s', animationDuration: '16s' }} />
      
      {/* Subtle overlay to prevent blobs from being too harsh */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
    </div>
  );
}
