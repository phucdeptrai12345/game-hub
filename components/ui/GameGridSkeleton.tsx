import GameCardSkeleton from './GameCardSkeleton';

interface Props {
  count?: number;
  columns?: 2 | 3 | 4;
}

const colClass = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
} as const;

export default function GameGridSkeleton({ count = 8, columns = 4 }: Props) {
  return (
    <div className={`grid ${colClass[columns]} gap-3 sm:gap-4`} aria-label="Loading games...">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}
