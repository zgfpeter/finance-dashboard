"use client";
import axios from "axios";
interface Props {
  onClose: () => void;
}
import { MdEdit, MdDelete } from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData } from "@/lib/types/dashboard";

export default function UpcomingChargesModal({ onClose }: Props) {
  const { data: dashboard, isLoading } = useDashboard();
  const upcomingCharges = dashboard?.upcomingCharges || [];
  const [search, setSearch] = useState(""); // the search string
  const queryClient = useQueryClient(); //
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`http://localhost:4000/api/dashboard/upcomingCharges/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["dashboardData"] });

      const previousData = queryClient.getQueryData<DashboardData>([
        "dashboardData",
      ]);

      queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => ({
        ...old!,
        upcomingCharges: old!.upcomingCharges.filter((c) => c._id !== id),
      }));

      return { previousData };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["dashboardData"], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });

  const filteredCharges = upcomingCharges.filter((charge) => {
    return charge.company.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className=" text-(--text-light) rounded">
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Upcoming Charges</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-xl"
        // onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="flex flex-col gap-2 h-100 overflow-y-auto ">
        {filteredCharges?.map((charge) => {
          return (
            <li
              key={charge._id}
              className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl relative"
            >
              <div className="flex items-center gap-2">
                {/* <FaPlus color="green" /> */}

                <div className="flex flex-col">
                  <span>{charge.company}</span>
                  <span>{charge.date}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-yellow-500 ">- € {charge.amount}</div>
                <div className="flex items-center gap-1 mr-5">
                  <button className="p-1" aria-label="Edit upcoming charge">
                    <MdEdit color="orange" />
                  </button>
                  <button className="p-1">
                    <MdDelete
                      color="red"
                      onClick={() => {
                        if (!charge._id) return;
                        else setDeleteId(charge._id);
                      }}
                      aria-label="Delete upcoming charge"
                    />
                  </button>
                </div>
              </div>
              {deleteId === charge._id && (
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
                      className="px-3 text-red-500 hover:text-red-600"
                      onClick={() => {
                        setDeleteId(null);
                        if (!charge._id) return; // safety check
                        deleteMutation.mutate(charge._id);
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
