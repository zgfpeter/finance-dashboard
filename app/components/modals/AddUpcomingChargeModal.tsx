"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpcomingCharge } from "@/lib/types/dashboard";
import { MdEventRepeat } from "react-icons/md";

import useAxiosAuth from "@/app/hooks/useAxiosAuth";
interface Props {
  onClose: () => void;
}

export default function AddUpcomingChargeModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const [data, setData] = useState<UpcomingCharge>({
    date: "",
    company: "",
    amount: "",
    category: "bill",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    // this will hold the error messages, like if amount is empty, it will show "Enter amount" or something like that
    id: "",
    date: "",
    company: "",
    amount: "",
    generalError: "",
  });

  // boolean used to show a success message after the charge has been added successfully
  const [chargeAdded, setChargeAdded] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // handle the input change
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
    // set the errors state so that i can use it to show error messages
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
      const chargeDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chargeDate < today) {
        newErrors.date = "Upcoming charge date cannot be in the past.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the for, this will return true
    // if there's at least one error, then it will return false
  }

  const addMutation = useMutation({
    mutationFn: (payload: UpcomingCharge) =>
      axiosAuth.post(`/dashboard/upcomingCharges`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      // when i cal invalidateQueries, tanstack query sees that and automatically runs the query again, gets fresh data, updates UI everywhere. Critical if i want fresh UI data updates
    },
  });

  // handle the submit: check if form is valid, then call the mutate method that makes the POST request
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    // calls the tanstack query POST
    addMutation.mutate({
      ...data,
      amount: Number(data.amount), // change the amount to a number, as it can be string also
    });

    // reset form data
    setData({
      date: "",
      company: "",
      amount: "",
      category: "bill", // default category is Bill
    });

    // closes the modal
    onClose();
  }

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
      <h2 className="text-xl font-semibold">Add a new upcoming charge</h2>

      {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )}

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
                value={data.company}
                required
                maxLength={40}
                onChange={handleChange}
                name="company"
                id="company"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
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
                value={data.amount}
                onChange={handleChange}
                inputMode="decimal"
                name="amount"
                id="amount"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 relative  p-3 gap-3 md:gap-0">
            <div className="flex flex-col gap-3 relative w-full md:w-42">
              <label htmlFor="date">Date</label>

              <input
                type="date"
                value={data.date}
                required
                onChange={handleChange}
                name="date"
                id="date"
                className="border border-(--secondary-blue) rounded  pl-1 focus:outline-none focus:border-cyan-500 h-11 iconColor"
              />
            </div>

            <div className="flex flex-col gap-3 relative w-full md:w-42">
              <label htmlFor="chargeCategories">Category</label>
              {/* {errors.type && (
                            <span className="text-red-500">{errors.type}</span>
                          )} */}
              <select
                id="chargeCategories"
                value={data.category}
                onChange={handleChange}
                name="category"
                required
                className="border border-(--secondary-blue) px-1 rounded h-11 flex"
              >
                <option value="subscription">Subscription</option>
                <option value="bill">Bill</option>
                <option value="tax">Tax</option>
                <option value="insurance">Insurance</option>
                <option value="loan">Loan</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-3 relative w-full  ">
              <label htmlFor="repeating" className="flex items-center gap-2">
                Repeats <MdEventRepeat />
              </label>
              {/* {errors.type && (
                            <span className="text-red-500">{errors.type}</span>
                          )} */}
              <select
                id="repeating"
                onChange={handleChange}
                name="repeating"
                required
                className="border border-(--secondary-blue) px-1 rounded h-11 flex"
              >
                {/* weekly: lessons, allowances, memberships */}
                {/* bi-weekly: salaries, some subscriptions */}
                {/* monthly: subscriptions, rent, utilities */}
                {/* yearly: insurance, domains, hosting, tax */}

                <option value="noRepeat">No repeat</option>
                <option value="Weekly">Weekly</option>
                <option value="BiWeekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                {/* TODO add custom repeating date */}
              </select>
            </div>
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
          {chargeAdded && (
            <div className="border p-3 rounded w-50 absolute z-10 bg-emerald-900 top-0 left-0 ">
              Success
            </div>
          )}
          <span>Add New Charge</span>
        </button>
      </form>
    </div>
  );
}
