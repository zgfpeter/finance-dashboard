import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import LoadingState from "./ui/LoadingState";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";

export default function SpendingsCard() {
  const { data, isLoading, isError } = useDashboard();
  const transactions = data?.transactions || [];
  const getSpendings = transactions
    ?.filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const hasSpendings = getSpendings && getSpendings > 0;
  const showEmptyState = !isLoading && !hasSpendings;

  // loading state
  if (isLoading) {
    return <LoadingState message="Loading overview..." />;
  }
  // empty state
  if (showEmptyState) {
    return <EmptyState message="No spendings yet." />;
  }

  // error state
  if (isError) {
    return <ErrorState message="Could not load spendings." />;
  }

  return (
    <section className="bg-(--border-blue) rounded-xl h-1/2 w-full flex justify-between md:flex-col p-2">
      <h2 className="flex items-center gap-3 rounded-xl text-xl">
        Expenses <FaArrowRightLong color="red" />
      </h2>

      <div className=" bg-(--primary-bg) rounded-xl flex flex-col justify-center gap-2 p-3 w-2/3 md:w-full">
        <p>
          This month:{" "}
          <span className="text-red-500">€ {getSpendings?.toFixed(2)}</span>
        </p>
        <p className="text-sm">Last month: € 0.00</p>
        <motion.span
          aria-hidden="true"
          className="h-0.5 w-5 bg-[#580f0f] my-1 "
          initial={{ width: "0" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        ></motion.span>
        <p className="text-sm">
          - € {getSpendings?.toFixed(2)} less than last month
        </p>
      </div>
    </section>
  );
}
