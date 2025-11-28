"use client";

interface Props {
  onClose: () => void;
}
import { MdEdit, MdDelete } from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState } from "react";
import axios from "axios";
export default function TransactionsModal({ onClose }: Props) {
  const TransactionsData = useDashboard().data?.transactions;

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
    setFilteredData(result);
  }

  // delete // track which item is to be deleted and show the delete confirmation modal
  const [deleteId, setDeleteId] = useState<string | null | undefined>(null);
  // for the filtered result ( ex. a transaction is deleted )
  const [filteredData, setFilteredData] = useState(TransactionsData || []);

  function handleDelete(id: string | null | undefined) {
    console.log("Deleting");
    if (!TransactionsData) return;

    // optimistic update to make UI feel faster
    setFilteredData((prev) =>
      prev.filter((transaction) => transaction._id !== id)
    );
    setDeleteId(null);

    axios
      .delete(`http://localhost:4000/api/dashboard/transactions/${id}`)
      .then((res) => {
        setFilteredData(res.data.transactions);
        setDeleteId(null); // to close the overlay
      })
      .catch((err) => {
        console.error("Failed to delete: ", err);
        setDeleteId(null);
        // if delete fails, don't change data
        setFilteredData(TransactionsData || []);
      });
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
        {filteredData?.map((transaction) => {
          return (
            // <li
            //   key={transaction.id}
            //   className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl"
            // >
            //   <div className="flex items-center gap-2">
            //     <div className="flex flex-col">
            //       <span>{transaction.company}</span>
            //       <span>{transaction.date}</span>
            //     </div>
            //   </div>
            //   {/* <TbPointFilled color="red" /> */}
            //   {transaction.transactionType === "expense" ? (
            //     <p className="text-red-500">- € {transaction.amount}</p>
            //   ) : (
            //     <p className="text-green-500">+ € {transaction.amount}</p>
            //   )}
            // </li>
            <li
              key={transaction._id}
              className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl relative"
            >
              <div className="flex items-center gap-2">
                {/* <FaPlus color="green" /> */}

                <div className="flex flex-col">
                  <span>{transaction.company}</span>
                  <span>{transaction.date}</span>
                </div>
              </div>

              <div className="flex justify-between">
                {transaction.transactionType === "expense" ? (
                  <p className="text-red-500">- € {transaction.amount}</p>
                ) : (
                  <p className="text-green-500">+ € {transaction.amount}</p>
                )}
                <div className="flex items-center gap-1 mr-5 ">
                  <button className="p-1" aria-label="Edit transaction">
                    <MdEdit color="orange" />
                  </button>
                  <button className="p-1 ">
                    <MdDelete
                      color="red"
                      onClick={() => setDeleteId(transaction._id)}
                      aria-label="Delete transaction"
                    />
                  </button>
                </div>
              </div>
              {deleteId === transaction._id && (
                <div className="absolute inset-0 bg-(--primary-blue)  rounded-xl flex flex-col items-center justify-center gap-1 z-20">
                  <p>Are you sure you want to delete this item?</p>

                  <div className="flex items-center ">
                    <button
                      className="px-3 text-stone-500 hover:text-stone-600"
                      onClick={() => setDeleteId(null)}
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 text-red-500  hover:text-red-600"
                      onClick={() => {
                        setDeleteId(null);
                        handleDelete(transaction._id);
                      }}
                      aria-label="Confirm Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
