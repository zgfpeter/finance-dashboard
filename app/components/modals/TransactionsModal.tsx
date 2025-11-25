"use client";

interface Props {
  onClose: () => void;
}

import { useDashboard } from "@/app/hooks/useDashboard";
import { useState } from "react";
export default function TransactionsModal({ onClose }: Props) {
  const TransactionsData = useDashboard().data?.transactions;
  const [displayedTransactions, setDisplayedTransactions] = useState(
    TransactionsData || []
  );
  // displayed transaction is an array of transactions

  function handleSearch(searchTerm: string) {
    if (!TransactionsData) {
      // TransactionData is empty
      return;
    }
    // const searchTerm = "Spotify";

    const result = TransactionsData?.filter((transaction) => {
      return transaction.company.toLowerCase().includes(searchTerm);
      // convert to lowercase to avoid case-sensitivity issues and check if it includes the search term
    });
    setDisplayedTransactions(result); // set the displayed transactions to be the filtered result
    //console.log(result);
    // return result;
  }

  return (
    <div className=" text-(--text-light) rounded">
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
        aria-label="Close"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-xl"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul className="flex flex-col gap-2 h-70 overflow-y-auto ">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        {displayedTransactions?.map((transaction) => {
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
    </div>
  );
}
