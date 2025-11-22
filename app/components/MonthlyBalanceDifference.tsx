import { IoMdArrowDropup } from "react-icons/io";
export default function MonthlyBalanceDifference() {
  return (
    <section className="bg-(--hover-blue) flex flex-col p-3 text-(--text-light) rounded-xl w-full">
      <p className="text-emerald-600 flex items-center">
        <IoMdArrowDropup size={30} /> €325 more compared to last month
      </p>
    </section>
  );
}
