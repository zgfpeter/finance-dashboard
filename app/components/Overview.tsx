import { useDashboard } from "../hooks/useDashboard";
import { IoMdArrowDropup } from "react-icons/io";

export default function Overview() {
  const dashboardData = useDashboard().data?.overview;
  //console.log(dashboardData);
  return (
    <section className="flex flex-col p-3 text-(--text-light) rounded-xl h-full w-full justify-evenly ">
      <h1 className="text-4xl">Overview</h1>
      {/* total balance-current net worth across accounts */}
      <p className="text-2xl">{`Total balance: $ ${dashboardData?.totalBalance}`}</p>
      <div className="text-md">
        <p>Savings Account: $ 3712</p>
        <p>Checkings Account: $ 3920 </p>
      </div>
      <p className="text-emerald-600 flex items-center">
        <IoMdArrowDropup />
        {`$ ${dashboardData?.monthlyChange} more compared to last month.`}
      </p>
      <p>Total transactions this month: 32</p>
    </section>
  );
}
