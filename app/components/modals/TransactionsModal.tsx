"use client";

// the TypeScript type of props this component accepts
// onClose is a function with no arguments and no return value
// ()=> void is the TypeScript way to write "a function that returns nothing"
interface Props {
  onClose: () => void;
}

// -- imports --
import { MdEdit, MdDelete } from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData } from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { prettifyDate } from "@/lib/utils";
// -- end imports --

export default function TransactionsModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const dispatch = useDispatch();

  // React Query gives me access to the entire cached data system.
  // This is needed for invalidating and optimistic updates
  const queryClient = useQueryClient();

  // call my custom useDashboard hook, and destructure only data (instead of useDashboard.data that i had before)
  // dashboardData = {transactions:[...],upcomingCharges:[...]} etc, so data is this object
  const { data } = useDashboard();
  // if data exists and data.transactions exists, use it, otherwise fall bcak to an empty array

  // /?? is called the nullish coalescing operator, it returns the right side only if the left side is null or undefined.
  const transactions = useMemo(() => data?.transactions ?? [], [data]);

  // state for deleting
  // delete: track which item is to be deleted and show the delete confirmation modal
  // union type string | null | undefined because _id is a string, and i also want to have no selection
  const [deleteId, setDeleteId] = useState<string | null | undefined>(null);

  //state for searching, stores the search text
  const [search, setSearch] = useState("");

  // useMemo prevents this filter from running on every render.
  // it recalculates only if search or transactions change
  // if no search, return full list, otherwise filter based on search term

  // filters by date, company, amount and transaction type (expense or income)
  // so if the user types "expense" or "income", it will find the transactions that are expenses or incomes
  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();
    // trim spaces and convert to lowercase for case-insensitivity
    if (!term) return transactions;

    return transactions.filter((transaction) => {
      const companyMatch = transaction.company.toLowerCase().includes(term);
      const dateMatch = transaction.date.toLowerCase().includes(term);
      const amountMatch = transaction.amount.toString().includes(term);
      const typeMatch = transaction.transactionType
        .toLowerCase()
        .includes(term);

      return companyMatch || dateMatch || amountMatch || typeMatch;
    });
  }, [search, transactions]);

  /**
   * DELETE mutation with optimistic updates
   */
  // useMutation wraps a function that changes server state (POST,PUT,DELETE). Mutations are not cached automatically like queries, i need to update/query the cache manually after a mutation
  const deleteMutation = useMutation({
    // this is the function that runs when i call deleteMutation.mutate(id) in the confirm delete modal
    mutationFn: (id: string) =>
      axiosAuth.delete(`/dashboard/transactions/${id}`),

    // this runs before the request is send
    // we can do optimistic UI updates here
    onMutate: async (id: string) => {
      // cancel ongoing requests for dashboardData, avoids race conditions
      await queryClient.cancelQueries({ queryKey: ["dashboardData"] });

      // store current cached dashboard data so i can rollback if needed
      const previous = queryClient.getQueryData(["dashboardData"]);

      // optimistically update the cache
      // remove the deleted transaction immediately from the UI
      // serve request continues in the background
      // makes the UI feel fast
      queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => {
        if (!old) return old; // in case cache is empty

        return {
          ...old,
          transactions: old.transactions.filter((c) => c._id !== id),
        };
      });

      // return snapshot for rollback
      return { previous };
    },

    // error handling
    // if the request fails, restore old cached data and undo optimistic update
    onError: (_error, _id, context) => {
      queryClient.setQueryData(["dashboardData"], context?.previous);
    },

    // final cleanup
    // refetch updated data from the server
    // UI stays in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });

  return (
    <div
      className="h-full w-full flex items-center flex-col justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-xl"
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="w-full flex flex-col gap-1 overflow-y-auto grow">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        {filteredTransactions?.map((transaction) => {
          return (
            <li
              key={transaction._id}
              className="bg-(--border-blue) rounded-xl relative  grid grid-cols-[2fr_2fr_1fr] grid-rows-2 items-center text-sm py-1"
            >
              {transaction.category && (
                <div className="text-xs md:text-sm text-yellow-500 p-1">
                  {transaction.category}
                </div>
              )}
              <div className="row-start-2 col-start-1 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {transaction.company}
              </div>

              {transaction.transactionType === "expense" ? (
                <p className="text-red-500 row-start-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  - € {transaction.amount}
                </p>
              ) : (
                <p className="text-green-500 row-start-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  + € {transaction.amount}
                </p>
              )}

              <p className="text-xs md:text-sm row-start-2 col-start-3 justify-self-end pr-3 p-1">
                {prettifyDate(transaction.date)}
              </p>
              <div className="row-start-1 col-start-3 p-1 justify-self-end pr-5">
                <button
                  onClick={() =>
                    dispatch(
                      openModal({
                        type: "editTransaction",
                        data: transaction,
                      })
                    )
                  }
                  className="p-1"
                  aria-label="Edit transaction"
                >
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

              {deleteId === transaction._id && (
                <div className="absolute inset-0 bg-(--primary-blue)  rounded-xl flex flex-col items-center gap-1 z-20">
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
                        if (!transaction._id) return;
                        deleteMutation.mutate(transaction._id);
                        setDeleteId(null);
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
