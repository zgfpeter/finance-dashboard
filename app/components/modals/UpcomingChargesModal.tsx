"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData } from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { MdEdit, MdDelete } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { prettifyDate } from "@/lib/utils";

interface Props {
  onClose: () => void;
}

export default function UpcomingChargesModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data } = useDashboard();

  // Charges from the dashboard
  const charges = useMemo(() => data?.upcomingCharges ?? [], [data]);

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

  return (
    <div
      className=" h-full flex items-center flex-col justify-evenly relative"
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

      <h2 className="text-xl font-semibold mb-4">Upcoming Charges</h2>

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-xl"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="w-full flex flex-col gap-1 overflow-y-auto grow">
        {filteredCharges.map((charge) => (
          <li
            key={charge._id}
            className="bg-(--border-blue) rounded-xl relative  grid grid-cols-[2fr_2fr_1fr] grid-rows-2 items-center text-sm py-1"
          >
            {/* company and category */}

            {charge.category && (
              <div className="text-xs md:text-sm text-yellow-500 p-1">
                {charge.category}
              </div>
            )}
            <div className="row-start-2 col-start-1 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
              {charge.company}
            </div>

            {/* amount */}
            <p className=" text-yellow-500  row-start-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
              - € {charge.amount}
            </p>
            {/* date */}
            <p className="text-xs md:text-sm row-start-2 col-start-3 justify-self-end pr-3 p-1">
              {prettifyDate(charge.date)}
            </p>

            {/* edit and delete buttons */}
            <div className="row-start-1 col-start-3 p-1 justify-self-end pr-5">
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
              <div className="absolute inset-0 bg-(--primary-blue) rounded-xl flex flex-col items-center justify-center gap-2 z-20">
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
