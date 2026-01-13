"use client";

// the TypeScript type of props this component accepts
// onClose is a function with no arguments and no return value
// ()=> void is the TypeScript way to write "a function that returns nothing"
interface Props {
  data: Goal | null;
  onClose: () => void;
}

// -- imports --
import { motion } from "framer-motion";
import { calcProgressPercent as calcAnimationWidth } from "@/lib/utils";
import { MdEdit, MdDelete, MdOutlineWatchLater } from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData, Goal } from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { calculateDeadline, prettifyDate } from "@/lib/utils";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
// -- end imports --

export default function GoalsModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const dispatch = useDispatch();

  // React Query gives me access to the entire cached data system.
  // This is needed for invalidating and optimistic updates
  const queryClient = useQueryClient();

  // call my custom useDashboard hook, and destructure only data (instead of useDashboard.data that i had before)
  // dashboardData = {transactions:[...],upcomingCharges:[...]} etc, so data is this object
  const { data, isLoading, isError } = useDashboard();
  const goals = useMemo(() => data?.goals ?? [], [data]);
  const hasGoals = goals && goals.length > 0;
  const showEmptyState = !isLoading && !hasGoals;
  // if data exists and data.transactions exists, use it, otherwise fall bcak to an empty array

  // /?? is called the nullish coalescing operator, it returns the right side only if the left side is null or undefined.

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
  const filteredgoals = useMemo(() => {
    const term = search.trim().toLowerCase();
    // trim spaces and convert to lowercase for case-insensitivity
    if (!term) return goals;

    // filter by goal title, due date
    return goals.filter((goal) => {
      const titleMatch = goal.title.toLowerCase().includes(term);
      const dateMatch = goal.targetDate.toLowerCase().includes(term);

      return titleMatch || dateMatch;
    });
  }, [search, goals]);

  /**
   * DELETE mutation with optimistic updates
   */
  // useMutation wraps a function that changes server state (POST,PUT,DELETE). Mutations are not cached automatically like queries, i need to update/query the cache manually after a mutation
  const deleteMutation = useMutation({
    // this is the function that runs when i call deleteMutation.mutate(id) in the confirm delete modal
    mutationFn: (id: string) => axiosAuth.delete(`/dashboard/goals/${id}`),

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

  if (isLoading) {
    return <LoadingState message="Loading goals data..." />;
  }

  if (showEmptyState) {
    return <EmptyState message="No goals data yet." />;
  }
  if (isError) {
    return <ErrorState message="Could not load goals data." />;
  }

  // TODO fix goals and goals, use one term only consistently
  return (
    <div
      className="flex flex-col items-center w-full h-full justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute text-xl text-red-500 right-10 top-4"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="mb-4 text-xl font-semibold">Goals</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-md"
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="flex flex-col w-full gap-2 overflow-y-auto grow ">
        {/* each goal goal li is a grid with 2 columns, one for company+date and one for amount */}
        {filteredgoals?.map((goal) => {
          const isFullySaved =
            Number(goal.currentAmount) >= Number(goal.targetAmount);
          const deadline = calculateDeadline(goal.targetDate);
          return (
            // <li
            //   key={goal._id}
            //   className="bg-(--border-blue) p-2 rounded-md gap-2 relative grid grid-cols-2 grid-rows-[auto_1fr] md:grid-cols-[1fr_2fr_1fr] md:grid-rows-1"
            // >
            <li
              key={goal._id}
              className="bg-(--border-blue) p-2 rounded-md gap-2 relative grid grid-cols-2 grid-rows-[auto_1fr] md:grid-cols-[1fr_2fr_1fr] md:grid-rows-1"
            >
              <div className="flex items-center gap-1 text-xs md:justify-center w-fit ">
                <MdOutlineWatchLater color="orange" />
                <span
                  className={
                    deadline.status === "upcoming"
                      ? "text-green-500"
                      : deadline.status === "soon"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                >
                  {deadline.text}
                </span>
              </div>

              <div className="flex flex-col col-span-2 gap-1 md:col-span-1">
                <div className="flex items-center justify-between w-full py-2">
                  <span aria-label="Goal title">{goal.title}</span>
                  <span
                    aria-label={`Goal date: ${goal.targetDate}`}
                    className="text-xs"
                  >
                    {prettifyDate(goal.targetDate)}
                  </span>
                </div>
                <div className="relative">
                  <p className="relative z-10 flex justify-between w-full px-2 py-1 text-sm border border-teal-700 rounded-xl">
                    <span aria-label={`Goal ${goal.title} current amount`}>
                      {goal.currentAmount}
                    </span>
                    <span>/</span>
                    <span
                      aria-label={`Goal ${goal.title} target amount: ${goal.targetAmount}`}
                    >
                      {goal.targetAmount}
                    </span>
                  </p>

                  <motion.span
                    // z indes smaller than price <p> so that it sits below the text
                    className={`absolute left-0 top-0 h-full ${
                      isFullySaved ? "bg-teal-900" : "bg-teal-600"
                    } rounded-xl z-0`}
                    initial={{ width: 0 }}
                    role="progressbar"
                    aria-valuenow={Number(goal.currentAmount)}
                    aria-valuemin={0}
                    aria-valuemax={Number(goal.targetAmount)}
                    aria-label={`Amount paid for ${goal.title}`}
                    animate={{
                      width: `${calcAnimationWidth(
                        Number(goal.currentAmount),
                        Number(goal.targetAmount)
                      )}%`,
                    }}
                    transition={{
                      duration: 1.8,
                    }}
                  ></motion.span>
                </div>
              </div>
              <div className="flex items-center col-start-2 row-start-1 gap-1 justify-self-end md:justify-center md:col-start-auto md:row-start-auto">
                <button
                  onClick={() =>
                    dispatch(
                      openModal({
                        type: "editGoal",
                        data: goal,
                      })
                    )
                  }
                  className="p-1"
                  aria-label="Edit goals goal"
                >
                  <MdEdit color="orange" />
                </button>
                <button className="p-1 ">
                  <MdDelete
                    color="red"
                    onClick={() => setDeleteId(goal._id)}
                    aria-label="Delete goals goal"
                  />
                </button>
              </div>
              {deleteId === goal._id && (
                <div className="absolute inset-0 bg-(--primary-bg)  rounded-md flex flex-col items-center justify-center  gap-1 z-20">
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
                      className="px-3 text-red-500 hover:text-red-600"
                      onClick={() => {
                        if (!goal._id) return;
                        deleteMutation.mutate(goal._id);
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
