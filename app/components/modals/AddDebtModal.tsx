"use client";

// imports
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Debt } from "@/lib/types/dashboard";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import SeparatorLine from "../ui/SeparatorLine";
import { MdCheck } from "react-icons/md";

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
    company: "",
    currentPaid: "",
    totalAmount: "",
    dueDate: "",
  });

  // boolean used to show a success message after the debt has been added successfully
  const [debtAdded, setdebtAdded] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // handle the input change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setData((prev) => {
      // sanitize amount input (mobile keyboards may use commas)
      if (name === "amount") {
        const sanitized = value
          .replace(",", ".") // allow european decimal separator
          .replace(/[^0-9.]/g, "") // remove letters, currency symbols, spaces
          .replace(/(\..*)\./g, "$1"); // prevent more than one dot

        return {
          ...prev,
          amount: sanitized,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  // simple form validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    // set the errors state so that i can use it to show error messages
    if (!data.company.trim()) {
      newErrors.company = "Company is required.";
    }

    if (Number(data.currentPaid) < 0) {
      newErrors.currentPaid = "Current paid amount must be ≥ 0";
    }

    if (Number(data.totalAmount) < 0) {
      newErrors.totalAmount = "Total amount must be ≥ 0";
    }

    if (!data.dueDate) {
      newErrors.dueDate = "Date is required";

      // it's fine if date is in the past, give users that flexibility
      // } else {
      // to check if the entered date is not a future date:
      //const debtDate = new Date(data.dueDate);
      //const today = new Date();
      //today.setHours(0, 0, 0, 0);E

      // if (debtDate < today) {
      //   newErrors.dueDate = "Date cannot be in the past.";
      // }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the form, this will return true
    // if there's at least one error, then it will return false
  }

  const addMutation = useMutation({
    mutationFn: (payload: Debt) => axiosAuth.post(`/dashboard/debts`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      // when i call invalidateQueries, tanstack query sees that and automatically runs the query again,
      // gets fresh data, updates UI everywhere. Critical if i want fresh UI data updates
    },
  });

  // if there's no data, return error message
  if (!data) return <ErrorState message="No data" />;

  // get the states from the updateMutation
  const { isPending, isError } = addMutation;

  // if an error occured, return error message
  if (isError) {
    return <ErrorState message="An error has occured" />;
  }

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

  return (
    <div
      className="flex flex-col items-center h-full justify-evenly"
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
      {/* heading */}
      <h2 className="text-xl font-semibold">Add a new debt</h2>

      <form
        className="relative flex flex-col items-center w-full max-w-xl gap-5 justify-evenly"
        id="addDebt"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full">
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="company">
              Title <span className="text-red-500">*</span>
            </label>

            {/* A general error if the form validation fails */}
            {errors.company && (
              <span className="absolute text-red-500 right-5">
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
              className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>

          <div className="flex">
            <div className="relative flex flex-col w-1/2 gap-3 p-3">
              <label htmlFor="currentPaid">Paid amount</label>

              {errors.currentPaid && (
                <span className="absolute text-red-500 right-5">
                  {errors.currentPaid}
                </span>
              )}

              <input
                type="text"
                value={data.currentPaid}
                onChange={handleChange}
                inputMode="decimal"
                name="currentPaid"
                id="currentPaid"
                className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 h-11"
              />
            </div>

            <div className="relative flex flex-col w-1/2 gap-3 p-3">
              <label htmlFor="totalAmount">Total amount</label>

              {errors.totalAmount && (
                <span className="absolute text-red-500 right-5">
                  {errors.totalAmount}
                </span>
              )}

              <input
                type="text"
                value={data.totalAmount}
                onChange={handleChange}
                inputMode="decimal"
                name="totalAmount"
                placeholder="0.00"
                id="totalAmount"
                className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 h-11"
              />
            </div>
          </div>

          <div className="relative flex flex-col w-1/2 gap-3 p-3">
            <label htmlFor="dueDate">
              Due date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={data.dueDate}
              required
              onChange={handleChange}
              name="dueDate"
              id="dueDate"
              className="border border-(--secondary-blue) rounded-md px-1 focus:outline-none focus:border-cyan-500 h-11 iconColor"
            />
          </div>

          {errors.dueDate && (
            <span className="pl-12 text-red-500">{errors.dueDate}</span>
          )}
        </div>
      </form>

      <SeparatorLine width="3/4" />

      {/* Submit button is outside the form, so i need to bind it explicitly using the form id */}
      <button
        type="submit"
        form="addDebt"
        className="relative border rounded-md px-6 py-3 min-w-[180px] grid place-items-center hover:border-teal-500 disabled:opacity-70"
        aria-label="Add new debt"
      >
        <span
          className={`transition-opacity ${
            isPending ? "opacity-0" : "opacity-100"
          }`}
        >
          Add debt
        </span>

        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {/* Success overlay */}
        {debtAdded && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 text-white rounded-md bg-emerald-900">
            Success <MdCheck />
          </div>
        )}
      </button>
    </div>
  );
}
