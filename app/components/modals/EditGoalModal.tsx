"use client";

// -- imports --
import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData, Goal } from "@/lib/types/dashboard";
import { MdClose, MdCheck } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";

// -- end imports --
// the props the component takes
interface Props {
  data: Goal | null;
  onClose: () => void;
}

export default function EditGoalModal({ data, onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(data?.title ?? "");
  const [currentAmount, setCurrentAmount] = useState(data?.currentAmount ?? "");
  const [targetAmount, setTargetAmount] = useState(data?.targetAmount ?? "");
  const [targetDate, setTargetDate] = useState(() => {
    if (!data?.targetDate) return "";
    return new Date(data?.targetDate).toISOString().slice(0, 10);
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    targetDate: "",
    title: "",
    currentAmount: "",
    targetAmount: "",
    generalError: "",
  });

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

  // tanstack mutation: PUT
  // this runs when i call mutate()
  const updateMutation = useMutation({
    // sends the update to the backend, doesn't wait to finish to update UI
    mutationFn: (goal: Goal) =>
      axiosAuth.put(`/dashboard/goals/${goal._id}`, goal),
    // runs immediately when i click 'Save"
    // this runs before the PUT request is send, i can do optimistic updates here
    // cancel queries: because maybe another refetch is happening at the same time
    // cancel it to avoid UI flickering or outdated data ( race conditions )
    onMutate: async (goal: Goal) => {
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
          goals: old.goals.map((c) =>
            c._id === goal._id ? { ...c, ...goal } : c
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
  const { isPending, isError } = updateMutation;

  // handle the user SAVE
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if nothing changed and the user clicks SAVE
    if (
      title === data.title &&
      currentAmount === data.currentAmount &&
      targetAmount === data.targetAmount &&
      targetDate === data.targetDate
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
      title: sanitizeText(title),
      currentAmount,
      targetAmount,
      targetDate,
    });
  };

  // simple form validation
  // TODO add a more robust validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};
    // set the errors state so that i can use it to show error messages
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (Number(currentAmount) < 0) {
      newErrors.amount = "Amount must be >= 0";
    }
    if (Number(targetAmount) < 0) {
      newErrors.amount = "Amount must be >= 0";
    }
    if (!targetDate) {
      newErrors.date = "Date is required";
      // it's fine if date it's in the past, give users that option
      // } else {
      //   // to check if the entered date is not a future date:
      //   const goalDate = new Date(targetDate);
      //   const today = new Date();
      //   today.setHours(0, 0, 0, 0);
      //   if (goalDate < today) {
      //     newErrors.date = "Date cannot be in the past.";
      //   }
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
        className="absolute text-xl text-red-500 right-10 top-4"
        aria-label="Close modal"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold">Editing goal: {data?.title}</h2>

      <form
        className="relative flex flex-col items-center w-full max-w-xl gap-5 justify-evenly"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full ">
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            {/* error if the form validation fails */}
            {errors.title && (
              <span className="absolute text-red-500 right-5">
                {errors.title}
              </span>
            )}
            <input
              type="text"
              value={title}
              required
              maxLength={40}
              onChange={(e) => setTitle(sanitizeText(e.target.value))}
              name="title"
              id="title"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="currentAmount">Current amount</label>
            {errors.currentAmount && (
              <span className="absolute text-red-500 right-5">
                {errors.currentAmount}
              </span>
            )}
            <input
              type="text"
              value={currentAmount}
              inputMode="decimal"
              placeholder="0.00"
              onChange={(e) =>
                setCurrentAmount(sanitizeDecimalInput(e.target.value))
              }
              name="currentAmount"
              id="currentAmount"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>
          <div className="relative flex flex-col gap-3 p-3">
            <label htmlFor="targetAmount">Target amount</label>
            {errors.targetAmount && (
              <span className="absolute text-red-500 right-5">
                {errors.targetAmount}
              </span>
            )}
            <input
              type="text"
              value={targetAmount}
              inputMode="decimal"
              placeholder="0.00"
              onChange={(e) =>
                setTargetAmount(sanitizeDecimalInput(e.target.value))
              }
              name="targetAmount"
              id="targetAmount"
              className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
            />
          </div>
          <div className="relative flex justify-between">
            <div className="relative flex flex-col gap-3 p-3">
              <label htmlFor="targetDate">
                Target date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                value={targetDate}
                required
                onChange={(e) => setTargetDate(e.target.value)}
                name="targetDate"
                id="targetDate"
                className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
              />
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
