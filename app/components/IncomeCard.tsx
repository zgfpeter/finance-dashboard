import { FaArrowTrendUp } from "react-icons/fa6";

export default function IncomeCard() {
  return (
    <section className="bg-(--primary-blue) text-(--text-light) rounded-xl h-1/2 w-full flex justify-around py-3 md:flex-col md:px-2">
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        Income <FaArrowTrendUp color="green" />
      </h2>
      <div className="flex flex-col text-end justify-center gap-1">
        <p>This month: €375</p>
        <p>Last month: €350</p>
        <p className="border-t border-[#036f0b] my-1 py-1">
          + €25 more compared to last month.
        </p>
      </div>
    </section>
  );
}
