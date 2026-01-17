"use client";

// the TypeScript type of props this component accepts
// onClose is a function with no arguments and no return value
// ()=> void is the TypeScript way to write "a function that returns nothing"
interface Props {
  onClose: () => void;
}

// -- imports --
import {
  MdEdit,
  MdDelete,
  MdList,
  MdCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdFilterList,
  MdArrowBack,
} from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState, useMemo } from "react";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import {
  currencies,
  DashboardData,
  CurrencyCode,
  Transaction,
} from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { prettifyDate } from "@/lib/utils";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { useSession } from "next-auth/react";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
// -- end imports --

type ViewMode = "list" | "calendar";

export default function TransactionsModal({ onClose }: Props) {
  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const dispatch = useDispatch();

  // React Query gives me access to the entire cached data system.
  // This is needed for invalidating and optimistic updates
  const queryClient = useQueryClient();

  // call my custom useDashboard hook, and destructure only data (instead of useDashboard.data that i had before)
  // dashboardData = {transactions:[...],upcomingCharges:[...]} etc, so data is this object
  const { data, isLoading, isError } = useDashboard();
  // if data exists and data.transactions exists, use it, otherwise fall bcak to an empty array

  // /?? is called the nullish coalescing operator, it returns the right side only if the left side is null or undefined.
  const transactions = useMemo(() => data?.transactions ?? [], [data]);

  const hasTransactions = transactions.length > 0; // if true, there are some transactions
  const showEmptyState = !isLoading && !hasTransactions;

  // state for deleting
  // delete: track which item is to be deleted and show the delete confirmation modal
  // union type string | null | undefined because _id is a string, and i also want to have no selection
  const [deleteId, setDeleteId] = useState<string | null | undefined>(null);

  //state for searching, stores the search text
  const [search, setSearch] = useState("");

  // NEW: State for view mode and calendar navigation
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  // Controls the currently viewed month (defaults to today)
  const [currentDate, setCurrentDate] = useState(new Date());

  // NEW: Track which specific day is clicked in calendar view
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // NEW: Helper to change months
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedDate(null); // Clear selection when changing months
  };

  // useMemo prevents this filter from running on every render.
  // it recalculates only if search or transactions change
  // if no search, return full list, otherwise filter based on search term

  // filters by date, company, amount and transaction type (expense or income)
  // so if the user types "expense" or "income", it will find the transactions that are expenses or incomes
  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();
    // trim spaces and convert to lowercase for case-insensitivity

    // MODIFIED: Logic to handle Search vs Month View
    if (term) {
      // If searching, ignore month and search global list
      return transactions.filter((transaction) => {
        const companyMatch = transaction.company.toLowerCase().includes(term);
        const dateMatch = transaction.date.toLowerCase().includes(term);
        const amountMatch = transaction.amount.toString().includes(term);
        const typeMatch = transaction.transactionType
          .toLowerCase()
          .includes(term);

        return companyMatch || dateMatch || amountMatch || typeMatch;
      });
    }

    // If not searching, return transactions for the currently selected month/year
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === currentDate.getMonth() &&
        tDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [search, transactions, currentDate]);

  // NEW: Get transactions just for the selected specific date (for the drill-down view)
  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [selectedDate, transactions]);

  // NEW: Calculate calendar grid data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Array of empty slots for padding before the 1st of the month
    const paddingDays = Array.from({ length: firstDayOfMonth });
    // Array of actual days
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return { paddingDays, days, year, month };
  }, [currentDate]);

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

  if (isLoading) {
    return <LoadingState message="Loading transactions data..." />;
  }

  if (showEmptyState) {
    return <EmptyState message="No transactions data yet." onClose={onClose} />;
  }
  if (isError) {
    return <ErrorState message="Could not load transactions data." />;
  }

  // Formatter for "October 2025"
  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="relative flex flex-col items-center w-full h-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute top-0 z-10 text-xl text-red-500 right-5"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="mt-4 mb-2 text-xl font-semibold">Transactions</h2>

      {/* Controls Bar */}
      <div className="flex flex-col w-full gap-3 my-3 md:px-5">
        {/* Search Bar */}
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Search transactions..."
            className="p-2 border rounded-md grow bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 placeholder:text-stone-500 text-stone-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* View Toggle */}
          <div className="flex gap-1 p-1 rounded-md text-stone-500 bg-stone-200 dark:bg-stone-800">
            <button
              onClick={() => {
                setViewMode("list");
                setSelectedDate(null);
              }}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-stone-600 shadow-sm"
                  : "text-stone-500"
              }`}
            >
              <MdList />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-stone-600 shadow-sm"
                  : "text-stone-500"
              }`}
            >
              <MdCalendarMonth />
            </button>
          </div>
        </div>

        {/* Month Navigator (Only show if not searching AND not in Drill-Down mode) */}
        {!search && !selectedDate && (
          <div className="flex items-center justify-between bg-(--border-blue) rounded-md p-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 rounded-full hover:bg-stone-700"
            >
              <MdChevronLeft size={24} />
            </button>
            <span className="text-lg font-medium">{monthLabel}</span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 rounded-full hover:bg-stone-700"
            >
              <MdChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="w-full overflow-y-auto md:px-5 grow">
        {/* Global list view */}
        {(viewMode === "list" || search) && (
          <ul className="flex flex-col w-full gap-2">
            {filteredTransactions.length === 0 ? (
              <p className="mt-10 text-center text-stone-500">
                No transactions found for this period.
              </p>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionListItem
                  key={transaction._id}
                  transaction={transaction}
                  currencySymbol={currencySymbol}
                  dispatch={dispatch}
                  deleteId={deleteId}
                  setDeleteId={setDeleteId}
                  deleteMutation={deleteMutation}
                />
              ))
            )}
          </ul>
        )}

        {/* Calendar view (grid)  */}
        {viewMode === "calendar" && !search && !selectedDate && (
          <div className="flex flex-col w-full h-full duration-300 animate-in fade-in">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2 text-xs font-bold text-center text-stone-500">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 auto-rows-fr gap-1 grow min-h-[300px]">
              {/* Empty padding buttons */}
              {calendarData.paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="bg-transparent" />
              ))}

              {/* Actual days */}
              {calendarData.days.map((dayNum) => {
                // Find transactions for this specific day
                const daysTransactions = filteredTransactions.filter((t) => {
                  const d = new Date(t.date);
                  return d.getDate() === dayNum;
                });

                // Logic to prevent overflow: Show max 2 items
                const MAX_ITEMS = 2;
                const visibleTransactions = daysTransactions.slice(
                  0,
                  MAX_ITEMS
                );
                const overflowCount = daysTransactions.length - MAX_ITEMS;

                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      // Create a date object for this specific day
                      const clickedDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        dayNum
                      );
                      setSelectedDate(clickedDate);
                    }}
                    className="relative bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md px-1 flex flex-col gap-1 min-h-[65px] text-left hover:border-(--primary-blue) transition-colors group"
                  >
                    <span
                      className={`text-xs font-semibold ${
                        daysTransactions.length > 0
                          ? "text-(--primary-blue)"
                          : "text-stone-400"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Tiny dots/bars for transactions */}
                    <div className="flex flex-col gap-0.5 overflow-hidden w-full">
                      {visibleTransactions.map((t) => {
                        const isExpense = t.transactionType === "expense";
                        return (
                          <div
                            key={t._id}
                            className={`text-[0.6rem] px-1 rounded truncate w-full
                              ${
                                isExpense
                                  ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                  : "bg-green-500/20 text-green-600 dark:text-green-400"
                              }`}
                            //title={`${t.company} - ${t.amount}`}
                          >
                            {`${t.company} - ${t.amount}`}
                          </div>
                        );
                      })}
                      {/* Overflow Badge */}
                      {overflowCount > 0 && (
                        <div className="text-[0.6rem] text-stone-500 px-1 font-medium">
                          + {overflowCount} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/*  Day detail view  */}
        {viewMode === "calendar" && selectedDate && !search && (
          <div className="flex flex-col w-full h-full gap-2 duration-200 animate-in slide-in-from-right-10">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                <MdArrowBack size={20} />
              </button>
              <h3 className="text-lg font-semibold">
                {prettifyDate(selectedDate.toISOString())}
              </h3>
              <span className="px-2 py-1 ml-auto text-xs rounded-full text-stone-500 bg-stone-100 dark:bg-stone-800">
                {selectedDayTransactions.length} items
              </span>
            </div>

            <ul className="flex flex-col w-full gap-2">
              {selectedDayTransactions.length === 0 ? (
                <div className="py-10 text-center text-stone-500">
                  No transactions on this day.
                  <br />
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-2 text-sm text-teal-500 hover:underline"
                  >
                    Return to calendar
                  </button>
                </div>
              ) : (
                selectedDayTransactions.map((transaction) => (
                  <TransactionListItem
                    key={transaction._id}
                    transaction={transaction}
                    currencySymbol={currencySymbol}
                    dispatch={dispatch}
                    deleteId={deleteId}
                    setDeleteId={setDeleteId}
                    deleteMutation={deleteMutation}
                  />
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Extracted for cleanliness to be used in both views if needed
function TransactionListItem({
  transaction,
  currencySymbol,
  dispatch,
  deleteId,
  setDeleteId,
  deleteMutation,
}: {
  transaction: Transaction;
  currencySymbol?: string;
  dispatch: Dispatch<UnknownAction>;
  deleteId: string | null | undefined;
  setDeleteId: (id: string | null | undefined) => void;
  deleteMutation: UseMutationResult<unknown, Error, string, unknown>;
}) {
  return (
    <li className="bg-(--border-blue) rounded-md relative grid grid-cols-[4fr_2fr_1fr] grid-rows-2 items-center text-sm py-2 pr-3 transition-all hover:bg-stone-800/50">
      {/* Category or Income Icon */}
      {transaction.category ? (
        <div className="col-start-1 row-start-1 p-1 text-xs text-yellow-500">
          {transaction.category}
        </div>
      ) : (
        <div className="flex items-center col-start-1 row-start-1 gap-1 p-1 text-xs text-emerald-500">
          +<FaMoneyBillTransfer />
        </div>
      )}

      {/* Company Name */}
      <div className="col-start-1 row-start-2 p-1 overflow-hidden font-medium whitespace-nowrap text-ellipsis">
        {transaction.company}
      </div>

      {/* Amount (Colored based on type) */}
      {transaction.transactionType === "expense" ? (
        <p className="row-start-2 p-1 overflow-hidden text-red-500 whitespace-nowrap text-ellipsis">
          - {currencySymbol} {transaction.amount}
        </p>
      ) : (
        <p className="row-start-2 p-1 overflow-hidden text-green-500 whitespace-nowrap text-ellipsis">
          + {currencySymbol} {transaction.amount}
        </p>
      )}

      {/* Date */}
      <p className="col-start-3 row-start-2 p-1 pr-3 text-xs md:text-sm justify-self-end text-stone-400">
        {prettifyDate(transaction.date)}
      </p>

      {/* Actions */}
      <div className="flex col-start-3 row-start-1 gap-2 p-1 pr-4 justify-self-end">
        <button
          onClick={() =>
            dispatch(
              openModal({
                type: "editTransaction",
                data: transaction,
              })
            )
          }
          className="p-2 rounded-full hover:bg-stone-900"
          aria-label="Edit transaction"
        >
          <MdEdit color="orange" />
        </button>
        <button className="p-2 rounded-full hover:bg-stone-900">
          <MdDelete
            color="red"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click bubbling if any
              setDeleteId(transaction._id);
            }}
            aria-label="Delete transaction"
          />
        </button>
      </div>

      {/* Delete Confirmation Overlay */}
      {deleteId === transaction._id && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 duration-200 rounded-md bg-stone-900/95 backdrop-blur-sm animate-in fade-in zoom-in">
          <p className="text-sm font-semibold text-white">Delete this item?</p>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-stone-700 text-stone-300 hover:bg-stone-600"
              onClick={() => setDeleteId(null)}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-500"
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
}
