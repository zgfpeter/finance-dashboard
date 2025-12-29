"use client";
import { useState } from "react";
import { ExpenseCategory, Transaction } from "@/lib/types/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useDashboard } from "@/app/hooks/useDashboard";
interface Props {
  onClose: () => void;
}
export default function AddTransactionModal({ onClose }: Props) {
  const accounts = useDashboard().data?.accounts;
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();
  // local state for creating a new transaction
  const [data, setData] = useState<Transaction>({
    date: "",
    company: "",
    amount: "",
    transactionType: "expense",
    category: "other",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // holds validation error messages, ex. a required field is empty
    id: "",
    date: "",
    company: "",
    amount: "",
    transactionType: "expense",
    category: "",
    generalError: "",
  });

  // displays a success message if the transaction has been added successfully
  const [transactionAdded, setTransactionAdded] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // handle change in input
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // simple form validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};
    // set the errors state so that it can use it to show error messages
    if (!data.company.trim()) {
      newErrors.company = "Company is required.";
    }
    if (Number(data.amount) <= 0) {
      newErrors.amount = "Amount must be > 0";
    }
    if (!data.date) {
      newErrors.date = "Date is required";
    } else {
      // to check if the entered date is not a future date:
      const transactionDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (transactionDate > today) {
        newErrors.date = "Transaction date cannot be in the future.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the for, this will return true
    // if there's at least one error, then it will return false
  }

  // tanstack query mutation to POST a new transaction
  const addMutation = useMutation({
    mutationFn: (payload: Transaction) =>
      axiosAuth.post(`/dashboard/transactions`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      // when invalidateQueries is called, tanstack query sees that and automatically runs the query again, gets fresh data, updates UI everywhere. Critical for fresh UI data updates
    },
  });

  // handles the submit, checks if form is valid, then calls mutation
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    addMutation.mutate({
      ...data,
      amount: Number(data.amount), // change the amount to a number, as it can be string also
    });

    // reset form data
    setData({
      date: "",
      company: "",
      amount: "",
      transactionType: "expense",
      category: "other",
    });

    // closes the modal
    onClose();
  }

  return (
    <div
      className=" h-full flex items-center flex-col justify-evenly "
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
      <h2 id="modal-title" className="text-xl font-semibold">
        Add a new transaction
      </h2>

      {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )}

      <form
        className="flex flex-col items-center w-full max-w-xl justify-evenly relative h-full"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col  h-full justify-evenly ">
          <div className="flex flex-col gap-3 relative">
            <label htmlFor="company">Company</label>
            {/* A general error if the form validation fails */}
            {errors.company && (
              <span
                id="company-error"
                className="text-red-500 absolute right-5"
              >
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
              aria-describedby="company-error"
            />
          </div>

          <div className="flex flex-col gap-3 relative">
            <label htmlFor="amount">Amount</label>
            {errors.amount && (
              <span id="amount-error" className="text-red-500 absolute right-5">
                {errors.amount}
              </span>
            )}
            <input
              type="number"
              value={data.amount}
              onChange={handleChange}
              inputMode="decimal"
              name="amount"
              id="amount"
              className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
              aria-describedby="amount-error"
            />
          </div>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 relative gap-3 items-center justify-between `}
          >
            <div className="flex flex-col gap-3 relative">
              <label htmlFor="date">Date</label>

              <input
                type="date"
                value={data.date}
                required
                onChange={handleChange}
                name="date"
                id="date"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-11 iconColor w-full"
                aria-describedby="date-error"
              />
            </div>

            <div className=" flex flex-col gap-3 ">
              <label htmlFor="transactionType">Type</label>
              {/* {errors.type && (
                <span className="text-red-500">{errors.type}</span>
              )} */}
              <select
                id="transactionType"
                value={data.transactionType}
                onChange={handleChange}
                name="transactionType"
                required
                className="border border-(--secondary-blue) px-2 rounded h-11 flex w-full"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            {data.transactionType === "expense" ? (
              <div className="flex flex-col gap-3 relative">
                <label htmlFor="transactionCategory">Category</label>
                {/* {errors.type && (
                            <span className="text-red-500">{errors.type}</span>
                          )} */}
                <select
                  id="transactionCategory"
                  value={data.category}
                  onChange={handleChange}
                  name="category"
                  required
                  className="border border-(--secondary-blue) px-2 rounded h-11 flex w-full"
                >
                  <option value="subscription">Subscription</option>
                  <option value="bill">Bill</option>
                  <option value="tax">Tax</option>
                  <option value="insurance">Insurance</option>
                  <option value="loan">Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-3 relative">
                <label htmlFor="accountType">Select Account</label>
                <select
                  id="accountType"
                  className="border border-(--secondary-blue) px-2 rounded h-11 flex w-full"
                >
                  {accounts?.map((account, index) => (
                    <option value={account.type} key={index}>
                      {account.type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="border p-3 rounded w-50 relative z-0  hover:border-teal-500 self-center"
            aria-label="Add transaction"
          >
            {transactionAdded && (
              <div className="border p-3 rounded w-50 absolute z-10 bg-emerald-900 top-0 left-0 ">
                Success
              </div>
            )}
            <span>Add Transaction</span>
          </button>
        </div>
      </form>
    </div>
  );
}
