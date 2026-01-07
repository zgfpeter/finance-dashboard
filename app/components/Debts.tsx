"use client";
import { motion } from "framer-motion";
import { useDashboard } from "../hooks/useDashboard";
import {
  calcProgressPercent as calcAnimationWidth,
  prettifyDate,
} from "@/lib/utils";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { FaPlus, FaLink } from "react-icons/fa6";
import LoadingState from "./ui/LoadingState";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";
import { DebtsSkeleton } from "./ui/skeletons/DebtsSkeleton";
export default function Debts() {
  const dispatch = useDispatch();
  // debts data
  const { data, isLoading, isError } = useDashboard();
  const debts = data?.debts || [];
  const hasDebts = debts && debts.length > 0;

  const showEmptyState = !isLoading && !hasDebts;
  const showDebts = !isLoading && hasDebts;

  return (
    <section
      className=" flex flex-col rounded-xl gap-3 w-full h-full min-h-50 "
      aria-labelledby="debts-heading"
    >
      <div className="flex items-center justify-between ">
        <h2 className="flex items-center gap-2 p-2 rounded-xl text-lg">
          <FaLink /> Debts
        </h2>
        <button
          className="text-xl flex items-center"
          onClick={() => dispatch(openModal({ type: "addDebt", data: null }))}
        >
          <span className="text-yellow-500">
            <FaPlus />
          </span>
        </button>
      </div>

      {/* total balance-current net worth across accounts */}

      <>
        {isLoading || !data ? (
          <DebtsSkeleton />
        ) : isError ? (
          <ErrorState message="Could not load debts." />
        ) : hasDebts ? (
          <ul className="flex flex-col gap-2 h-109 overflow-y-auto ">
            {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
            {debts?.map((debt) => {
              const isFullyPaid =
                Number(debt.currentPaid) >= Number(debt.totalAmount);

              return (
                <li
                  key={debt._id}
                  className="items-center bg-(--border-blue) p-2 px-4 rounded-xl flex flex-col gap-2 relative z-20"
                >
                  <div className="flex items-center justify-between w-full">
                    <span aria-label={`Debt company: `}>{debt.company}</span>
                    <span aria-label={`Debt due date: `} className="text-xs">
                      {prettifyDate(debt.dueDate)}
                    </span>
                  </div>
                  <div className="relative w-full">
                    <p
                      className={`flex justify-between px-2 border  py-1 ${
                        isFullyPaid ? "border-orange-900" : "border-orange-700"
                      } rounded-2xl w-full text-sm z-10 relative`}
                    >
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
                      className={`absolute left-0 top-0 h-full rounded-2xl z-0 ${
                        isFullyPaid ? "bg-orange-900" : "bg-orange-700"
                      }`}
                      role="progressbar"
                      aria-valuenow={Number(debt.currentPaid)}
                      aria-valuemin={0}
                      aria-valuemax={Number(debt.totalAmount)}
                      aria-label={`Amount paid for ${debt.company}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${calcAnimationWidth(
                          Number(debt.currentPaid),
                          Number(debt.totalAmount)
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
        ) : (
          <EmptyState message="No debts. Add one to get started." />
        )}
        <button
          className="underline p-2 w-fit self-center rounded-xl"
          aria-label="Open debts modal"
          disabled={!hasDebts}
          onClick={() => dispatch(openModal({ type: "debts", data: null }))}
        >
          {!hasDebts ? "" : <span> See all</span>}
        </button>
      </>
    </section>
  );
}
