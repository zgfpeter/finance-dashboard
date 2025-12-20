"use client";

// -- imports --
import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData, Goal } from "@/lib/types/dashboard";
import { MdClose, MdCheck } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

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
  const [targetDate, setTargetDate] = useState(data?.targetDate ?? "");

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    targetDate: "",
    title: "",
    currentAmount: "",
    targetAmount: "",
    generalError: "",
  });

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
    onError: (_err, _goal, context) => {
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
      title,
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
    } else {
      // to check if the entered date is not a future date:
      const goalDate = new Date(targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (goalDate < today) {
        newErrors.date = "Date cannot be in the past.";
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
      <h2 className="text-xl font-semibold">Editing goal: {data?.title}</h2>

      <form
        className="flex flex-col items-center w-full max-w-xl justify-evenly gap-5 relative"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-between ">
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="title">Title</label>
            {/* error if the form validation fails */}
            {errors.title && (
              <span className="text-red-500 absolute right-5">
                {errors.title}
              </span>
            )}
            <input
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              id="title"
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="currentAmount">Saved</label>
            {errors.currentAmount && (
              <span className="text-red-500 absolute right-5">
                {errors.currentAmount}
              </span>
            )}
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              name="currentAmount"
              id="currentAmount"
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col p-3 gap-3 relative">
            <label htmlFor="targetAmount">Target Amount</label>
            {errors.targetAmount && (
              <span className="text-red-500 absolute right-5">
                {errors.targetAmount}
              </span>
            )}
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              name="targetAmount"
              id="targetAmount"
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex relative justify-between">
            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="targetDate">Target Date</label>

              <input
                type="date"
                value={targetDate}
                required
                onChange={(e) => setTargetDate(e.target.value)}
                name="targetDate"
                id="targetDate"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-11  w-40"
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
