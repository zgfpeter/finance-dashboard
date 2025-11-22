"use client";
import Overview from "./components/Overview";
import Transactions from "./components/Transactions";
import SpendingChart from "./components/SpendingChart";
import IncomeCard from "./components/IncomeCard";
import SpendingsCard from "./components/SpendingsCard";
import MonthlySpendingChart from "./components/MonthlySpendingChart";
import MonthlyBalanceDifference from "./components/MonthlyBalanceDifference";
import UpcomingCharges from "./components/UpcomingCharges";
import Debts from "./components/Debts";
import Savings from "./components/Savings";

export default function Home() {
  return (
    <div className="flex justify-center lg:py-10">
      {/* 
      small screens: grid with 1 column
          medium screens: grid with 2 columns
          large screens: grid with 3 columns
      */}
      {/* empty div for mobile devices, so that burger button doesn't overlap with content */}
      <div className="h-25 fixed top-0 left-0 w-full bg-(--primary-blue) lg:hidden z-10"></div>
      <main className="pt-25 lg:ml-21 lg:pt-0 grid grid-cols-1 lg:grid-cols-3 md:grid-rows-5 gap-4 w-full max-w-7xl p-5 min-h-screen md:grid-cols-2">
        {/* 
        OVERVIEW + MonthlyBalanceDifference
          cells it takes
          small: (row 1, col 1)
          medium: (row 1, column 2 )
          large: (row 1, column)
         */}
        <div className="border border-(--border-blue) bg-(--border-blue) p-3 rounded-xl w-full md:row-start-1 md:col-start-1 md:row-span-1 md:col-span-1 flex flex-col lg:col-span-1">
          <Overview />
          <MonthlyBalanceDifference />
        </div>
        {/* 
        TRANSACTIONS
        cells it takes
          small: (row 2, column 1)
          medium: (row 2, columns 1)
          large: (row 2+3, column 1) */}
        <div className="border-2 border-(--border-blue) p-3 rounded-xl w-full lg:row-span-2 lg:row-start-1 lg:col-start-2 flex md:row-start-2  md:row-span-1 md:col-start-1">
          <Transactions />
        </div>
        {/* Income + Spendings 
          cells it takes
          small: (row 3, column 1)
          medium: (row 3, columns 1)
          large: (row 1, column 2)
          
        */}
        <div className="border-2 border-(--border-blue) bg-(--border-blue) p-3 rounded-xl w-full lg:row-start-3 lg:col-start-2 lg:row-span-1 flex flex-col gap-1 md:row-span-1 md:row-start-2 md:col-start-2">
          <IncomeCard />
          <SpendingsCard />
        </div>
        {/* 
        cells it takes
          small: (row 1, column 1)
          medium: (row 1, columns 2)
          large: (row 1, column 1) */}
        <div className="border-2 border-(--border-blue) p-3 rounded-xl w-full flex items-center justify-center md:row-start-1 md:col-start-2 md:row-span-1 overflow-hidden lg:row-start-1 lg:col-start-3">
          <UpcomingCharges />
        </div>
        {/* Debts + Savings (spans 2 rows on md+) */}
        {/* 
        cells it takes
          small: (row 4, column 1)
          medium: (row 1, columns 3)
          large: (row 1, column 3) */}
        <div className="border-2 border-(--border-blue) bg-(--border-blue) p-3 rounded-xl w-full md:row-start-3 md:row-span-2 md:col-start-1 flex flex-col gap-1 lg:row-start-2">
          <Debts />
          <Savings />
        </div>
        {/* Spendings this year */}
        {/* 
        cells it takes
          small: (row 5, column 1)
          medium: (row 2+3, columns 3)
          large: (row 2+3, column 3) */}
        <div className="border-2 border-(--border-blue) p-3 rounded-xl w-full md:row-start-3 md:row-span-2 md:col-start-2 flex flex-col gap-1 items-center justify-evenly lg:col-start-3 lg:row-start-2">
          <h2 className="text-(--text-light) text-2xl">Spendings this year</h2>
          <SpendingChart />
          <MonthlySpendingChart />
        </div>
      </main>
    </div>
  );
}
