"use client";
import { useDashboard } from "../hooks/useDashboard";
import { motion } from "framer-motion";
import { calcProgressPercent as calcAnimationWidth } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { FaPlus } from "react-icons/fa6";
export default function Goals() {
  const goals = useDashboard().data?.goals;
  const hasgoals = goals && goals.length > 0;
  const dispatch = useDispatch();
  return (
    <section
      className=" flex flex-col justify-evenly  gap-3 h-full w-full rounded-xl"
      aria-describedby="goals-heading"
    >
      <div className="flex justify-between p-2 items-center">
        <h2 id="goals-heading" className="flex items-center rounded-xl text-xl">
          Goals
        </h2>{" "}
        <button
          className="text-xl flex items-center"
          onClick={() => dispatch(openModal({ type: "addGoal", data: null }))}
        >
          <span className="text-yellow-500">
            <FaPlus />
          </span>
        </button>
      </div>
      {!hasgoals ? (
        <p className="text-gray-500 text-center text-sm p-3">Nothing here.</p>
      ) : (
        <>
          {/* total balance-current net worth across accounts */}
          <ul className="flex flex-col gap-2 h-109 overflow-y-auto ">
            {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
            {goals?.map((goal) => {
              const isFullySaved =
                Number(goal.currentAmount) >= Number(goal.targetAmount);
              return (
                <li
                  key={goal._id}
                  className="items-center bg-(--border-blue) p-2 rounded-xl flex flex-col gap-2 relative px-4"
                >
                  <div className="flex items-center justify-between w-full">
                    <span aria-label="Goal title">{goal.title}</span>
                    <span aria-label={`Goal date: ${goal.targetDate}`}>
                      {goal.targetDate}
                    </span>
                  </div>
                  <div className="relative w-full">
                    <p
                      className={`flex justify-between px-2 border ${
                        isFullySaved ? "border-teal-900" : "border-teal-700"
                      } py-1 rounded-2xl w-full text-sm z-10 relative`}
                    >
                      <span aria-label={`Goal ${goal.title} current amount`}>
                        {goal.currentAmount}
                      </span>
                      <span>/</span>
                      <span
                        aria-label={`Goal ${goal.title} target amount: ${goal.targetAmount}`}
                      >
                        {goal.targetAmount}
                      </span>
                    </p>

                    <motion.span
                      // z indes smaller than price <p> so that it sits below the text
                      className={`absolute left-0 top-0 h-full ${
                        isFullySaved ? "bg-teal-900" : "bg-teal-600"
                      } rounded-2xl z-0`}
                      initial={{ width: 0 }}
                      role="progressbar"
                      aria-valuenow={Number(goal.currentAmount)}
                      aria-valuemin={0}
                      aria-valuemax={Number(goal.targetAmount)}
                      aria-label={`Amount paid for ${goal.title}`}
                      animate={{
                        width: `${calcAnimationWidth(
                          Number(goal.currentAmount),
                          Number(goal.targetAmount)
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
            aria-label="More goals"
            onClick={() => dispatch(openModal({ type: "goals", data: null }))}
          >
            More
          </button>
        </>
      )}
    </section>
  );
}
