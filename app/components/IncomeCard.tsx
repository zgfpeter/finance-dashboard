"use client";
import { motion } from "framer-motion";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import LoadingSpinner from "./LoadingSpinner";
export default function IncomeCard() {
  const incomes = useDashboard().data?.income;
  const hasIncomes = incomes && incomes.length > 0;
  // TODO : find a better way to get the income, maybe user can manually add another amount or source
  const getIncome =
    incomes?.reduce((sum, income) => sum + income.amount, 0) ?? 0;

  // the ?? 0 is a fallback, if data isn't loaded, it will be 0

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
      {!hasIncomes ? (
        <p className="text-gray-500 text-center text-sm p-3">Nothing here.</p>
      ) : (
        <div className="flex flex-col text-end justify-center gap-2 bg-(--primary-bg) p-2 rounded-xl w-2/3 md:w-full">
          <p aria-label={`This month's income is ${getIncome} euros`}>
            This month:{" "}
            <span className="text-green-500"> € {getIncome.toFixed(2)}</span>
          </p>
          <p>Last month: € 3500.49</p>
          <motion.span
            aria-hidden="true"
            className="h-0.5 w-5 bg-[#025207] self-end my-1"
            initial={{ width: "0" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          ></motion.span>
          <p>+ €25 more compared to last month.</p>
        </div>
      )}
    </section>
  );
}
