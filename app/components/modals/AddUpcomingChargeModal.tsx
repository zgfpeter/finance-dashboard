"use client";
// imports
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdCheck, MdEventRepeat } from "react-icons/md";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import SeparatorLine from "../ui/SeparatorLine";
import {
  ExpenseCategory,
  RepeatingUpcomingCharge,
} from "@/lib/types/dashboard";
import { AxiosError } from "axios";

// uses your existing types (ExpenseCategory, RepeatingUpcomingCharge)
type IntervalOrEmpty = number | "";
type CountOrEmpty = number | "";

export interface RecurringChargeForm {
  // keep `date` to match your component inputs; convert to domain `startDate` when submitting
  date: string;
  company: string;
  amount: string; // inputs are strings
  category: ExpenseCategory;
  repeating: RepeatingUpcomingCharge;
  interval: IntervalOrEmpty; // numeric input OR empty while editing
  endDate: string;
  count: CountOrEmpty;
}

interface CreateRecurringPayload {
  // server expects these names — adjust if your API expects `date` instead of startDate
  startDate?: string; // or date: string depending on API
  date?: string; // if API expects `date` in this endpoint
  company: string;
  amount: number;
  category: ExpenseCategory;
  repeating: RepeatingUpcomingCharge;
  interval?: number;
  endDate?: string;
  count?: number;
}

// this will hold the form state
// should not use RepeatingCharge here as it would not be correct, this is a temporary UI state, might contain empty strings etc
const INITIAL_STATE: RecurringChargeForm = {
  date: "",
  company: "",
  amount: "",
  category: "bill",
  repeating: "noRepeat",
  interval: 1, // default numeric
  endDate: "",
  count: "",
};

interface Props {
  onClose: () => void;
}

