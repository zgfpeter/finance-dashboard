"use client";
import { useDashboard } from "@/app/hooks/useDashboard";
type PieDataItem = { name: string; value: number }; // ex: Bills: 23, where 23 is the percentage of bills amount out of total
export default function CalSpedingCategoriesPercentages() {
  const transactions = useDashboard().data?.transactions;
  console.log(transactions);
  const totals: Record<string, number> = {};
  transactions?.forEach((transaction) => {
    if (transaction.transactionType === "expense") {
      totals[transaction.category] =
        (totals[transaction.category] || 0) + Number(transaction.amount);
    }
  });
  // this calculates amount of category out of total, then rechards calculates the actual percentages
  // Object.entries(obj) turns the object into an array of key-value pairs like ["subscriptions",200]
  // now i have an array and i can iterate over it with map
  // after mapping, we return them as objects, so {name:"subscriptions",value:200}
  // need to do this because Recharts expects pie chart data as an array of objects

  const pieData = Object.entries(totals).map(([name, value]) => ({
    name,
    value,
  }));
  console.log(pieData);
  return pieData;
}
