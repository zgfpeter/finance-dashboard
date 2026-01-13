import { FaMoneyBillTransfer, FaPlus } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { prettifyDate } from "@/lib/utils";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";
import { TransactionsSkeleton } from "./ui/skeletons/TransactionsSkeleton";
import { useSession } from "next-auth/react";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";
export default function Transactions() {
  // get transaction data from the dashboard hook
  const { data, isLoading, isError } = useDashboard();
  const transactions = data?.transactions || [];
  const dispatch = useDispatch();
  const hasTransactions = transactions.length > 0; // if true, there are some transactions
  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;
  return (
    <section className="flex flex-col w-full h-full gap-3 rounded-md min-h-50">
      <div className="flex items-center justify-between ">
        <h2 className="flex items-center gap-2 p-2 text-lg rounded-md">
          <FaMoneyBillTransfer /> Transactions
        </h2>
        <button
          className="flex items-center text-xl"
          onClick={() =>
            dispatch(openModal({ type: "addTransaction", data: null }))
          }
        >
          <span className="text-yellow-500">
            <FaPlus />
          </span>
        </button>
      </div>

      {isLoading || !data ? (
        <TransactionsSkeleton />
      ) : isError ? (
        <ErrorState message="Could not load transactions." />
      ) : hasTransactions ? (
        <ul className="flex flex-col gap-2 overflow-y-auto h-96 ">
          {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
          {transactions?.map((transaction) => {
            return (
              <li
                key={transaction._id}
                className="bg-(--border-blue) rounded-md relative  grid grid-cols-[2fr_2fr_1fr] grid-rows-2 items-center text-sm py-2 "
              >
                <div className="row-start-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis ">
                  {transaction.company}
                </div>
                {transaction.category ? (
                  <div className="p-1 text-xs text-yellow-500 ">
                    {transaction.category}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 p-1 text-xs text-emerald-500">
                    +<FaMoneyBillTransfer />
                  </div>
                )}

                {/* coloc-coded amount base on transaction type */}

                <div className="row-start-2">
                  {transaction.transactionType === "expense" ? (
                    <p className="text-red-500">
                      - {currencySymbol} {transaction.amount}
                    </p>
                  ) : (
                    <p className="py-2 text-green-500">
                      + {currencySymbol} {transaction.amount}
                    </p>
                  )}
                </div>
                <div className="col-start-3 row-start-2">
                  <span className="text-xs">
                    {prettifyDate(transaction.date)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState message="No transactions. Add one to get started." />
      )}
      {/* scrollable list of all transactions*/}

      {/* shows full modal with all transactions, and options like edit and delete */}
      <button
        className="self-center p-2 mt-auto underline rounded-md w-fit"
        disabled={!hasTransactions}
        onClick={() =>
          dispatch(openModal({ type: "transactions", data: null }))
        }
        aria-label="See All"
      >
        {!hasTransactions ? "" : <span> See all</span>}
      </button>
    </section>
  );
}
