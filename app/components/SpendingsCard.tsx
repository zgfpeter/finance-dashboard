import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import LoadingState from "./ui/LoadingState";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";
import { SpendingsSkeleton } from "./ui/skeletons/SpendingsSkeleton";
import { useSession } from "next-auth/react";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";
import { getThisAndLastMonthTotals } from "@/lib/utils";
export default function SpendingsCard() {
  const { data, isLoading, isError } = useDashboard();
  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;
  const transactions = data?.transactions || [];
  const getSpendings = transactions
    ?.filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const hasSpendings = getSpendings && getSpendings > 0;
  const showEmptyState = !isLoading && !hasSpendings;

  // loading state
  if (isLoading) {
    return <SpendingsSkeleton />;
  }
  // empty state
  if (showEmptyState) {
    return <EmptyState message="No spendings data yet." />;
  }

  // error state
  if (isError) {
    return <ErrorState message="Could not load spendings." />;
  }

  const { thisMonthTotal, lastMonthTotal, difference } =
    getThisAndLastMonthTotals(transactions, "expense");

  const differenceSign = difference >= 0 ? "+" : "-";
  const differenceAbs = Math.abs(difference);

  return (
    <section className="bg-(--border-blue) rounded-md h-1/2 w-full flex justify-between md:flex-col p-2">
      <h2 id="spendings-heading" className="flex items-center gap-3 rounded-md">
        Expenses <FaArrowRightLong color="red" />
      </h2>

      <div className=" bg-(--primary-bg) rounded-md flex flex-col justify-center gap-2 p-3 w-2/3  h-full md:w-full">
        <p>
          This month:
          <span className="text-red-500">
            {" "}
            {/* {currencySymbol} {getSpendings?.toFixed(2) ?? 0} */}
            {currencySymbol} {thisMonthTotal.toFixed(2)}
          </span>
        </p>
        <p className="text-sm">
          Last month: {currencySymbol} {lastMonthTotal.toFixed(2)}
        </p>
        {/* <p className="text-sm">Last month: {currencySymbol} 0.00</p> */}
        <motion.div
          className="h-0.5 bg-[#935353] my-1"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        />

        {/* <p className="text-sm">
          - {currencySymbol} {getSpendings?.toFixed(2) ?? 0} less than last
          month
        </p> */}
        <p className="text-sm">
          {differenceSign} {currencySymbol} {differenceAbs.toFixed(2)} compared
          to last month
        </p>
      </div>
    </section>
  );
}
