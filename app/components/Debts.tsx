"use client";
import { motion } from "framer-motion";
export default function Debts() {
  return (
    <section className="bg-(--border-blue) flex flex-col justify-evenly text-(--text-light) gap-3 h-1/2 w-full rounded-xl">
      <div className="flex justify-between px-2">
        <h2 className="flex items-center rounded-xl text-xl">Debts</h2>
        <p className="text-sm text-orange-400">Due Date</p>
      </div>

      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-1 w-full">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        <li className="items-center bg-(--border-blue) p-2 rounded-xl flex flex-col gap-2 relative">
          <div className="flex items-center justify-between w-full">
            <span>Company</span>
            <span>30/11</span>
          </div>
          <div className="relative w-full">
            <p className="flex justify-between px-2 border border-orange-700 py-1 rounded-2xl w-full text-sm z-10 relative">
              <span>800</span>
              <span>/</span>
              <span>1200</span>
            </p>

            <motion.span
              // z indes smaller than price <p> so that it sits below the text
              className="absolute left-0 top-0 h-full bg-orange-700 rounded-2xl z-0"
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{
                duration: 1.8,
              }}
            ></motion.span>
          </div>
        </li>
        <li className="items-center bg-(--border-blue) p-2 rounded-xl flex flex-col gap-2 relative">
          <div className="flex items-center justify-between w-full">
            <span>Company</span>
            <span>31/12</span>
          </div>
          <div className="relative w-full">
            <p className="flex justify-between px-2 border border-orange-700 py-1 rounded-2xl w-full text-sm z-10 relative">
              <span>600</span>
              <span>/</span>
              <span>2200</span>
            </p>

            <motion.span
              // z indes smaller than price <p> so that it sits below the text
              className="absolute left-0 top-0 h-full bg-orange-500 rounded-2xl z-0"
              initial={{ width: 0 }}
              animate={{ width: "28%" }}
              transition={{
                duration: 1.8,
              }}
            ></motion.span>
          </div>
        </li>
      </ul>
      <button className="underline p-2 w-fit self-center rounded-xl">
        More
      </button>
    </section>
  );
}
