"use client";
import { motion } from "framer-motion";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import LoadingSpinner from "./LoadingSpinner";
export default function IncomeCard() {
  const incomes = useDashboard().data?.income;

  // TODO : find a better way to get the income, maybe user can manually add another amount or source
  const getIncome =
    incomes?.reduce((sum, income) => sum + income.amount, 0) ?? 0;

  // the ?? 0 is a fallback, if data isn't loaded, it will be 0
  if (!incomes)
    return (
      <section
        aria-busy="true"
        className="bg-(--border-blue) rounded-xl h-1/2 w-full  p-3 md:flex-col md:px-2"
        aria-describedby="income-heading"
      >
        <h2 id="income-heading" className="rounded-xl text-xl">
          Loading income...
        </h2>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </section>
    );

  if (incomes.length === 0)
    return (
      <section
        aria-busy="true"
        className="bg-(--border-blue) rounded-xl h-1/2 w-full  p-3 md:flex-col md:px-2"
        aria-describedby="income-heading"
      >
        <h2 id="income-heading" className="rounded-xl text-xl">
          No income recorded yet.
        </h2>
      </section>
    );

  return (
    <section
      className="bg-(--border-blue)  rounded-xl h-1/2 w-full flex justify-between p-3 md:flex-col md:px-2"
      aria-describedby="income-heading"
    >
      <h2
        id="income-heading"
        className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2"
      >
        Income <FaArrowLeftLong color="green" aria-hidden="true" />
      </h2>
      <div className="flex flex-col text-end justify-center gap-2 bg-(--primary-bg) p-2 rounded-xl w-2/3 md:w-full">
        <p aria-label={`This month's income is ${getIncome} euros`}>
          This month: € {getIncome.toFixed(2)}
        </p>
        <p>Last month: €3500.49</p>
        <motion.span
          aria-hidden="true"
          className="h-0.5 w-5 bg-[#025207] self-end my-1"
          initial={{ width: "0" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        ></motion.span>
        <p>+ €25 more compared to last month.</p>
      </div>
    </section>
  );
}
