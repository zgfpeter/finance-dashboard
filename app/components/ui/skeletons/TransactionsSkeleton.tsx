import { FaMoneyBillTransfer } from "react-icons/fa6";
import Skeleton from "./Skeleton";

export function TransactionsSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div
      className="
        w-full rounded-xl border-2 border-(--border-blue)
        bg-(--primary-bg) p-3 flex flex-col gap-3
      "
    >
      <h2 className="flex items-center gap-2 p-2 rounded-xl text-xl">
        <FaMoneyBillTransfer /> Transactions
      </h2>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex justify-between gap-3">
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