export default function AddUpcomingChargeModal({ onClose }: Props) {
  // get the axiosAuth instance
  const axiosAuth = useAxiosAuth();

  const [data, setData] = useState<RecurringChargeForm>({ ...INITIAL_STATE });

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

  // inside the component, after hooks
  // helper (inside component)
  function getEveryLabel(repeating: string, interval: number | string) {
    const rawInterval = Number(interval) || 1;
    const baseUnit =
      repeating === "Monthly"
        ? "month"
        : repeating === "Yearly"
        ? "year"
        : "week"; // Weekly maps to week

    // human-friendly: "every week" (not "every 1 week") or "every 3 weeks"
    if (rawInterval === 1) return baseUnit; // "week" / "month" / "year"
    return `${rawInterval} ${baseUnit}s`;
  }

  // handle the input change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setData((prev) => {
      const key = name as keyof RecurringChargeForm;

      // 5,99 not recognized on mobile devices
      // replace , with .
      // also remove any invalid characters (currency symbols, letters, spaces)
      if (key === "amount") {
        const sanitized = value
          .replace(",", ".")
          .replace(/[^0-9.]/g, "") // allow only digits and dot
          .replace(/(\..*)\./g, "$1"); // prevent multiple dots

        return {
          ...prev,
          amount: sanitized,
        };
      }

      // number fields we want to store as numbers when not empty:
      if (key === "interval" || key === "count") {
        return {
          ...prev,
          [key]: value === "" ? "" : Number(value),
        } as RecurringChargeForm;
      }

      // amount stored as string (we let the input emit raw string)
      return {
        ...prev,
        [key]: value,
      } as RecurringChargeForm;
    });
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

    // repeating validation
    if (data.repeating && data.repeating !== "noRepeat") {
      if (data.interval === "" || Number(data.interval) < 1) {
        newErrors.generalError =
          "Recurrence interval must be a positive integer.";
      }

      if (data.endDate) {
        const end = new Date(data.endDate);
        const start = new Date(data.date);
        if (isNaN(end.getTime())) {
          newErrors.generalError = "Invalid end date.";
        }
        if (end < start) {
          newErrors.generalError = "End date must be >= start date.";
        }
      }

      if (data.count && Number(data.count) < 1) {
        newErrors.generalError = "Occurrences must be >= 1.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    // if there are no errors in the form, this will return true
    // if there's at least one error, then it will return false
  }

  const addMutation = useMutation({
    mutationFn: (payload: CreateRecurringPayload) =>
      axiosAuth.post(`/dashboard/upcomingCharges`, payload),

    onSuccess: () => {
      // show success briefly, invalidate, then close
      setChargeAdded(true);
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

      setTimeout(() => {
        setChargeAdded(false);
        setData({ ...INITIAL_STATE }); // FIX: full reset
        onClose();
      }, 700);
    },

    onError: (err: AxiosError<{ message?: string }>) => {
      setErrors((prev) => ({
        ...prev,
        generalError: err.response?.data?.message || "Failed to add charge",
      }));
    },
  });

  // get the states from the updateMutation
  const { isPending, isError } = addMutation;

  // handle the submit: check if form is valid, then call the mutate method that makes the POST request
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    // calls the tanstack query POST
    const payload: CreateRecurringPayload = {
      date: data.date,
      company: data.company.trim(), // trim empty characters, spaces
      amount: Number(data.amount),
      category: data.category,
      repeating: data.repeating,
      interval: data.interval ? Number(data.interval) : 1,
      endDate: data.endDate || undefined,
      count: data.count ? Number(data.count) : undefined,
    };

    addMutation.mutate(payload);

    // setData(...)
    // onClose()
    // These now happen ONLY after success
  }

  if (isError) {
    return <ErrorState message="An error has occured" />;
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
          setData({ ...INITIAL_STATE }); // FIX: reset on manual close
          onClose();
        }}
        className="absolute text-xl text-red-500 right-10 top-4"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold">Add a new upcoming charge</h2>

      {errors.generalError && (
        <p className="text-red-500">{errors.generalError}</p>
      )}

      <form
        className="flex flex-col w-full gap-5"
        onSubmit={handleSubmit}
        id="addCharge"
      >
        <div className="grid grid-cols-1 gap-3 px-2 py-1 md:grid-cols-2">
          <div className="flex flex-col gap-1 ">
            <label htmlFor="company" className="">
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
              value={data.company}
              required
              maxLength={40}
              onChange={handleChange}
              name="company"
              id="company"
              className="border border-(--secondary-blue) rounded-md p-2  h-11"
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
              type="text" // FIX: number inputs reject commas on mobile (locale issue)
              value={data.amount}
              inputMode="decimal" //  shows numeric keyboard on mobile
              onChange={handleChange}
              placeholder="0.00"
              name="amount"
              id="amount"
              className="border border-(--secondary-blue) rounded-md p-2  h-11"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 px-2 py-1">
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
              className="border border-(--secondary-blue) rounded-md px-1  h-11"
            />
          </div>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="chargeCategories">Category</label>
            <select
              id="chargeCategories"
              value={data.category}
              onChange={handleChange}
              name="category"
              required
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

          <div className="flex flex-col gap-1 ">
            <label htmlFor="repeating" className="flex items-center gap-2">
              Repeats <MdEventRepeat />
            </label>

            <select
              id="repeating"
              name="repeating"
              value={data.repeating} // controlled
              onChange={handleChange}
              className="border border-(--secondary-blue) px-1 rounded-md h-11"
            >
              <option value="noRepeat">No repeat</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
        {data.repeating !== "noRepeat" && (
          <div className="grid grid-cols-1 gap-3 px-2 py-1 md:grid-cols-2 md:gap-0 md:place-items-center justify-evenly ">
            <div className="flex items-center gap-3 md:justify-between ">
              <label htmlFor="interval" className="flex items-center gap-2">
                Repeats:
              </label>
              <div className="flex items-center gap-3">
                <span>Every</span>

                <input
                  id="interval"
                  type="number"
                  name="interval"
                  // a positive integer, default 1
                  // counts how many units between occurrences
                  // if repeating === Weekly, and interval = 1 -> every week
                  // if repeating === Weekly, and interval = 3 -> every 3 weeks
                  // if repeating === Monthly, and interval = 2 -> every 2 months
                  value={data.interval}
                  min={1}
                  onChange={handleChange}
                  className="border border-(--secondary-blue) rounded-md pl-2  h-11 w-20"
                />

                <span className="capitalize">
                  {getEveryLabel(data.repeating, data.interval)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="endDate" className="flex items-center gap-2">
                End date
              </label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={data.endDate}
                onChange={handleChange}
                className="border border-(--secondary-blue) rounded-md px-1  h-11 "
              />
            </div>
          </div>
        )}

        {/* <div className="relative flex flex-col gap-3">
                <label
                  htmlFor="nrOfOccurences"
                  className="flex items-center gap-2"
                >
                  Or occurrences
                </label>
                <input
                  id="nrOfOccurences"
                  type="number"
                  name="count"
                  min={1}
                  value={data.count ?? ""}
                  onChange={handleChange}
                  className="pl-1 border rounded-md focus:outline-none h-11"
                />
              </div>  */}

        {errors.date && (
          <span className="pl-12 text-red-500">{errors.date}</span>
        )}
      </form>
      <SeparatorLine width="3/4" />
      <button
        type="submit"
        form="addCharge"
        disabled={isPending}
        aria-label="Add new charge"
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
        {/* Normal state */}
        <span
          className={`transition-opacity ${
            isPending ? "opacity-0" : "opacity-100"
          }`}
        >
          Add charge
        </span>

        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {/* Success overlay */}
        {chargeAdded && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 text-white rounded-md bg-emerald-900 ">
            Success <MdCheck />
          </div>
        )}
      </button>
    </div>
  );
}
