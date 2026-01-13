"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currencies, CurrencyCode, DashboardData } from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import {
  MdEdit,
  MdDelete,
  MdEventRepeat,
  MdOutlineRepeat,
} from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { prettifyDate } from "@/lib/utils";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import { useSession } from "next-auth/react";

interface Props {
  onClose: () => void;
}

export default function UpcomingChargesModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDashboard();

  //
  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;

  // Charges from the dashboard
  const charges = useMemo(() => data?.upcomingCharges ?? [], [data]);
  const hasUpcomingCharges = charges.length > 0; // if true, there are some transactions
  const showEmptyState = !isLoading && !hasUpcomingCharges;

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null | undefined>(null);

  const filteredCharges = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return charges;

    return charges.filter((c) => {
      const companyMatch = c.company.toLowerCase().includes(term);
      const dateMatch = c.date.toLowerCase().includes(term);
      const amountMatch = c.amount.toString().includes(term);

      return companyMatch || dateMatch || amountMatch;
    });
  }, [search, charges]);

  // DELETE mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosAuth.delete(`/dashboard/upcomingCharges/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["dashboardData"] });
      const previous = queryClient.getQueryData<DashboardData>([
        "dashboardData",
      ]);

      queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => {
        if (!old) return old;
        return {
          ...old,
          upcomingCharges: old.upcomingCharges.filter((c) => c._id !== id),
        };
      });

      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["dashboardData"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });

  if (isLoading) {
    return <LoadingState message="Loading upcoming charges data..." />;
  }

  if (showEmptyState) {
    return <EmptyState message="No upcoming charges data yet." />;
  }
  if (isError) {
    return <ErrorState message="Could not load upcoming charges data." />;
  }
  return (
    <div
      className="relative flex flex-col items-center h-full justify-evenly"
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

      <h2 className="mb-4 text-xl font-semibold">Upcoming Charges</h2>

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="flex flex-col w-full gap-1 overflow-y-auto grow">
        {filteredCharges.map((charge) => (
          <li
            key={charge._id}
            className="bg-(--border-blue) rounded-md relative  grid grid-cols-[2fr_2fr_1fr] grid-rows-2 items-center text-sm py-1"
          >
            {/* company and category */}

            {charge.category && (
              <div className="text-[0.8em] font-extralight font-stretch-semi-expanded text-yellow-500 px-1 w-fit flex items-center gap-1">
                {charge.recurring && (
                  <span className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-cyan-500">
                      <MdOutlineRepeat />
                    </span>
                    {charge.repeating}

                    <span>{charge.category}</span>
                  </span>
                )}
              </div>
            )}
            <div className="col-start-1 row-start-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
              {charge.company}
            </div>

            {/* amount */}
            <p className="row-start-2 p-1 overflow-hidden text-yellow-500 whitespace-nowrap text-ellipsis">
              - {currencySymbol} {charge.amount}
            </p>
            {/* date */}
            <p className="col-start-3 row-start-2 p-1 pr-3 text-xs md:text-sm justify-self-end">
              {prettifyDate(charge.date)}
            </p>

            {/* edit and delete buttons */}
            <div className="flex col-start-3 row-start-1 gap-1 p-1 pr-5 justify-self-end">
              {/* Edit button now dispatches Redux action */}
              <button
                onClick={() =>
                  dispatch(
                    openModal({ type: "editUpcomingCharge", data: charge })
                  )
                }
                aria-label="Edit upcoming charge"
                className="p-1"
              >
                <MdEdit color="orange" />
              </button>

              {/* Delete button */}
              <button
                onClick={() => setDeleteId(charge._id)}
                aria-label="Delete upcoming charge"
                className="p-1"
              >
                <MdDelete color="red" />
              </button>
            </div>

            {/* Delete confirmation overlay */}
            {deleteId === charge._id && (
              <div className="absolute inset-0 bg-(--primary-blue) rounded-md flex flex-col items-center justify-center gap-2 z-20">
                <p>Are you sure you want to delete this item?</p>
                <div className="flex gap-4">
                  <button
                    className="px-3 text-stone-500 hover:text-stone-600"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 text-red-500 hover:text-red-600"
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
        ))}
      </ul>
    </div>
  );
}
