export default function GameCardSkeleton() {
  return (
    <div className="block rounded-[14px] overflow-hidden bg-surface border border-border" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
    </div>
  );
}
