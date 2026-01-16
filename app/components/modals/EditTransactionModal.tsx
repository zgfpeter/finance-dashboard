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
      <h2 className="text-xl font-semibold">
        Editing transaction: {data?.company}
      </h2>

      {/* {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )} */}

      <form
        className="relative flex flex-col items-center w-full max-w-xl gap-5 justify-evenly"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full ">
          <div>
            <div className="relative flex flex-col gap-3 p-3">
              <label htmlFor="company">
                Company <span className="text-red-500">*</span>
              </label>
              {/* A general error if the form validation fails */}
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
                onChange={(e) =>
                  setAmount(sanitizeDecimalInput(e.target.value))
                }
                name="amount"
                id="amount"
                className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 w-fit">
            <div className="flex flex-col gap-3">
              {errors.date && (
                <span className="absolute flex items-center text-red-500">
                  {errors.date}
                </span>
              )}
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
                className="border border-(--secondary-blue) rounded-md p-2  focus:outline-none focus:border-cyan-500 h-11 iconColor"
              />
            </div>

            <div className="relative flex flex-col gap-3 p-3">
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
                className="border border-(--secondary-blue) px-2 rounded-md h-11"
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
                  className="border border-(--secondary-blue) px-2 rounded-md h-11"
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

        <div className="flex items-center self-center w-full p-3 mt-5 justify-evenly">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 border-l border-r border-red-500 rounded-full hover:text-red-600"
            disabled={isPending}
            aria-label="Cancel changes"
            onClick={onClose}
          >
            <MdClose size={20} />
          </button>
          <button
            className="flex items-center justify-center w-10 h-10 border-l border-r rounded-full hover:text-emerald-600 border-emerald-600"
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
