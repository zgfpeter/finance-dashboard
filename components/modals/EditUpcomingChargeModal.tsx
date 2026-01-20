"use client";

// -- imports --
import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DashboardData,
  UpcomingCharge,
  ExpenseCategory,
} from "@/lib/types/dashboard";
import { MdClose, MdCheck } from "react-icons/md";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";

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
    data?.category ?? "other",
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
        updatedCharge,
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
            c._id === updatedCharge._id ? { ...c, ...updatedCharge } : c,
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

  if (!data) return <ErrorState message="No data" />;
  function sanitizeDecimalInput(value: string) {
    let sanitized = value.replace(",", "."); // mobile / EU keyboards
    sanitized = sanitized.replace(/[^0-9.]/g, ""); // keep digits + dot

    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }

    if (sanitized.startsWith(".")) {
      sanitized = "0" + sanitized;
    }

    return sanitized;
  }

  function sanitizeText(value: string) {
    return value.replace(/\s+/g, " ").trim();
  }

  // get the states from the updateMutation
  const { isPending, isError } = updateMutation;

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

  if (isError) <ErrorState message="An error has occured" />;

  return (
    <section
      className="flex flex-col items-center h-full justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute text-xl text-red-500 right-5 top-3"
        aria-label="Close modal"
      >
        ✕
      </button>
      <h2 className="py-2 text-xl font-semibold">
        Editing charge: {data?.company}
      </h2>

      <form
        className="relative flex flex-col items-center w-full max-w-xl py-5 justify-evenly"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full ">
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="company">
              Company <span className="text-red-500">*</span>
            </label>
            {/* error if the form validation fails */}
            {errors.company && (
              <span className="absolute text-red-500 right-5">
                {errors.company}
              </span>
            )}
            <input
              type="text"
              value={company}
              required
              maxLength={40}
              onChange={(e) => setCompany(sanitizeText(e.target.value))}
              name="company"
              id="company"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="amount">Amount</label>
            {errors.amount && (
              <span className="absolute text-red-500 right-5">
                {errors.amount}
              </span>
            )}
            <input
              type="text"
              value={amount}
              inputMode="decimal"
              onChange={(e) => setAmount(sanitizeDecimalInput(e.target.value))}
              name="amount"
              id="amount"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>
          <div className="relative flex">
            <div className="relative flex flex-col gap-3 p-3">
              <label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
                name="date"
                id="date"
                className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11  w-40"
              />
            </div>
            {/* TODO maybe add a recurring charge, or subscription */}
            <div className="relative flex flex-col gap-3 p-3">
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
                className="border border-(--secondary-blue) px-2 rounded-md h-11 flex min-w-40"
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
            <span className="pl-12 text-red-500">{errors.date}</span>
          )}

          <div className="flex items-center self-center w-full p-3 mt-10 justify-evenly">
            <button
              className="flex items-center justify-center w-10 h-10 border-l border-r border-red-500 rounded-full hover:text-red-600"
              aria-label="Cancel changes"
              disabled={isPending}
              onClick={onClose}
              type="button"
            >
              <MdClose size={20} />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 border-l border-r rounded-full hover:text-emerald-600 border-emerald-600"
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
