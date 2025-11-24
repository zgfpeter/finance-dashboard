import { useDashboard } from "../hooks/useDashboard";
import { IoMdArrowDropup } from "react-icons/io";

export default function Overview() {
  const dashboardData = useDashboard().data?.overview;
  //console.log(dashboardData);
  return (
    <section className="flex flex-col justify-center gap-2 h-full overflow-y-auto  text-(--text-light) ">
      <h1 className="text-4xl">Overview</h1>
      {/* total balance-current net worth across accounts */}
      <p className="text-2xl text-(--limegreen) bg-(--primary-blue) rounded-xl p-2 flex justify-between ">
        <span>Total balance: </span>{" "}
        {`$ ${Number(dashboardData?.totalBalance).toFixed(2)}`}
      </p>
      {/* toFixed(2) keep only 2 decimals  */}
      <div className="text-md bg-(--border-blue) rounded-xl p-2 ">
        <p className="flex justify-between">
          Savings Account: <span>$ 3712</span>
        </p>
        <p className="flex justify-between">
          Checkings Account: <span> $ 3920</span>{" "}
        </p>
      </div>
      <p className="text-emerald-600 flex items-center bg-(--border-blue) rounded-xl p-2">
        <IoMdArrowDropup />
        {`$ ${dashboardData?.monthlyChange} more compared to last month.`}
      </p>
      <p className="bg-(--border-blue) rounded-xl p-2">
        Total transactions this month:{" "}
        <span className="text-emerald-600">32</span>
      </p>
    </section>
  );
}
