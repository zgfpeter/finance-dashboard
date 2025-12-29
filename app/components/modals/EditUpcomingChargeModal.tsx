"use client";

// -- imports --
import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DashboardData,
  UpcomingCharge,
  ExpenseCategory,
} from "@/lib/types/dashboard";
import { MdClose, MdCheck } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

// -- end imports --
// the props the component takes
interface Props {
  data: UpcomingCharge | null;
  onClose: () => void;
}

export default function EditUpcomingChargeModal({ data, onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [company, setCompany] = useState(data?.company ?? "");
  const [amount, setAmount] = useState(data?.amount ?? "");
  const [date, setDate] = useState(() => {
    if (!data?.date) return "";
    return new Date(data.date).toISOString().slice(0, 10);
  });

  const [category, setCategory] = useState<ExpenseCategory>(
    data?.category ?? "other"
  ); // Default category is Other
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    date: "",
    company: "",
    amount: "",
    category: "",
    generalError: "",
  });

  // tanstack mutation: PUT
  // this runs when i call mutate()
  const updateMutation = useMutation({
    // sends the update to the backend, doesn't wait to finish to update UI
    mutationFn: (updatedCharge: UpcomingCharge) =>
      axiosAuth.put(
        `/dashboard/upcomingCharges/${updatedCharge._id}`,
        updatedCharge
      ),
    // runs immediately when i click 'Save"
    // this runs before the PUT request is send, i can do optimistic updates here
    // cancel queries: because maybe another refetch is happening at the same time
    // cancel it to avoid UI flickering or outdated data ( race conditions )
    onMutate: async (updatedCharge: UpcomingCharge) => {
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
          upcomingCharges: old.upcomingCharges.map((c) =>
            c._id === updatedCharge._id ? { ...c, ...updatedCharge } : c
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
    onError: (_err, _updatedCharge, context) => {
      console.log("An error has occured: ", _err);
      queryClient.setQueryData(["dashboardData"], context?.previous);
    },
  });

  if (!data) return null;

  // handle the user SAVE
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if nothing changed and the user clicks SAVE
    if (
      company === data.company &&
      amount === data.amount &&
      date === data.date &&
      category === data.category
    ) {
      onClose();
      return;
    }
    // if validation fails
    if (!validateForm()) {
      return;
    }

    // if there are no errors in the form
    updateMutation.mutate({ ...data, company, amount, date, category });
  };

  // Same as AddTransaction, because i need a dropdown for the categories

  // simple form validation
  // TODO add a more robust validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};
    // set the errors state so that i can use it to show error messages
    if (!company.trim()) {
      newErrors.company = "Company is required.";
    }
    if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be > 0";
    }
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      // to check if the entered date is not a future date:
      const chargeDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chargeDate < today) {
        newErrors.date = "Upcoming charge date cannot be in the past.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the form, this will return true
    // if there's at least one error, then it will return false
  }

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
      <h2 className="text-xl font-semibold">Editing charge: {data?.company}</h2>

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
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="amount">Amount</label>
            {errors.amount && (
              <span className="text-red-500 absolute right-5">
                {errors.amount}
              </span>
            )}
            <input
              type="number"
              value={amount}
              inputMode="decimal"
              onChange={(e) => setAmount(e.target.value)}
              name="amount"
              id="amount"
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex relative">
            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="date">Date</label>

              <input
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
                name="date"
                id="date"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-11  w-40"
              />
            </div>
            {/* TODO maybe add a recurring charge, or subscription */}
            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="transactionType">Category</label>
              {/* {errors.type && (
                <span className="text-red-500">{errors.type}</span>
              )} */}
              <select
                id="transactionType"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                name="transactionTypes"
                required
                className="border border-(--secondary-blue) px-2 rounded h-11 flex min-w-40"
              >
                <option value="subscription">Subscription</option>
                <option value="bill">Bill</option>
                <option value="tax">Tax</option>
                <option value="insurance">Insurance</option>
                <option value="loan">Loan</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {errors.date && (
            <span className="text-red-500 pl-12">{errors.date}</span>
          )}

          <div className="flex justify-evenly items-center self-center p-3 w-full mt-10">
            <button
              className="hover:text-red-600 flex items-center justify-center border-red-500 border-l border-r w-10 rounded-full h-10"
              aria-label="Cancel changes"
            >
              <MdClose size={20} />
            </button>
            <button
              className="hover:text-emerald-600 flex items-center justify-center border-l border-r border-emerald-600 w-10 rounded-full h-10"
              aria-label="Save changes"
            >
              <MdCheck size={20} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
