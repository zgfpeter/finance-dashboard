"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UpcomingCharge } from "@/lib/types/dashboard";
interface Props {
  onClose: () => void;
}

export default function AddUpcomingChargeModal({ onClose }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [data, setData] = useState<UpcomingCharge>({
    date: "",
    company: "",
    amount: "",
    category: "Bill",
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
      axios.post(`${apiUrl}/api/dashboard/upcomingCharges`, payload),
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
      category: "Bill", // default category is Bill
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
                name="amount"
                id="amount"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex relative justify-between">
            <div className="flex flex-col p-3 gap-3 relative">
              <label htmlFor="date">Date</label>

              <input
                type="date"
                value={data.date}
                required
                onChange={handleChange}
                name="date"
                id="date"
                className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500 h-11 iconColor"
              />
            </div>
            <div className="flex relative ">
              <div className="flex flex-col p-3 gap-3 relative">
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
                  className="border border-(--secondary-blue) px-2 rounded h-11 flex"
                >
                  <option value="Subscription">Subscription</option>
                  <option value="Bill">Bill</option>
                  <option value="Tax">Tax</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Loan">Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
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
