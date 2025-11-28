import { motion } from "framer-motion";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
export default function IncomeCard() {
  const incomes = useDashboard().data?.income;
  // simple function to calculate income based on transactions
  // transaction can either be expense or income, so i only want the income for this
  // const income = () => {
  //   return transactions
  //     ?.filter((t) => t.type === "income")
  //     .reduce((sum, t) => sum + t.amount, 0)
  //     .toFixed(2);
  // };
  // TODO : find a better way to get the income, maybe user can manually add another amount or source
  const getIncome =
    incomes?.reduce((sum, income) => sum + income.amount, 0) ?? 0;

  // the ?? 0 is a fallback, if data isn't loaded, it will be 0

  return (
    <section className="bg-(--primary-blue) text-(--text-light) rounded-xl h-1/2 w-full flex justify-around py-3 md:flex-col md:px-2">
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        Income <FaArrowTrendUp color="green" />
      </h2>
      <div className="flex flex-col text-end justify-center gap-1">
        <p>This month: € {getIncome.toFixed(2)}</p>
        <p>Last month: €3500.49</p>
        <motion.span
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
