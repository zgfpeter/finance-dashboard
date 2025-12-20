import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import LoadingSpinner from "./LoadingSpinner";
export default function SpendingsCard() {
  const transactions = useDashboard().data?.transactions;
  const getSpendings = transactions
    ?.filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const hasSpendings = getSpendings && getSpendings > 0;

  return (
    <section className="bg-(--border-blue)  rounded-xl h-1/2 w-full flex justify-between p-3 md:flex-col md:px-2">
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        Expenses <FaArrowRightLong color="red" />
      </h2>
      {!hasSpendings ? (
        <p className="text-gray-500 text-center text-sm p-3">Nothing here.</p>
      ) : (
        <div className=" bg-(--primary-bg) rounded-xl flex flex-col justify-center gap-2 p-3 w-2/3 md:w-full">
          <p>
            This month:{" "}
            <span className="text-red-500">€ {getSpendings?.toFixed(2)}</span>
          </p>
          <p>Last month: € 7.20</p>
          <motion.span
            aria-hidden="true"
            className="h-0.5 w-5 bg-[#580f0f] my-1 "
            initial={{ width: "0" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          ></motion.span>
          <p>- € 7.29 less than last month</p>
        </div>
      )}
    </section>
  );
}
