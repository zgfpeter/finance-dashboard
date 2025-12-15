"use client";

// the TypeScript type of props this component accepts
// onClose is a function with no arguments and no return value
// ()=> void is the TypeScript way to write "a function that returns nothing"
interface Props {
  data: Debt | null;
  onClose: () => void;
}

// -- imports --
import { motion } from "framer-motion";
import { calcAnimationWidth } from "@/lib/utils";
import {
  MdEdit,
  MdDelete,
  MdCircle,
  MdOutlineWatchLater,
} from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData, Debt } from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
// -- end imports --

export default function DebtsModal({ onClose }: Props) {
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
  const debts = useMemo(() => data?.debts ?? [], [data]);

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
  const filteredDebts = useMemo(() => {
    const term = search.trim().toLowerCase();
    // trim spaces and convert to lowercase for case-insensitivity
    if (!term) return debts;

    return debts.filter((debt) => {
      const companyMatch = debt.company.toLowerCase().includes(term);
      const dateMatch = debt.dueDate.toLowerCase().includes(term);
      return companyMatch || dateMatch;
    });
  }, [search, debts]);

  /**
   * DELETE mutation with optimistic updates
   */
  // useMutation wraps a function that changes server state (POST,PUT,DELETE). Mutations are not cached automatically like queries, i need to update/query the cache manually after a mutation
  const deleteMutation = useMutation({
    // this is the function that runs when i call deleteMutation.mutate(id) in the confirm delete modal
    mutationFn: (id: string) => axiosAuth.delete(`/api/dashboard/debts/${id}`),

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
          debts: old.debts.filter((c) => c._id !== id),
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

      <h2 className="text-xl font-semibold mb-4">Debts</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-xl"
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="w-full flex flex-col gap-2  overflow-y-auto grow ">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        {filteredDebts?.map((debt) => {
          return (
            <li
              key={debt._id}
              className=" bg-(--border-blue) p-2 rounded-xl  gap-2 grid grid-cols-[1fr_4fr_1fr]"
            >
              <div className="flex flex-col gap-1 items-center justify-center text-xs">
                <MdOutlineWatchLater /> x days
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full py-2">
                  <span aria-label={`Debt company: `}>{debt.company}</span>
                  <span aria-label={`Debt due date: `}>{debt.dueDate}</span>
                </div>
                <div className="relative w-full ">
                  <p className="flex justify-between px-2 border border-orange-700 py-1 rounded-2xl w-full text-sm z-10 relative">
                    <span aria-label={`Amount paid for ${debt.company}  `}>
                      {debt.currentPaid}
                    </span>
                    <span>/</span>
                    <span aria-label={`Total amount for ${debt.company}  `}>
                      {debt.totalAmount}
                    </span>
                  </p>

                  <motion.span
                    aria-hidden="true"
                    // z indes smaller than price <p> so that it sits below the text
                    className="absolute left-0 top-0 h-full bg-orange-700 rounded-2xl z-0"
                    role="progressbar"
                    aria-valuenow={debt.currentPaid}
                    aria-valuemin={0}
                    aria-valuemax={debt.totalAmount}
                    aria-label={`Amount paid for ${debt.company}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${calcAnimationWidth(
                        debt.currentPaid,
                        debt.totalAmount
                      )}%`,
                    }}
                    transition={{
                      duration: 1.8,
                    }}
                  ></motion.span>
                </div>
              </div>
              <div className="flex items-center  justify-center gap-3">
                <button
                  //   onClick={() =>
                  //     dispatch(
                  //       openModal({
                  //         type: "editDebt",
                  //         data: debt,
                  //       })
                  //     )
                  //   }
                  className="p-1"
                  aria-label="Edit debt"
                >
                  <MdEdit color="orange" />
                </button>
                <button className="p-1 ">
                  <MdDelete
                    color="red"
                    onClick={() => setDeleteId(debt._id)}
                    aria-label="Delete debt"
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
