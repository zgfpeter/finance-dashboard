"use client";
import { motion } from "framer-motion";
import { useDashboard } from "../hooks/useDashboard";
import { calcAnimationWidth } from "@/lib/utils";
export default function Debts() {
  const debts = useDashboard().data?.debts;
  // console.log(debts);

  return (
    <section className="bg-(--border-blue) flex flex-col justify-evenly text-(--text-light) gap-3 h-1/2 w-full rounded-xl z-30">
      <div className="flex justify-between p-2 items-center">
        <h2 className="flex items-center rounded-xl text-xl">Debts</h2>
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
                <span>{debt.company}</span>
                <span>{debt.dueDate}</span>
              </div>
              <div className="relative w-full">
                <p className="flex justify-between px-2 border border-orange-700 py-1 rounded-2xl w-full text-sm z-10 relative">
                  <span>{debt.currentPaid}</span>
                  <span>/</span>
                  <span>{debt.totalAmount}</span>
                </p>

                <motion.span
                  // z indes smaller than price <p> so that it sits below the text
                  className="absolute left-0 top-0 h-full bg-orange-700 rounded-2xl z-0"
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
        aria-label="More Debts"
      >
        More
      </button>
    </section>
  );
}
