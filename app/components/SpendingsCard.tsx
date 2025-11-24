import { motion } from "framer-motion";
import { FaArrowTrendDown } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
export default function SpendingsCard() {
  const transactions = useDashboard().data?.transactions;
  const spendings = () => {
    return transactions
      ?.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2);
    // toPrecision(4) would give me 12.34 for example, and 1.234
    // toFixed just gives me 2 decimals.
    // they return a string, so i need Number(spendings()) to turn it into a number
  };
  return (
    <section className="bg-(--primary-blue) text-(--text-light) rounded-xl h-1/2 w-full flex justify-around py-3 md:flex-col md:px-2">
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        <FaArrowTrendDown color="red" /> Spendings
      </h2>
      <div className="flex flex-col text-start justify-center gap-1">
        <p>This month: € {Number(spendings())}</p>
        <p>Last month: € 7.20</p>
        <motion.span
          className="h-0.5 w-5 bg-[#580f0f] my-1 "
          initial={{ width: "0" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        ></motion.span>
        <p>- € 7.29 less than last month</p>
      </div>
    </section>
  );
}
