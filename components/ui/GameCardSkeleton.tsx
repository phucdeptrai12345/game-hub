export default function GameCardSkeleton() {
  return (
    <div className="block rounded-sm overflow-hidden bg-surface border border-border" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
    </div>
  );
}
