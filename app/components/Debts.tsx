"use client";
import { motion } from "framer-motion";
import { useDashboard } from "../hooks/useDashboard";
import { calcAnimationWidth } from "@/lib/utils";
export default function Debts() {
  // debts data
  const debts = useDashboard().data?.debts;

  return (
    <section
      className="flex flex-col justify-evenly  gap-3 h-1/2 w-full rounded-xl z-30"
      aria-labelledby="debts-heading"
    >
      <div className="flex justify-between p-2 items-center">
        <h2 id="debts-heading" className="flex items-center rounded-xl text-xl">
          Debts
        </h2>
        <p className="text-sm text-orange-400">Due Date</p>
      </div>

      {/* total balance-current net worth across accounts */}

      <ul className="flex flex-col gap-1 w-full">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        {debts?.map((debt) => {
          return (
            <li
              key={debt._id}
              className="items-center bg-(--border-blue) p-2 rounded-xl flex flex-col gap-2 relative z-20"
            >
              <div className="flex items-center justify-between w-full">
                <span aria-label={`Debt company: `}>{debt.company}</span>
                <span aria-label={`Debt due date: `}>{debt.dueDate}</span>
              </div>
              <div className="relative w-full">
                <p className="flex justify-between px-2 border border-orange-700 py-1 rounded-2xl w-full text-sm z-10 relative">
                  <span aria-label={`Amount paid for ${debt.company}  `}>
                    {debt.currentPaid}
                  </span>
                  <span>/</span>
                  <span aria-label={`Total amount for ${debt.company}  `}>
                    {debt.totalAmount}
                  </span>
                </p>

                <motion.span
                  aria-hidden="true"
                  // z indes smaller than price <p> so that it sits below the text
                  className="absolute left-0 top-0 h-full bg-orange-700 rounded-2xl z-0"
                  role="progressbar"
                  aria-valuenow={debt.currentPaid}
                  aria-valuemin={0}
                  aria-valuemax={debt.totalAmount}
                  aria-label={`Amount paid for ${debt.company}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${calcAnimationWidth(
                      debt.currentPaid,
                      debt.totalAmount
                    )}%`,
                  }}
                  transition={{
                    duration: 1.8,
                  }}
                ></motion.span>
              </div>
            </li>
          );
        })}
      </ul>
      <button
        className="underline p-2 w-fit self-center rounded-xl"
        aria-label="Open debts modal"
      >
        More
      </button>
    </section>
  );
}
