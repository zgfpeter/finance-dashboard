import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { IoMdTrendingUp } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useMemo } from "react";
export default function Overview() {
  const dispatch = useDispatch();
  const dashboardData = useDashboard().data?.overview;
  const nrOfTransactions = useDashboard().data?.transactions;
  // because of || [], this would create a brand new array on every render, so the dependency accounts changed again, so useMemo is pointless.
  const dashboard = useDashboard().data;
  const accounts = useMemo(() => {
    return dashboard?.accounts ?? [];
  }, [dashboard?.accounts]);

  // #!! used when i want a clean yes/no answer. not anything else, ex. 0, "", 3 etc. items.length can be 0 or 5 for example, not true or false
  // #!! means turn value into a true or false, && ensures dashboardData exists, || checks if any meaningful data exists.
  const totalBalance = useMemo(() => {
    // with useMemo, totalBalance is only recalculated if the accounts change
    return accounts.reduce((sum, account) => {
      return sum + account.balance;
    }, 0);
  }, [accounts]);

  // check if there is any useful data to display
  const hasData =
    !!dashboardData &&
    (dashboardData.monthlyChange > 0 ||
      dashboardData.totalBalance > 0 ||
      (nrOfTransactions && nrOfTransactions.length > 0));

  return (
    <section className="flex flex-col gap-3 h-full overflow-y-auto justify-evenly">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Overview</h1>
        <button
          className="text-xl flex items-center p-1"
          onClick={() =>
            dispatch(
              openModal({
                type: "editOverview",
                data: { totalBalance: totalBalance, accounts },
              })
            )
          }
        >
          <span className="text-yellow-500">
            <MdEdit />
          </span>
        </button>
      </div>
      {!hasData ? (
        <p className="text-gray-500 text-center text-sm p-3">Nothing here.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* total balance-current net worth across accounts */}
          <p className="text-xl text-(--limegreen) bg-(--primary-blue) flex justify-between ">
            <span>Total balance: </span> €{totalBalance}
          </p>
          <span className="w-full h-1 rounded-xl bg-cyan-900 "></span>
          <h2>Accounts summary</h2>
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
          <div className="flex items-center gap-3 py-2 ">
            <span className="w-full h-1 rounded-xl bg-cyan-900 "></span>
            <span className="text-emerald-600 ">
              <IoMdTrendingUp />
            </span>
            <span className="w-full h-1 rounded-xl bg-cyan-900 "></span>
          </div>
          <p className="text-emerald-600 flex items-center bg-(--border-blue) rounded-xl px-2 py-3 justify-center">
            {`$ ${dashboardData?.monthlyChange} more compared to last month.`}
          </p>
        </div>
      )}
    </section>
  );
}
