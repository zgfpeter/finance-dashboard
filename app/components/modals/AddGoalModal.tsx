"use client";

// imports
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Goal } from "@/lib/types/dashboard";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import { MdCheck } from "react-icons/md";
import SeparatorLine from "../ui/SeparatorLine";
interface Props {
  onClose: () => void;
}

export default function AddGoalModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<Goal>({
    title: "",
    targetDate: "",
    currentAmount: "",
    targetAmount: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    title: "",
    targetDate: "",
    currentAmount: "",
    targetAmount: "",
  });
  // boolean used to show a success message after the goal has been added successfully
  const [goalAdded, setGoalAdded] = useState<boolean>(false);
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
    if (!data.title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (Number(data.currentAmount) < 0) {
      newErrors.amount = "Current amount must be >= 0";
    }
    if (Number(data.targetAmount) < 0) {
      newErrors.amount = "Total amount must be >= 0";
    }
    if (!data.targetDate) {
      newErrors.date = "Date is required";
      // its fine if date is in the past
      // } else {
      //   // to check if the entered date is not a future date:
      //   const debtDate = new Date(data.targetDate);
      //   const today = new Date();
      //   today.setHours(0, 0, 0, 0);
      //   if (debtDate < today) {
      //     newErrors.date = "Date cannot be in the past.";
      //   }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the for, this will return true
    // if there's at least one error, then it will return false
  }

  const addMutation = useMutation({
    mutationFn: (payload: Goal) => axiosAuth.post(`/dashboard/goals`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      // when i cal invalidateQueries, tanstack query sees that and automatically runs the query again, gets fresh data, updates UI everywhere. Critical if i want fresh UI data updates
    },
  });

  const { isPending, isError } = addMutation;

  // handle the submit: check if form is valid, then call the mutate method that makes the POST request
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    // calls the tanstack query POST
    addMutation.mutate({
      ...data,
      currentAmount: Number(data.currentAmount),
      targetAmount: Number(data.targetAmount),
      // change the amount to a number, as it can be string also
    });

    // reset form data
    setData({
      targetDate: "",
      title: "",
      currentAmount: "",
      targetAmount: "",
    });
    setGoalAdded(true);
    // closes the modal
    onClose();
  }

  // if error occured, return error message
  if (isError) <ErrorState message="An error has occured" />;

  return (
    <div
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
      <h2 className="py-2 text-xl font-semibold">Add a new goal</h2>

      {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )}

      <form
        className="relative flex flex-col items-center w-full max-w-xl py-5 justify-evenly"
        id="addGoal"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full ">
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            {/* A general error if the form validation fails */}
            {errors.title && (
              <span className="absolute text-red-500 right-5">
                {errors.title}
              </span>
            )}
            <input
              type="text"
              value={data.title}
              required
              maxLength={40}
              onChange={handleChange}
              name="title"
              id="title"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>
          <div className="flex">
            <div className="relative flex flex-col w-1/2 gap-3 p-3">
              <label htmlFor="currentAmount">Current amount</label>
              {errors.currentAmount && (
                <span className="absolute text-red-500 right-5">
                  {errors.currentAmount}
                </span>
              )}
              <input
                type="text"
                value={data.currentAmount}
                inputMode="decimal"
                placeholder="0.00"
                onChange={handleChange}
                name="currentAmount"
                id="currentAmount"
                className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
              />
            </div>
            <div className="relative flex flex-col w-1/2 gap-3 p-3">
              <label htmlFor="targetAmount">Target amount</label>
              {errors.targetAmount && (
                <span className="absolute text-red-500 right-5">
                  {errors.targetAmount}
                </span>
              )}
              <input
                type="text"
                value={data.targetAmount}
                onChange={handleChange}
                inputMode="decimal"
                placeholder="0.00"
                name="targetAmount"
                id="targetAmount"
                className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 h-11"
              />
            </div>
          </div>
          <div className="relative flex flex-col w-1/2 gap-3 p-3">
            <label htmlFor="targetDate">
              Target date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={data.targetDate}
              required
              onChange={handleChange}
              name="targetDate"
              id="targetDate"
              className="border border-(--secondary-blue) rounded-md  px-1 focus:outline-none focus:border-cyan-500 h-11 iconColor"
            />
          </div>

          {errors.date && (
            <span className="pl-12 text-red-500">{errors.date}</span>
          )}
        </div>
      </form>
      <SeparatorLine width="3/4" />
      <button
        type="submit"
        form="addGoal"
        className="relative border rounded-md px-6 py-3 min-w-[180px] grid place-items-center hover:border-teal-500 disabled:opacity-70 mb-5"
        aria-label="Add new goal"
        disabled={isPending}
      >
        <span
          className={`transition-opacity ${
            isPending ? "opacity-0" : "opacity-100"
          }`}
        >
          Add goal
        </span>
        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {goalAdded && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 text-white rounded-md bg-emerald-900 ">
            Success <MdCheck />
          </div>
        )}
      </button>
    </div>
  );
}
