"use client";
import Overview from "../components/Overview";
import Transactions from "../components/Transactions";
import SpendingChart from "../components/charts/SpendingChart";
import IncomeCard from "../components/IncomeCard";
import SpendingsCard from "../components/SpendingsCard";
import MonthlySpendingChart from "../components/charts/MonthlySpendingChart";
import UpcomingCharges from "../components/UpcomingCharges";
import Debts from "../components/Debts";
import Goals from "../components/Goals";
import { useDashboard } from "../hooks/useDashboard";
import { getTotalSpendings } from "@/lib/utils";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { MdError } from "react-icons/md";
import calcSpendingsCategoriesPercentages from "@/lib/CalculatePiePercentages";
import { getMonthlySpendingsData } from "@/lib/utils";
import ChartContainer from "../components/charts/ChartContainer";
import LoadingState from "../components/ui/LoadingState";
import { useSession } from "next-auth/react";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";

// TODO for my editUpcominCharge modal to work, i need to lift up the state. since it needs to be passed to the EditUpcomingChargeModal,

export default function DashboardPage() {
  const { data, isLoading, isError, isFetching } = useDashboard();

  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;
  if (isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (isError)
    return (
      <div className="flex h-screen items-center p-5 text-red-500 justify-center gap-2">
        <MdError />
        An error as occured.
      </div>
    );

  const transactions = data?.transactions ?? [];
  const spentThisYear = getTotalSpendings(transactions);
  const spendingsPieData = calcSpendingsCategoriesPercentages(transactions);
  const monthlyData = getMonthlySpendingsData(transactions);

  return (
    <div className="flex justify-center">
      {/* 
      small screens: grid with 1 column
          medium screens: grid with 2 columns
          large screens: grid with 3 columns
      */}
      {/* empty div for mobile devices, so that burger button doesn't overlap with content */}
      <div className="h-25 fixed top-0 left-0 w-full bg-(--primary-blue) lg:hidden z-10 "></div>
      <main
        className="
  pt-25  lg:pt-3
  grid grid-cols-1 
  md:grid-cols-2 
  xl:grid-cols-3 
  gap-3 w-full max-w-[1500px] 
  lg:ml-23 2xl:ml-0
"
      >
        {/* Overview */}
        <div
          className="
    border-2 border-(--border-blue) bg-(--primary-blue) p-3 rounded-md 
    order-1 md:order-1 lg:order-1
  "
        >
          <Overview />
        </div>

        {/* Income + Spendings */}
        <div
          className="bg-(--primary-bg)
    border-2 border-(--border-blue) p-3 rounded-md 
    order-2 md:order-2 lg:order-4 xl:order-3 overflow-hidden flex flex-col gap-1
  "
        >
          <IncomeCard />
          <SpendingsCard />
        </div>

        {/* Transactions */}
        <div
          className=" bg-(--primary-bg)
    border-2 border-(--border-blue)  p-3 rounded-md 
    
    order-3 md:order-3 md:col-span-2 lg:order-3 lg:col-span-1 xl:order-4 overflow-hidden
  "
        >
          <Transactions />
        </div>

        {/* Upcoming Charges */}
        <div
          className=" bg-(--primary-bg)
    border-2 border-(--border-blue) p-3 rounded-md 
    flex items-center justify-center overflow-hidden
    order-2 md:order-2 md:col-span-2 lg:order-2 lg:col-span-1
  "
        >
          <UpcomingCharges />
        </div>

        {/* <div
          className="
    border-2 border-(--border-blue) p-3 rounded-md 
    flex items-center justify-center overflow-hidden
    order-2 md:order-2 lg:order-2
  "
        >
          <Subscriptions />
        </div> */}
        {/* Debts + Goals */}
        <div
          className="  bg-(--primary-bg)
    border-2 border-(--border-blue) p-3 rounded-md 
    flex flex-col gap-1
    order-5 md:order-5 md:col-span-2 lg:order-5 lg:col-span-1 relative z-0
  "
        >
          <Debts />
        </div>
        <div
          className="  bg-(--primary-bg)
    border-2 border-(--border-blue) p-3 rounded-md 
    flex flex-col gap-1
    order-5 md:order-5 md:col-span-2 lg:order-5 lg:col-span-1 relative z-0
  "
        >
          <Goals />
        </div>

        {/* Spendings this year */}
        <div
          className="bg-(--primary-bg)
    border-2 border-(--border-blue) p-3 rounded-md 
    flex flex-col gap-1 items-center justify-around
    order-7 col-span-1 md:col-span-2 lg:col-span-3 relative min-h-110
  "
        >
          {/* div
          className="  bg-(--primary-bg)
    border-2 border-(--border-blue) p-3 rounded-md 
    flex flex-col gap-1 items-center justify-around
    order-6 md:order-6 md:col-span-3 lg:col-span-1 relative
  "
        > */}
          <h2 className="text-(--text-light) text-lg flex justify-between w-full ">
            <span>Spendings this year </span>
            <span className="text-(--text-light) flex items-center">
              Total:{" "}
              {isLoading ? (
                <LoadingState message="" />
              ) : (
                <span className="text-red-500 pl-1">
                  {" "}
                  {currencySymbol}{" "}
                  {getTotalSpendings(transactions || []).toFixed(2) ?? 0}
                </span>
              )}
            </span>
          </h2>

          {/* Charts assume valid data, should not render with empty data */}
          <ChartContainer
            isLoading={isFetching}
            hasData={spendingsPieData.length > 0}
            height={200}
          >
            <SpendingChart pieData={spendingsPieData} />
          </ChartContainer>

          <ChartContainer
            isLoading={isFetching}
            hasData={monthlyData.length > 0}
            height={120}
          >
            <MonthlySpendingChart data={monthlyData} />
          </ChartContainer>

          {isLoading ? (
            <LoadingState message="Loading spendings by month..." />
          ) : (
            <p className="text-center ">Spendings by month</p>
          )}
        </div>
      </main>
    </div>
  );
}
