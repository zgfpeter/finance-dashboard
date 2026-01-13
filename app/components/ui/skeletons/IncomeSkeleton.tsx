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
      <div className="flex w-full gap-1 ">
        <div className="flex items-center w-1/3 h-full ">
          <h2
            id="income-heading"
            className="flex items-center gap-3 text-xl rounded-md"
          >
            Income <FaArrowLeftLong color="green" aria-hidden="true" />
          </h2>
        </div>
        <div className="flex flex-col items-end w-full h-full gap-3">
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="flex justify-end w-full">
              <Skeleton className="w-3/4 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
