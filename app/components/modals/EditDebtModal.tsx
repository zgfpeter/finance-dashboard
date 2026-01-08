"use client";

// -- imports --
import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData, Debt } from "@/lib/types/dashboard";
import { MdClose, MdCheck } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";

// -- end imports --
// the props the component takes
interface Props {
  data: Debt | null;
  onClose: () => void;
}

//   company: string;
//   currentPaid: number | string;
//   totalAmount: number | string;
//   dueDate: string;

export default function EditDebtModal({ data, onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [company, setCompany] = useState(data?.company ?? "");
  const [currentPaid, setCurrentPaid] = useState(data?.currentPaid ?? "");
  const [totalAmount, setTotalAmount] = useState(data?.totalAmount ?? "");

  const [dueDate, setDueDate] = useState(() => {
    if (!data?.dueDate) return "";
    return new Date(data?.dueDate).toISOString().slice(0, 10);
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    dueDate: "",
    company: "",
    currentPaid: "",
    totalAmount: "",
    generalError: "",
  });

  // tanstack mutation: PUT
  // this runs when i call mutate()
  const updateMutation = useMutation({
    // sends the update to the backend, doesn't wait to finish to update UI
    mutationFn: (debt: Debt) =>
      axiosAuth.put(`/dashboard/debts/${debt._id}`, debt),
    // runs immediately when i click 'Save"
    // this runs before the PUT request is send, i can do optimistic updates here
    // cancel queries: because maybe another refetch is happening at the same time
    // cancel it to avoid UI flickering or outdated data ( race conditions )
    onMutate: async (debt: Debt) => {
      await queryClient.cancelQueries({ queryKey: ["dashboardData"] });

      // store the previous value in case i need to rollback
      const previous = queryClient.getQueryData<DashboardData>([
        "dashboardData",
      ]);

      // optimistic update: update the UI before the server request is finished, instant new values
      queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => {
        if (!old) return old;
        return {
          ...old,
          debts: old.debts.map((c) =>
            c._id === debt._id ? { ...c, ...debt } : c
          ),
        };
      });

      // this is accessible in onError
      return { previous };
    },

    // runs after a successfuly PUT request
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      console.log("Success");
      onClose();
    },

    // if request fails: restore the old value (from previous)
    onError: (_err, _debt, context) => {
      console.log("An error has occured: ", _err);
      queryClient.setQueryData(["dashboardData"], context?.previous);
    },
  });

  if (!data) return <ErrorState message="No data" />;

  // get the states from the updateMutation
  const { isPending, isError, error } = updateMutation;

  // handle the user SAVE
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if nothing changed and the user clicks SAVE
    if (
      company === data.company &&
      currentPaid === data.currentPaid &&
      totalAmount === data.totalAmount &&
      dueDate === data.dueDate
    ) {
      onClose();
      return;
    }
    // if validation fails
    if (!validateForm()) {
      return;
    }

    // if there are no errors in the form
    updateMutation.mutate({
      ...data,
      company,
      currentPaid,
      totalAmount,
      dueDate,
    });
  };

  // simple form validation
  // TODO add a more robust validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};
    // set the errors state so that i can use it to show error messages
    if (!company.trim()) {
      newErrors.company = "Company is required.";
    }
    if (Number(currentPaid) < 0) {
      newErrors.amount = "Amount must be >= 0";
    }
    if (Number(totalAmount) < 0) {
      newErrors.amount = "Amount must be >= 0";
    }
    if (!dueDate) {
      newErrors.date = "Date is required";
    } else {
      // to check if the entered date is not a future date:
      const debtDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (debtDate < today) {
        newErrors.date = "Date cannot be in the past.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the form, this will return true
    // if there's at least one error, then it will return false
  }

  if (isError) <ErrorState message="An error has occured" />;

  return (
    <section
      className=" h-full flex items-center flex-col justify-evenly"
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
      <h2 className="text-xl font-semibold">Editing debt: {data?.company}</h2>

      <form
        className="flex flex-col items-center w-full max-w-xl justify-evenly gap-5 relative"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-between ">
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="company">Company</label>
            {/* error if the form validation fails */}
            {errors.company && (
              <span className="text-red-500 absolute right-5">
                {errors.company}
              </span>
            )}
            <input
              type="text"
              value={company}
              required
              maxLength={40}
              onChange={(e) => setCompany(e.target.value)}
              name="company"
              id="company"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-10"
            />
          </div>
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="currentPaid">Paid</label>
            {errors.currentPaid && (
              <span className="text-red-500 absolute right-5">
                {errors.currentPaid}
              </span>
            )}
            <input
              type="number"
              value={currentPaid}
              inputMode="decimal"
              onChange={(e) => setCurrentPaid(e.target.value)}
              name="currentPaid"
              id="currentPaid"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-10"
            />
          </div>
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="totalAmount">Total Owed</label>
            {errors.totalAmount && (
              <span className="text-red-500 absolute right-5">
                {errors.totalAmount}
              </span>
            )}
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              inputMode="decimal"
              name="totalAmount"
              id="totalAmount"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-10"
            />
          </div>
          <div className="flex relative justify-between">
            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="dueDate">Due Date</label>

              <input
                type="date"
                value={dueDate}
                required
                onChange={(e) => setDueDate(e.target.value)}
                name="dueDate"
                id="dueDate"
                className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-10"
              />
            </div>
          </div>
          {errors.date && (
            <span className="text-red-500 pl-12">{errors.date}</span>
          )}

          <div className="flex justify-evenly items-center self-center p-3 w-full mt-10">
            <button
              className="hover:text-red-600 flex items-center justify-center border-red-500 border-l border-r w-10 rounded-full h-10"
              aria-label="Cancel changes"
              disabled={isPending}
            >
              <MdClose size={20} />
            </button>
            <button
              className="hover:text-emerald-600 flex items-center justify-center border-l border-r border-emerald-600 w-10 rounded-full h-10"
              aria-label="Save changes"
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner /> : <MdCheck size={20} />}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
