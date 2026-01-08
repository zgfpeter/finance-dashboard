import { FaArrowLeftLong } from "react-icons/fa6";
import Skeleton from "./Skeleton";

export function IncomeSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div
      className="
        w-full rounded-md border-2 border-(--border-blue)
        bg-(--primary-bg) p-3 flex flex-col gap-3
      "
    >
      <div className="flex gap-1 w-full ">
        <div className="h-full w-1/3 flex items-center ">
          <h2
            id="income-heading"
            className="flex items-center gap-3 rounded-md text-xl"
          >
            Income <FaArrowLeftLong color="green" aria-hidden="true" />
          </h2>
        </div>
        <div className="flex flex-col gap-3 w-full h-full items-end">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="w-full flex justify-end">
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
