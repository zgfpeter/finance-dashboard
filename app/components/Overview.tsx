import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import {
  IoMdArrowDropup,
  IoMdTrendingDown,
  IoIosTrendingDown,
  IoMdTrendingUp,
} from "react-icons/io";
import { MdEdit } from "react-icons/md";
export default function Overview() {
  const dispatch = useDispatch();
  const dashboardData = useDashboard().data?.overview;
  const nrOfTransactions = useDashboard().data?.transactions;
  const accounts = useDashboard().data?.accounts || [];

  const hasData =
    dashboardData &&
    dashboardData.monthlyChange > 0 &&
    dashboardData.totalBalance > 0 &&
    nrOfTransactions &&
    nrOfTransactions.length > 0;

  return (
    <section className="flex flex-col gap-2 h-full overflow-y-auto justify-evenly py-2">
      <div className="flex items-center justify-between ">
        <h1 className="text-4xl">Overview</h1>
        <div className="flex gap-5">
          <button
            className="text-xl flex items-center"
            onClick={() =>
              dispatch(
                openModal({
                  type: "editOverview",
                  data: { totalBalance: dashboardData?.totalBalance, accounts },
                })
              )
            }
          >
            <span className="text-yellow-500">
              <MdEdit />
            </span>
          </button>
        </div>
      </div>
      {!hasData ? (
        <p className="text-gray-500 text-center text-sm p-3">Nothing here.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {/* total balance-current net worth across accounts */}
          <p className="text-2xl text-(--limegreen) bg-(--primary-blue) rounded-xl p-2 flex justify-between ">
            <span>Total balance: </span>{" "}
            {`$ ${Number(dashboardData?.totalBalance).toFixed(2)}`}
          </p>
          <h2 className="pl-2">Accounts summary</h2>
          <ul className="flex flex-col gap-2 ">
            {accounts.map((account) => (
              <li
                key={account._id}
                className="items-center bg-(--border-blue) px-2 py-3 rounded-xl"
              >
                <p className="grid grid-cols-2">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}{" "}
                  :<span>€ {account.balance} </span>{" "}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex items-center my-2 gap-3 ">
            <span className="w-full h-1 rounded-xl bg-cyan-900 "></span>
            <span className="text-emerald-600 ">
              <IoMdTrendingUp />
            </span>
            <span className="w-full h-1 rounded-xl bg-cyan-900 "></span>
          </div>
          <p className="text-emerald-600 flex items-center bg-(--border-blue) rounded-xl px-2 py-3 justify-center">
            {`$ ${dashboardData?.monthlyChange} more compared to last month.`}
          </p>
          {/* <p className="bg-(--border-blue) rounded-xl p-2">
            Total transactions this month:
            <span className="text-emerald-500 mx-2">
              {nrOfTransactions?.length}
            </span>
          </p> */}
        </div>
      )}
    </section>
  );
}
