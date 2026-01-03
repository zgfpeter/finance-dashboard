"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Debt } from "@/lib/types/dashboard";

import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
interface Props {
  onClose: () => void;
}

export default function AddDebtModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const [data, setData] = useState<Debt>({
    company: "",
    currentPaid: "",
    totalAmount: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    company: "",
    currentPaid: "",
    totalAmount: "",
    dueDate: "",
  });

  // boolean used to show a success message after the charge has been added successfully
  const [debtAdded, setdebtAdded] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // handle the input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // simple form validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};
    // set the errors state so that i can use it to show error messages
    if (!data.company.trim()) {
      newErrors.company = "Company is required.";
    }
    if (Number(data.currentPaid) < 0) {
      newErrors.amount = "Current paid amount must be >= 0";
    }
    if (Number(data.totalAmount) < 0) {
      newErrors.amount = "Total amount must be >= 0";
    }
    if (!data.dueDate) {
      newErrors.date = "Date is required";

      // it's fine if date is in the past, give users that flexibility
      // } else {
      // to check if the entered date is not a future date:
      //const debtDate = new Date(data.dueDate);
      //const today = new Date();
      //today.setHours(0, 0, 0, 0);

      // if (debtDate < today) {
      //   newErrors.date = "Date cannot be in the past.";
      // }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the for, this will return true
    // if there's at least one error, then it will return false
  }

  const addMutation = useMutation({
    mutationFn: (payload: Debt) => axiosAuth.post(`/dashboard/debts`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      // when i cal invalidateQueries, tanstack query sees that and automatically runs the query again, gets fresh data, updates UI everywhere. Critical if i want fresh UI data updates
    },
  });

  if (!data) return <ErrorState message="No data" />;

  // get the states from the updateMutation
  const { isPending, isError } = addMutation;

  // handle the submit: check if form is valid, then call the mutate method that makes the POST request
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    // calls the tanstack query POST
    addMutation.mutate({
      ...data,
      currentPaid: Number(data.currentPaid),
      totalAmount: Number(data.totalAmount),
      // change the amount to a number, as it can be string also
    });

    // reset form data
    setData({
      dueDate: "",
      company: "",
      currentPaid: "",
      totalAmount: "",
    });
    setdebtAdded(true);
    // closes the modal
    onClose();
  }

  if (isError) <ErrorState message="An error has occured" />;

  return (
    <div
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
      <h2 className="text-xl font-semibold">Add a new debt</h2>

      {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )}

      <form
        className="flex flex-col items-center w-full max-w-xl justify-evenly gap-5 relative"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-between  ">
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="company">Title</label>
            {/* A general error if the form validation fails */}
            {errors.company && (
              <span className="text-red-500 absolute right-5">
                {errors.company}
              </span>
            )}
            <input
              type="text"
              value={data.company}
              required
              maxLength={40}
              onChange={handleChange}
              name="company"
              id="company"
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex">
            <div className="flex flex-col p-3 gap-3 relative w-1/2">
              <label htmlFor="currentpaid">Paid Amount</label>
              {errors.paidAmount && (
                <span className="text-red-500 absolute right-5">
                  {errors.paidAmount}
                </span>
              )}
              <input
                type="number"
                value={data.currentPaid}
                onChange={handleChange}
                inputMode="decimal"
                name="currentPaid"
                id="currentPaid"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex flex-col p-3 gap-3 relative w-1/2">
              <label htmlFor="totalAmount">Total Amount</label>
              {errors.totalAmount && (
                <span className="text-red-500 absolute right-5">
                  {errors.totalAmount}
                </span>
              )}
              <input
                type="number"
                value={data.totalAmount}
                onChange={handleChange}
                inputMode="decimal"
                name="totalAmount"
                id="totalAmount"
                className="border border-(--secondary-blue) rounded p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex flex-col p-3 gap-3 relative w-1/2">
            <label htmlFor="dueDate">Due Date</label>

            <input
              type="date"
              value={data.dueDate}
              required
              onChange={handleChange}
              name="dueDate"
              id="dueDate"
              className="border border-(--secondary-blue) rounded  pl-1 focus:outline-none focus:border-cyan-500 h-11 iconColor"
            />
          </div>

          {errors.date && (
            <span className="text-red-500 pl-12">{errors.date}</span>
          )}
        </div>

        <button
          type="submit"
          className="border p-3 rounded w-50 relative z-0  hover:border-teal-500"
          aria-label="Add new charge"
        >
          {debtAdded && (
            <div className="border p-3 rounded w-50 absolute z-10 bg-emerald-900 top-0 left-0 ">
              Success
            </div>
          )}
          {isPending ? <LoadingSpinner /> : <span>Add New Debt</span>}
        </button>
      </form>
    </div>
  );
}
