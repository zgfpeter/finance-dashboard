import { FaMoneyBillTransfer, FaPlus } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { prettifyDate } from "@/lib/utils";
export default function Transactions() {
  // get transaction data from the dashboard hook
  const TransactionsData = useDashboard().data?.transactions;
  const dispatch = useDispatch();
  const hasTransactions = TransactionsData && TransactionsData.length > 0; // if true, there are some transactions
  return (
    <section className="flex flex-col  rounded-xl gap-3 w-full h-full min-h-50">
      <div className="flex items-center justify-between ">
        <h2 className="flex items-center gap-2 p-2 rounded-xl text-xl">
          <FaMoneyBillTransfer /> Transactions
        </h2>
        <button
          className="text-xl flex items-center"
          onClick={() =>
            dispatch(openModal({ type: "addTransaction", data: null }))
          }
        >
          <span className="text-yellow-500">
            <FaPlus />
          </span>
        </button>
      </div>
      {!hasTransactions ? (
        <p className="text-gray-500 text-sm h-full flex items-center justify-center">
          No transactions yet. Add one to get started.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-2 h-96 overflow-y-auto ">
            {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
            {TransactionsData?.map((transaction) => {
              return (
                <li
                  key={transaction._id}
                  className="bg-(--border-blue) rounded-xl relative  grid grid-cols-[2fr_2fr_1fr] grid-rows-2 items-center text-sm py-2 "
                >
                  <div className="p-1 overflow-hidden whitespace-nowrap text-ellipsis row-start-2 ">
                    {transaction.company}
                  </div>
                  {transaction.category ? (
                    <div className="text-xs md:text-sm text-yellow-500 p-1 ">
                      {transaction.category}
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm text-emerald-500 p-1 flex gap-1 items-center">
                      +<FaMoneyBillTransfer />
                    </div>
                  )}

                  {/* coloc-coded amount base on transaction type */}

                  <div className="row-start-2">
                    {transaction.transactionType === "expense" ? (
                      <p className="text-red-500">- € {transaction.amount}</p>
                    ) : (
                      <p className="text-green-500 py-2">
                        + € {transaction.amount}
                      </p>
                    )}
                  </div>
                  <div className="row-start-2 col-start-3">
                    <span className="text-xs">
                      {prettifyDate(transaction.date)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* scrollable list of all transactions*/}

          {/* shows full modal with all transactions, and options like edit and delete */}
          <button
            className="underline p-2 w-fit self-center rounded-xl  mt-auto"
            onClick={() =>
              dispatch(openModal({ type: "transactions", data: null }))
            }
            aria-label="See All"
          >
            See All
          </button>
        </>
      )}
    </section>
  );
}
