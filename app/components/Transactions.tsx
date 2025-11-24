import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useDashboard } from "../hooks/useDashboard";
export default function Transactions() {
  const TransactionsData = useDashboard().data?.transactions;

  return (
    <section className="bg-(--hover-blue) flex flex-col text-(--text-light) rounded-xl gap-3 w-full">
      <h2 className="flex items-center gap-2 p-2 rounded-xl text-xl mb-2">
        <FaMoneyBillTransfer /> Transactions
      </h2>
      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-2 ">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        {TransactionsData?.map((transaction) => {
          return (
            <li
              key={transaction.id}
              className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span>{transaction.company}</span>
                  <span>{transaction.date}</span>
                </div>
              </div>
              {/* <TbPointFilled color="red" /> */}
              {transaction.type === "expense" ? (
                <p className="text-red-500">- € {transaction.amount}</p>
              ) : (
                <p className="text-green-500">+ € {transaction.amount}</p>
              )}
            </li>
          );
        })}
      </ul>
      <button className="underline p-2 w-fit self-center rounded-xl">
        See All
      </button>
    </section>
  );
}
