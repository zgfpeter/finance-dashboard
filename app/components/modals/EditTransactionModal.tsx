"use client";

// -- imports --
import React, { useState } from "react";
import {
  ExpenseCategory,
  Transaction,
  TransactionType,
} from "@/lib/types/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardData } from "@/lib/types/dashboard";
import { MdClose, MdCheck } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorState from "../ui/ErrorState";
// -- end imports --
// the props the component takes
interface Props {
  data: Transaction | null;
  onClose: () => void;
}

export default function EditTransactionModal({ data, onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const queryClient = useQueryClient();
  const [company, setCompany] = useState(data?.company ?? "");
  const [amount, setAmount] = useState(data?.amount ?? "");
  const [date, setDate] = useState(() => {
    if (!data?.date) return "";
    return new Date(data.date).toISOString().slice(0, 10);
  });
  const [transactionType, setTransactionType] = useState<TransactionType>(
    data?.transactionType ?? "expense"
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    data?.category ?? "other"
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    date: "",
    company: "",
    amount: "",
    transactionType: transactionType,
    category: "",
    generalError: "",
  });

  // tanstack mutation: PUT
  // this runs when i call mutate()
  const updateMutation = useMutation({
    // sends the update to the backend, doesn't wait to finish to update UI
    mutationFn: (updatedTransaction: Transaction) =>
      axiosAuth.put(
        `/dashboard/transactions/${updatedTransaction._id}`,
        updatedTransaction
      ),
    // runs immediately when i click 'Save"
    // this runs before the PUT request is send, i can do optimistic updates here
    // cancel queries: because maybe another refetch is happening at the same time
    // cancel it to avoid UI flickering or outdated data ( race conditions )
    onMutate: async (updatedTransaction: Transaction) => {
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
          transactions: old.transactions.map((c) =>
            c._id === updatedTransaction._id
              ? { ...c, ...updatedTransaction }
              : c
          ),
        };
      });

      // this is accessible in onError
      return { previous };
    },

    // runs after a successfull PUT
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      console.log("Success");
      onClose();
    },

    // if request fails: restore the old value (from previous)
    onError: (_err, _updatedTransaction, context) => {
      console.log("An error has occured: ", _err);
      queryClient.setQueryData(["dashboardData"], context?.previous);
    },

    // runs always, for refetch or cleanup
  });

  if (!data) return null;

  // get the states from the updateMutation
  const { isPending, isError, error } = updateMutation;

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
    updateMutation.mutate({
      ...data,
      company,
      amount,
      date,
      transactionType,
      category,
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
    if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be > 0";
    }
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      // to check if the entered date is not a future date:
      const transactionDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (transactionDate > today) {
        newErrors.date = "Date cannot be in the future.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the for, this will return true
    // if there's at least one error, then it will return false
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
      <h2 className="text-xl font-semibold">
        Editing transaction: {data?.company}
      </h2>

      {/* {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )} */}

      <form
        className="flex flex-col items-center w-full max-w-xl justify-evenly gap-5 relative"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-between ">
          <div>
            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="company">Company</label>
              {/* A general error if the form validation fails */}
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
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-10"
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
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-10"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 w-fit">
            <div className="flex flex-col gap-3">
              {errors.date && (
                <span className="text-red-500 flex items-center absolute">
                  {errors.date}
                </span>
              )}
              <label htmlFor="date">Date </label>

              <input
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
                name="date"
                id="date"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-10 iconColor"
              />
            </div>

            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="transactionType">Type</label>
              {/* {errors.type && (
                <span className="text-red-500">{errors.type}</span>
              )} */}
              <select
                id="transactionType"
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as TransactionType)
                }
                name="transactionTypes"
                required
                className="border border-(--secondary-blue) px-2 rounded h-10"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* TODO maybe add a recurring transaction, or subscription */}

            {transactionType === "expense" && (
              <div className="flex flex-col gap-3">
                <label htmlFor="category">Category</label>
                {/* {errors.type && (
                            <span className="text-red-500">{errors.type}</span>
                          )} */}
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ExpenseCategory)
                  }
                  name="category"
                  className="border border-(--secondary-blue) px-2 rounded h-10"
                >
                  <option value="subscription">Subscription</option>
                  <option value="bill">Bill</option>
                  <option value="tax">Tax</option>
                  <option value="insurance">Insurance</option>
                  <option value="loan">Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-evenly items-center self-center p-3 w-full mt-5">
          <button
            className="hover:text-red-600 flex items-center justify-center border-red-500 border-l border-r w-10 rounded-full h-10"
            disabled={isPending}
            aria-label="Cancel changes"
          >
            <MdClose size={20} />
          </button>
          <button
            className="hover:text-emerald-600 flex items-center justify-center border-l border-r border-emerald-600 w-10 rounded-full h-10"
            aria-label="Save changes"
            disabled={isPending}
            type="submit"
          >
            {isPending ? <LoadingSpinner /> : <MdCheck size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
