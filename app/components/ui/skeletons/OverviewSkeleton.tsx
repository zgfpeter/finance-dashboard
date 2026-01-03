import SeparatorLine from "../SeparatorLine";
import Skeleton from "./Skeleton";

export function OverviewSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div
      className="
        w-full rounded-xl border-2 border-(--border-blue)
        bg-(--primary-bg) p-3 flex flex-col gap-3
      "
    >
      <div className="flex justify-between">
        <h1 className="text-3xl">Overview</h1>
      </div>
      <div className="flex justify-between">
        <p className="text-xl text-(--limegreen) bg-(--primary-blue) flex justify-between ">
          <span>Total balance: </span>
        </p>
        <Skeleton className="h-6 w-1/5" />
      </div>
      <SeparatorLine />
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex justify-between gap-3">
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-between gap-10">
        <SeparatorLine width="1/2" />
        <SeparatorLine width="1/2" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
