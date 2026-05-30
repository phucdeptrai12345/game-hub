interface ControlItem {
  kind: 'mouse' | 'wasd' | 'arrows' | 'space' | 'enter' | 'shift' | 'key' | 'touch' | 'gamepad';
  label: string;
  detail: string;
  keys?: string[];
}

interface Props {
  instructions: string;
}

function normalizeInstructions(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function getControlItems(instructions: string): ControlItem[] {
  const text = instructions.toLowerCase();
  const items: ControlItem[] = [];

  if (hasAny(text, [/\bwasd\b/, /\bw\s*a\s*s\s*d\b/])) {
    items.push({
      kind: 'wasd',
      label: 'Move',
      detail: 'Use WASD to move your character.',
      keys: ['W', 'A', 'S', 'D'],
    });
  }

  if (hasAny(text, [/arrow keys?/, /\barrows?\b/, /cursor keys?/])) {
    items.push({
      kind: 'arrows',
      label: 'Move',
      detail: 'Use the arrow keys to move or steer.',
      keys: ['↑', '←', '↓', '→'],
    });
  }

  const hasKeyboardControl = items.length > 0;
  const hasMouseControl = hasAny(text, [
    /\bmouse\b/,
    /\bleft click\b/,
    /\bright click\b/,
    /\bclick and hold\b/,
    /\bclick on\b/,
    /\bclick the\b/,
    /\bdrag\b/,
    /\btap\b/,
  ]);

  if (hasMouseControl) {
    items.push({
      kind: hasAny(text, [/tap/]) && !hasAny(text, [/mouse/, /click/]) ? 'touch' : 'mouse',
      label: hasAny(text, [/drag/]) ? 'Drag' : 'Aim / Select',
      detail: hasAny(text, [/drag/])
        ? 'Hold and drag to control movement or objects.'
        : 'Click or tap to aim, select, or interact.',
    });
  }

  if (hasAny(text, [/spacebar/, /space bar/, /\bspace\b/])) {
    items.push({
      kind: 'space',
      label: 'Action',
      detail: 'Press Space for the main action.',
      keys: ['SPACE'],
    });
  }

  if (hasAny(text, [/\benter\b/, /return key/])) {
    items.push({
      kind: 'enter',
      label: 'Confirm',
      detail: 'Press Enter to confirm or start.',
      keys: ['ENTER'],
    });
  }

  if (hasAny(text, [/\bshift\b/])) {
    items.push({
      kind: 'shift',
      label: 'Boost',
      detail: 'Hold Shift for sprint, boost, or special movement.',
      keys: ['SHIFT'],
    });
  }

  if (items.length === 0) {
    items.push({
      kind: 'gamepad',
      label: 'Controls',
      detail: 'Start the game and follow the controls shown on screen.',
    });
  } else if (!hasKeyboardControl && items.length === 1 && items[0]?.kind === 'mouse') {
    items[0].detail = 'Use the mouse only when the game asks for it.';
  }

  return items.slice(0, 4);
}

function Keycap({ children, wide = false }: { children: string; wide?: boolean }) {
  return (
    <span
      className={`flex h-8 items-center justify-center rounded-lg border border-border bg-background text-sm font-black text-fg shadow-[inset_0_-2px_0_oklch(10%_0.01_250/0.08)] ${
        wide ? 'min-w-20 px-3' : 'w-8'
      }`}
    >
      {children}
    </span>
  );
}

function MouseIcon() {
  return (
    <div className="relative flex h-14 w-10 justify-center rounded-[18px] border-2 border-fg/75 bg-background shadow-[inset_0_-3px_0_oklch(10%_0.01_250/0.08)]">
      <span className="mt-2 h-3 w-1 rounded-full bg-accent" />
      <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-fg/25" />
    </div>
  );
}

function TouchIcon() {
  return (
    <div className="relative flex h-14 w-11 items-center justify-center rounded-xl border-2 border-fg/70 bg-background">
      <span className="h-6 w-6 rounded-full border-2 border-accent bg-accent/10" />
      <span className="absolute bottom-1.5 h-1 w-5 rounded-full bg-fg/20" />
    </div>
  );
}

function GamepadIcon() {
  return (
    <div className="relative h-12 w-16 rounded-[18px] border-2 border-fg/70 bg-background shadow-[inset_0_-3px_0_oklch(10%_0.01_250/0.08)]">
      <span className="absolute left-3 top-1/2 h-1.5 w-5 -translate-y-1/2 rounded-full bg-fg/55" />
      <span className="absolute left-[18px] top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full bg-fg/55" />
      <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-accent" />
      <span className="absolute right-2.5 top-[26px] h-2.5 w-2.5 rounded-full bg-fg/35" />
    </div>
  );
}

function ControlVisual({ item }: { item: ControlItem }) {
  if (item.kind === 'mouse') return <MouseIcon />;
  if (item.kind === 'touch') return <TouchIcon />;
  if (item.kind === 'gamepad') return <GamepadIcon />;

  if (item.kind === 'wasd') {
    return (
      <div className="grid grid-cols-3 gap-1">
        <span />
        <Keycap>W</Keycap>
        <span />
        <Keycap>A</Keycap>
        <Keycap>S</Keycap>
        <Keycap>D</Keycap>
      </div>
    );
  }

  if (item.kind === 'arrows') {
    return (
      <div className="grid grid-cols-3 gap-1">
        <span />
        <Keycap>↑</Keycap>
        <span />
        <Keycap>←</Keycap>
        <Keycap>↓</Keycap>
        <Keycap>→</Keycap>
      </div>
    );
  }

  const key = item.keys?.[0] ?? '';
  return <Keycap wide={key.length > 1}>{key}</Keycap>;
}

export default function ControlGuide({ instructions }: Props) {
  const cleanInstructions = normalizeInstructions(instructions);
  const items = getControlItems(cleanInstructions);

  return (
    <section className="mt-5 rounded-2xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-fg">Controls</p>
          <p className="mt-0.5 text-sm font-semibold text-muted">Quick guide before you start.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={`${item.kind}-${item.label}`} className="flex min-h-28 items-center gap-3 rounded-xl bg-navy p-3">
            <div className="flex w-24 shrink-0 items-center justify-center">
              <ControlVisual item={item} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-black text-fg">{item.label}</p>
              <p className="mt-1 text-sm font-semibold leading-snug text-muted">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {cleanInstructions && (
        <p className="mt-4 max-w-[72ch] text-sm font-semibold leading-relaxed text-muted">
          {cleanInstructions}
        </p>
      )}
    </section>
  );
}
