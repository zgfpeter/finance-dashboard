import Skeleton from "./Skeleton";

export function ChartCardSkeleton({ height = 120 }: { height?: number }) {
  return (
    <div
      className="
        w-full rounded-xl border-2 border-(--border-blue)
        bg-(--primary-bg) p-3 flex flex-col gap-3 
      "
      style={{ height }}
    >
      <Skeleton className="h-full w-full" /> {/* title */}
    </div>
  );
}
