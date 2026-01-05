"use client";
import { motion } from "framer-motion";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import LoadingState from "./ui/LoadingState";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";
import { IncomeSkeleton } from "./ui/skeletons/IncomeSkeleton";
export default function IncomeCard() {
  const { data, isLoading, isError } = useDashboard();
  const transactions = data?.transactions || [];

  const totalIncome = transactions
    ?.filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const hasIncome = totalIncome && totalIncome > 0;
  // TODO : find a better way to get the income, maybe user can manually add another amount or source

  // the ?? 0 is a fallback, if data isn't loaded, it will be 0

  const showEmptyState = !isLoading && !hasIncome;
  const showIncome = !isLoading && hasIncome;

  if (isLoading) {
    return <IncomeSkeleton />;
  }

  if (showEmptyState) {
    return <EmptyState message="No income data yet." />;
  }
  if (isError) {
    return <ErrorState message="Could not load income data." />;
  }

  return (
    <section
      className="bg-(--border-blue) rounded-xl h-1/2 w-full flex justify-between md:flex-col p-2"
      aria-describedby="income-heading"
    >
      <h2 id="income-heading" className="flex items-center gap-3 rounded-xl">
        Income <FaArrowLeftLong color="green" aria-hidden="true" />
      </h2>

      <div className="flex flex-col justify-center gap-2 bg-(--primary-bg) p-3 w-2/3 md:w-full rounded-xl ">
        <p
          aria-label={`This month's income is ${totalIncome?.toFixed(2)} euros`}
        >
          This month:
          <span className="text-green-500"> € {totalIncome?.toFixed(2)}</span>
        </p>
        <p className="text-sm">Last month: € 0</p>
        <motion.div
          aria-hidden="true"
          className="h-0.5 w-5 bg-green-800 self-end my-1"
          initial={{ width: "0" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        ></motion.div>
        <p className="text-sm">+ € {totalIncome} more compared to last month</p>
      </div>
    </section>
  );
}
