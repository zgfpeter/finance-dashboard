"use client";
import Overview from "../components/Overview";
import Transactions from "../components/Transactions";
import SpendingChart from "../components/SpendingChart";
import IncomeCard from "../components/IncomeCard";
import SpendingsCard from "../components/SpendingsCard";
import MonthlySpendingChart from "../components/MonthlySpendingChart";
import UpcomingCharges from "../components/UpcomingCharges";
import Debts from "../components/Debts";
import Savings from "../components/Savings";
import { useDashboard } from "../hooks/useDashboard";
import LoadingSpinner from "../components/LoadingSpinner";
import Subscriptions from "../components/Subscriptions";
import { MdError } from "react-icons/md";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  // if (isLoading) return <div>Loading...</div>;
  if (isLoading)
    return (
      <div className="flex h-screen items-center p-5 text-(--text-light) justify-center relative">
        <LoadingSpinner /> Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex h-screen items-center p-5 text-red-500 justify-center gap-2">
        <MdError />
        An error as occured.
      </div>
    );

  return (
    <div className="flex justify-center">
      {/* 
      small screens: grid with 1 column
          medium screens: grid with 2 columns
          large screens: grid with 3 columns
      */}
      {/* empty div for mobile devices, so that burger button doesn't overlap with content */}
      <div className="h-25 fixed top-0 left-0 w-full bg-(--primary-blue) lg:hidden z-10"></div>
      <main
        className="
  pt-25  lg:pt-3
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-3 w-full max-w-7xl p-3
"
      >
        {/* Overview */}
        <div
          className="
    border-2 border-(--border-blue) bg-(--border-blue) p-3 rounded-xl 
    order-1 md:order-1 lg:order-1
  "
        >
          <Overview />
        </div>

        {/* Transactions */}
        <div
          className=" 
    border-2 border-(--border-blue) p-3 rounded-xl 
    order-4 md:order-4 lg:order-4 overflow-hidden
  "
        >
          <Transactions />
        </div>

        {/* Income + Spendings */}
        <div
          className="
    border-2 border-(--border-blue) bg-(--border-blue) p-3 rounded-xl 
    flex flex-col gap-1
    order-3 md:order-3 lg:order-3
  "
        >
          <IncomeCard />
          <SpendingsCard />
        </div>

        {/* Upcoming Charges */}
        <div
          className="
    border-2 border-(--border-blue) p-3 rounded-xl 
    flex items-center justify-center overflow-hidden
    order-2 md:order-2 lg:order-2
  "
        >
          <UpcomingCharges />
        </div>

        {/* <div
          className="
    border-2 border-(--border-blue) p-3 rounded-xl 
    flex items-center justify-center overflow-hidden
    order-2 md:order-2 lg:order-2
  "
        >
          <Subscriptions />
        </div> */}
        {/* Debts + Savings */}
        <div
          className="
    border-2 border-(--border-blue) bg-(--border-blue) p-3 rounded-xl 
    flex flex-col gap-1
    order-5 md:order-5 lg:order-5 relative z-0
  "
        >
          <Debts />
          <Savings />
        </div>

        {/* Spendings this year */}
        <div
          className="
    border-2 border-(--border-blue) p-3 rounded-xl 
    flex flex-col gap-1 items-center justify-evenly
    order-6 md:order-6 relative
  "
        >
          <h2 className="text-(--text-light) text-lg flex justify-between w-full">
            <span>Spendings this year </span>
            <span className="text-(--text-light)">
              Total: <span className="text-red-500">€ 7532</span>
            </span>
          </h2>

          <SpendingChart />
          <MonthlySpendingChart />
        </div>
      </main>
    </div>
  );
}
