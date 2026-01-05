import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { IoMdTrendingUp } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useMemo } from "react";
import SeparatorLine from "./ui/SeparatorLine";
import LoadingState from "./ui/LoadingState";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";
import { OverviewSkeleton } from "./ui/skeletons/OverviewSkeleton";
import { useSession } from "next-auth/react";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";
export default function Overview() {
  const dispatch = useDispatch();

  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;

  // {user?.currency &&
  // currencies[user.currency as CurrencyCode]?.symbol}

  const { data, isLoading, isError } = useDashboard();
  const transactions = data?.transactions || [];
  const monthlyChange = data?.overview.monthlyChange;
  // because of || [], this would create a brand new array on every render, so the dependency accounts changed again, so useMemo is pointless.

  const accounts = useMemo(() => {
    return data?.accounts ?? [];
  }, [data?.accounts]);

  // check if there is any useful data to display
  const hasData =
    !!data &&
    (accounts.length > 0 ||
      transactions.length > 0 ||
      typeof monthlyChange === "number");

  const showEmptyState = !isLoading && !hasData;
  const showOverview = !isLoading && hasData;

  // #!! used when i want a clean yes/no answer. not anything else, ex. 0, "", 3 etc. items.length can be 0 or 5 for example, not true or false
  // #!! means turn value into a true or false, && ensures dashboardData exists, || checks if any meaningful data exists.
  const totalBalance = useMemo(() => {
    // with useMemo, totalBalance is only recalculated if the accounts change
    return accounts.reduce((sum, account) => {
      return sum + account.balance;
    }, 0);
  }, [accounts]);

  // loading state
  if (isLoading || !data) {
    return <OverviewSkeleton />;
  }

  // error state
  if (isError) {
    return <ErrorState message="Could not load overview." />;
  }

  // empty state
  if (!hasData) {
    return <EmptyState message="No overview data." />;
  }

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

      {showOverview && (
        <div className="flex flex-col gap-3">
          {/* total balance-current net worth across accounts */}
          <p className="text-xl text-(--limegreen) bg-(--primary-blue) flex justify-between ">
            <span>Total balance: </span> {currencySymbol} {totalBalance}
          </p>
          <SeparatorLine />
          <h2>Accounts summary</h2>
          <ul className="flex flex-col gap-2 ">
            {accounts.map((account) => (
              <li
                key={account._id}
                className="items-center bg-(--border-blue) px-2 py-3 rounded-xl"
              >
                <p className="grid grid-cols-2">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}{" "}
                  :
                  <span>
                    {currencySymbol} {account.balance}{" "}
                  </span>{" "}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 py-2 ">
            <SeparatorLine width="1/2" />
            <span className="text-emerald-600 ">
              <IoMdTrendingUp />
            </span>
            <SeparatorLine width="1/2" />
          </div>
          <p className="text-emerald-600 flex items-center bg-(--border-blue) rounded-xl px-2 py-3 justify-center">
            {`${currencySymbol} ${monthlyChange} more compared to last month.`}
          </p>
        </div>
      )}
    </section>
  );
}
