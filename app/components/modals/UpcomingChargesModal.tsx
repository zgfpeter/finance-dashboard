"use client";

// imports
import { useState, useMemo } from "react";
import { useDashboard } from "@/app/hooks/useDashboard";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import {
  currencies,
  CurrencyCode,
  DashboardData,
  UpcomingCharge,
} from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import {
  MdEdit,
  MdDelete,
  MdOutlineRepeat,
  MdCalendarMonth,
  MdList,
  MdChevronLeft,
  MdChevronRight,
  MdArrowBack,
} from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { prettifyDate } from "@/lib/utils";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import { useSession } from "next-auth/react";
import { ViewMode } from "@/lib/types/dashboard";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
// Props
interface Props {
  onClose: () => void;
}

export default function UpcomingChargesModal({ onClose }: Props) {
  const axiosAuth = useAxiosAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDashboard();
  // destructure data frm useSession and rename to session. useSession returns an object with data:Session | null, status: "loading" | "authenticated" | "unauthenticated"
  const { data: session } = useSession();
  const currency = session?.user?.currency; // user currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;

  //  state
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null | undefined>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Controls the currently viewed month (defaults to today)
  const [currentDate, setCurrentDate] = useState(new Date());

  // track which specific day is clicked in calendar view
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // data and filtering
  const charges = useMemo(() => data?.upcomingCharges ?? [], [data]);
  const hasUpcomingCharges = charges.length > 0;
  const showEmptyState = !isLoading && !hasUpcomingCharges;

  // helper to change months
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset); // set the new month as the current month + offset, if offset = 1, just go to next month
    setCurrentDate(newDate);
    setSelectedDate(null); // Clear selection when changing months
  };

  // useMemo might not be needed, since the react compiler just handles it correctly?
  const filteredCharges = useMemo(() => {
    const term = search.trim().toLowerCase(); // user search term
    if (term) {
      // this if will run only if the search term is non-empty
      // empty string = false, non empty string = true
      return charges.filter((c) => {
        // filter will return true if either company or date or amount matches the search
        const companyMatch = c.company.toLowerCase().includes(term);
        const dateMatch = c.date.toLowerCase().includes(term);
        const amountMatch = c.amount.toString().includes(term);
        return companyMatch || dateMatch || amountMatch;
      });
    }

    // filters the charges so that only the charges for the currently displayed month are shown
    // Standard filter: by Month, if search term is empty, the first if won't run and this will run

    return charges.filter((c) => {
      // if the user is not searching ( search term empty ), show only the charges that belong to the selected month and year
      const chargeDate = new Date(c.date);
      return (
        chargeDate.getMonth() === currentDate.getMonth() &&
        chargeDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [search, charges, currentDate]);

  // Get charges just for the selected specific date (for the specific calendar day view)
  const selectedDayCharges = useMemo(() => {
    if (!selectedDate) return []; // if there isn't a selected date, return empty array
    return charges.filter((c) => {
      const d = new Date(c.date);
      // return charges where the date matches the selected day date
      return (
        d.getUTCDate() === selectedDate.getDate() &&
        d.getUTCMonth() === selectedDate.getMonth() &&
        d.getUTCFullYear() === selectedDate.getFullYear()
      );
    });
  }, [selectedDate, charges]);

  // Calendar
  // useMemo only recomputes calendar data when dependancies (currentDate) changes
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear(); // extract current year
    const month = currentDate.getMonth(); // extract current month

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // get the weekday of the first day fo the month. This will be how many empty calendar cells i need before day 1
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // how many days the month has
    // month + 1 is the next month
    // day = 0 is the last day of previous month
    // so new Date(2026,2,0) // feb 28 or 29
    // getDate returns 28 or 29, works for all months, handles leap years

    const paddingDays = Array.from({ length: firstDayOfMonth }); // creates an array of empty slots, length is weekday index of the first day
    //Array.from creates a new array form something that looks like an array
    // Array.from(arrayLike, mapFunction?) arrayLike is an object with a length property, and mapFunction is optional and runs on every element
    // length here is an object, but with a length, so javascript treats this as create an array with 5 slots.
    // (_,i)=> i+1, this is the mapping function, runs once per array slot.
    // parameters of the mapping function (value,index)=>result, but if (_,i)=> this _ just means that i don't care about this value, but i care about the index. _ means that parameter exists, but i don't need it so i ignore it
    // example: if daysInMonth = 4, then {length:4} will be an array-like object, then Array.from creates an array with 4 slots [undefined,undefined,undefined,undefined], then mapping function runs, and will assign index to each slot, so final result is [1,2,3,4]
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); // create day numbers
    // this will produce [1,2,3..., daysInMonth]

    return { paddingDays, days, year, month };
  }, [currentDate]);

  // Mutations
  // mutations don't cache result, they modify data
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      // this is run after onMutate
      axiosAuth.delete(`/dashboard/upcomingCharges/${id}`),
    // optimistic update, onMutate runs before the network request
    onMutate: async (id: string) => {
      // cancal in-flight queries, prevents a refetch from overwriting the optimistic update, avoids race conditions
      await queryClient.cancelQueries({ queryKey: ["dashboardData"] });
      // store previous state
      const previous = queryClient.getQueryData<DashboardData>([
        "dashboardData",
      ]);

      // optimistic update. Takes the existing cached dashboard data, removes the charge immediately, UI updates instantly
      queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => {
        if (!old) return old;
        return {
          ...old,
          upcomingCharges: old.upcomingCharges.filter((c) => c._id !== id),
        };
      });
      // whatever is returned here, becomes context in onError. This is the state needed if it needs to be undone
      return { previous };
    },

    // rollback to previous state if the delete fails because of network error, server error, auth error etc. Restores dashboard data to it's previous state, deleted item reappears in the UI
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["dashboardData"], context?.previous);
    },

    // runs whether mutation fails or succeeds. Force a refetch from the server, ensure client state matches backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });

  if (isLoading) return <LoadingState message="Loading upcoming charges..." />;
  if (showEmptyState)
    return <EmptyState message="No upcoming charges yet." onClose={onClose} />;
  if (isError) return <ErrorState message="Could not load charges." />;

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="relative flex flex-col items-center w-full h-full"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-0 z-10 text-xl text-red-500 right-5"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="mt-4 mb-2 text-xl font-semibold">Upcoming charges</h2>

      {/* Controls Bar */}
      <div className="flex flex-col w-full gap-3 my-3 md:px-5">
        {/* Search & View Toggle */}
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Search all charges..."
            className="p-2 border rounded-md grow bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 placeholder:text-stone-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-1 p-1 rounded-md text-cyan-500 bg-stone-200 dark:bg-stone-800">
            <button
              onClick={() => {
                setViewMode("list");
                setSelectedDate(null);
              }}
              className={`p-2 rounded-md transition-colors  ${
                viewMode === "list"
                  ? "bg-white dark:bg-stone-600 shadow-sm"
                  : "text-stone-500"
              }`}
            >
              <MdList />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-md transition-colors  ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-stone-600 shadow-sm"
                  : "text-stone-500"
              }`}
            >
              <MdCalendarMonth />
            </button>
          </div>
        </div>

        {/* Month Navigator (shown if not searching OR if not looking at a specific day ) */}
        {/* < Month > */}
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

      {/* Content Area */}
      <div className="w-full pb-5 overflow-y-auto md:px-5 grow">
        {/* global list view (default or search) */}
        {(viewMode === "list" || search) && (
          <ul className="flex flex-col w-full gap-2">
            {filteredCharges.length === 0 ? (
              <p className="mt-10 text-center text-stone-500">
                No charges found.
              </p>
            ) : (
              filteredCharges.map((charge) => (
                <ChargeListItem
                  key={charge._id}
                  charge={charge}
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

        {/* calendar view (grid)  */}
        {viewMode === "calendar" && !search && !selectedDate && (
          <div className="flex flex-col w-full h-full duration-300 animate-in fade-in">
            <div className="grid grid-cols-7 mb-2 text-xs font-bold text-center text-stone-500">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* the empty day boxes, so that the first of the month starts on the correct weekday */}
            <div className="grid grid-cols-7 auto-rows-fr gap-1 grow min-h-[300px]">
              {calendarData.paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="bg-transparent" />
              ))}
              {/* map over calendar data */}
              {/* this creates the actual numbered boxes */}
              {calendarData.days.map((dayNum) => {
                // filters charges just for that specific day
                const daysCharges = filteredCharges.filter((c) => {
                  const d = new Date(c.date);
                  return d.getUTCDate() === dayNum;
                });

                // prevent overflow: Show max 2 items
                const MAX_ITEMS = 2;
                const visibleCharges = daysCharges.slice(0, MAX_ITEMS); // slice up to MAX_ITEMS, so 2 days
                const overflowCount = daysCharges.length - MAX_ITEMS; // count the rest of the charges not including the displayed charges

                // return a button ( a box ) for each day
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
                    className="relative bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md px-1 flex flex-col gap-1 min-h-[60px] text-left hover:border-(--primary-blue) transition-colors group"
                  >
                    <span
                      className={`text-xs font-semibold ${
                        daysCharges.length > 0
                          ? "text-orange-400"
                          : "text-stone-400"
                      }`}
                    >
                      {dayNum}
                    </span>

                    <div className="flex flex-col gap-0.5 overflow-hidden w-full  py-0.5">
                      {visibleCharges.map((c) => (
                        <div
                          key={c._id}
                          className="text-[0.6rem] bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-1 rounded truncate w-full"
                          title={`${c.company} - ${c.amount}`}
                        >
                          {c.company}
                        </div>
                      ))}
                      {/* overflow badge */}
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

        {/* Specific day view */}
        {/* shown if in calendar mode, and have clicked a specific day  */}
        {viewMode === "calendar" && selectedDate && !search && (
          <div className="flex flex-col w-full h-full gap-2 duration-200 animate-in slide-in-from-right-10">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 rounded-full hover:bg-stone-500 dark:hover:bg-stone-700"
              >
                <MdArrowBack size={20} />
              </button>
              <h3 className="text-lg font-semibold">
                {prettifyDate(selectedDate.toISOString())}
              </h3>
              <span className="px-2 py-1 ml-auto text-xs rounded-full text-stone-500 bg-stone-100 dark:bg-stone-800">
                {selectedDayCharges.length} items
              </span>
            </div>

            <ul className="flex flex-col w-full gap-2">
              {/* no charges */}
              {selectedDayCharges.length === 0 ? (
                <div className="py-10 text-center text-stone-500">
                  No charges on this day.
                  <br />
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-2 text-sm text-teal-500 hover:underline"
                  >
                    Return to calendar
                  </button>
                </div>
              ) : (
                // map through charges and create a list item
                selectedDayCharges.map((charge) => (
                  <ChargeListItem
                    key={charge._id}
                    charge={charge}
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

//  ListItem (extracted for better clarity)
// TODO move into it's own component
function ChargeListItem({
  charge,
  currencySymbol,
  dispatch,
  deleteId,
  setDeleteId,
  deleteMutation,
}: {
  charge: UpcomingCharge;
  currencySymbol?: string;
  dispatch: Dispatch<UnknownAction>;
  deleteId: string | null | undefined;
  setDeleteId: (id: string | null | undefined) => void;
  deleteMutation: UseMutationResult<unknown, Error, string, unknown>; // since im just deeting and dont need the return value in the UI, unknwon works here
}) {
  return (
    <li className="bg-(--border-blue) rounded-md relative grid grid-cols-[4fr_2fr_1fr] grid-rows-2 items-center text-sm py-2 pr-3 transition-all hover:bg-stone-800/50">
      <div className="col-start-1 row-start-1 px-1">
        {charge.category && (
          <div className="text-[0.8em] font-extralight text-yellow-500 flex items-center gap-1">
            {charge.recurring && (
              <span className="flex items-center gap-1">
                <span className="text-cyan-500">
                  <MdOutlineRepeat />
                </span>
                {charge.repeating}
              </span>
            )}

            <span>{charge.category}</span>
          </div>
        )}
      </div>

      <div className="col-start-1 row-start-2 p-1 overflow-hidden font-medium whitespace-nowrap text-ellipsis">
        {charge.company}
      </div>

      <p className="row-start-2 p-1 overflow-hidden text-yellow-500 whitespace-nowrap text-ellipsis">
        - {currencySymbol} {charge.amount}
      </p>

      <p className="col-start-3 row-start-2 p-1 text-xs md:text-sm justify-self-end text-stone-400">
        {prettifyDate(charge.date)}
      </p>

      <div className="flex col-start-3 row-start-1 gap-2 p-1 justify-self-end">
        <button
          onClick={() =>
            dispatch(openModal({ type: "editUpcomingCharge", data: charge }))
          }
          className="p-1.5 rounded-full hover:bg-stone-700 transition-colors"
        >
          <MdEdit className="text-orange-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent clicking the row from triggering other events if needed
            setDeleteId(charge._id);
          }}
          className="p-1.5 rounded-full hover:bg-stone-700 transition-colors"
        >
          <MdDelete className="text-red-500" />
        </button>
      </div>

      {deleteId === charge._id && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 duration-200 rounded-md bg-stone-900/95 backdrop-blur-sm animate-in fade-in zoom-in">
          <p className="text-sm font-semibold text-white">
            Delete this charge?
          </p>
          <div className="flex gap-4 text-xs">
            <button
              className="px-3 py-1 rounded bg-stone-700 hover:bg-stone-600"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-500"
              onClick={() => {
                if (charge._id) deleteMutation.mutate(charge._id);
                setDeleteId(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
