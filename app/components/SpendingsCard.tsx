import { FaArrowTrendDown } from "react-icons/fa6";

export default function SpendingsCard() {
  return (
    <section className="bg-(--primary-blue) text-(--text-light) rounded-xl h-1/2 w-full flex justify-around py-3 md:flex-col md:px-2">
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        <FaArrowTrendDown color="red" /> Spendings
      </h2>
      <div className="flex flex-col text-start justify-center gap-1">
        <p>This month: €234</p>
        <p>Last month: €472</p>
        <p className="border-t border-[#580f0f]  my-1 py-1">
          - €238 less than last month
        </p>
      </div>
    </section>
  );
}
