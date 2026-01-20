import Skeleton from "./Skeleton";

export function DebtsSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div
      className="
        w-full rounded-md border-2 border-(--border-blue)
        bg-(--primary-bg) p-3 flex flex-col gap-3
      "
    >
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex justify-between gap-3">
          <Skeleton className="w-full h-11" />
        </div>
      ))}
    </div>
  );
}
