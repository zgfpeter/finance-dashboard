"use client";
// imports
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { MdCheck } from "react-icons/md";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import SeparatorLine from "../ui/SeparatorLine";
import {
  AccountType,
  ExpenseCategory,
  TransactionType,
} from "@/lib/types/dashboard";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";

// Form state interface matching your Transaction type but with strings for inputs
export interface TransactionForm {
  date: string;
  company: string;
  amount: string; // string input
  transactionType: TransactionType;
  category: ExpenseCategory;
  account: AccountType;
}

// Payload expected by backend
interface CreateTransactionPayload {
  date: string;
  company: string;
  amount: number;
  transactionType: TransactionType;
  category: ExpenseCategory;
  account: AccountType;
}

const INITIAL_STATE: TransactionForm = {
  date: "",
  company: "",
  amount: "",
  transactionType: "expense",
  category: "other",
  account: "checking", // default account
};

interface Props {
  onClose: () => void;
}

export default function AddTransactionModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: session } = useSession(); // Access user currency if needed later

  const [data, setData] = useState<TransactionForm>({ ...INITIAL_STATE });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    company: "",
    amount: "",
    date: "",
    generalError: "",
  });

  const [transactionAdded, setTransactionAdded] = useState<boolean>(false);

  // handle the input change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setData((prev) => {
      const key = name as keyof TransactionForm;

      // Handle Amount formatting (same as upcoming charge)
      if (key === "amount") {
        const sanitized = value
          .replace(",", ".")
          .replace(/[^0-9.]/g, "")
          .replace(/(\..*)\./g, "$1");

        return { ...prev, amount: sanitized };
      }

      return { ...prev, [key]: value };
    });
  }

  // simple form validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!data.company.trim()) {
      newErrors.company = "Company is required.";
    }

    if (Number(data.amount) <= 0) {
      newErrors.amount = "Amount must be > 0";
    }

    if (!data.date) {
      newErrors.date = "Date is required";
    } else {
      // Transactions CAN be in the past, but usually not future (up to you)
      // Removing future check if you want to allow planning ahead
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const addMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      axiosAuth.post(`/dashboard/transactions`, payload),

    onSuccess: () => {
      // show success briefly, invalidate, then close
      setTransactionAdded(true);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

      setTimeout(() => {
        setTransactionAdded(false);
        setData({ ...INITIAL_STATE }); // reset form
        onClose();
      }, 700);
    },

    onError: (err: AxiosError<{ message?: string }>) => {
      setErrors((prev) => ({
        ...prev,
        generalError:
          err.response?.data?.message || "Failed to add transaction",
      }));
    },
  });

  const { isPending, isError } = addMutation;

  // handle submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: CreateTransactionPayload = {
      date: data.date,
      company: data.company.trim(),
      amount: Number(data.amount),
      transactionType: data.transactionType,
      category: data.category,
      account: data.account,
    };

    addMutation.mutate(payload);
  }

  if (isError) {
    return <ErrorState message="An error has occurred" />;
  }

  return (
    <div
      className="flex flex-col items-center h-full justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={() => {
          setData({ ...INITIAL_STATE });
          onClose();
        }}
        className="absolute text-xl text-red-500 right-10 top-4"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold">Add a new transaction</h2>

      {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )}

      <form
        className="flex flex-col w-full gap-5"
        onSubmit={handleSubmit}
        id="addTransaction"
      >
        <div className="grid grid-cols-1 gap-3 px-2 py-1 md:grid-cols-2">
          <div className="flex flex-col gap-1 ">
            <label htmlFor="company">
              Company <span className="text-red-500">*</span>
            </label>
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
              className="border border-(--secondary-blue) rounded-md p-2 h-11"
            />
          </div>

          <div className="flex flex-col gap-1 ">
            <label htmlFor="amount">Amount</label>
            {errors.amount && (
              <span className="absolute text-red-500 right-5">
                {errors.amount}
              </span>
            )}
            <input
              type="text"
              value={data.amount}
              inputMode="decimal"
              onChange={handleChange}
              placeholder="0.00"
              name="amount"
              id="amount"
              className="border border-(--secondary-blue) rounded-md p-2 h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-2 py-1 md:grid-cols-4">
          <div className="flex flex-col gap-1 ">
            <label htmlFor="date">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.date}
              required
              onChange={handleChange}
              name="date"
              id="date"
              className="border border-(--secondary-blue) rounded-md px-1 h-11"
            />
          </div>

          <div className="flex flex-col gap-1 ">
            <label htmlFor="transactionType">Type</label>
            <select
              id="transactionType"
              value={data.transactionType}
              onChange={handleChange}
              name="transactionType"
              className="border border-(--secondary-blue) px-1 rounded-md h-11"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 ">
            <label htmlFor="account">Account</label>
            <select
              id="account"
              value={data.account}
              onChange={handleChange}
              name="account"
              required
              className="border border-(--secondary-blue) px-1 rounded-md h-11"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {/* Only show category if expense */}
          {data.transactionType === "expense" && (
            <div className="flex flex-col gap-1 ">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={data.category}
                onChange={handleChange}
                name="category"
                className="border border-(--secondary-blue) px-1 rounded-md h-11"
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

        {errors.date && (
          <span className="pl-12 text-red-500">{errors.date}</span>
        )}
      </form>

      <SeparatorLine width="3/4" />

      <button
        type="submit"
        form="addTransaction"
        disabled={isPending}
        aria-label="Add new transaction"
        className="
          relative
          border
          border-(--secondary-blue)
          rounded-md
          px-6
          py-3
          min-w-[180px]
          grid
          place-items-center
          hover:border-teal-500
          disabled:opacity-70
        "
      >
        <span
          className={`transition-opacity ${
            isPending ? "opacity-0" : "opacity-100"
          }`}
        >
          Add transaction
        </span>

        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {transactionAdded && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 text-white rounded-md bg-emerald-900 ">
            Success <MdCheck />
          </div>
        )}
      </button>
    </div>
  );
}
