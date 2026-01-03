"use client";
import { Transaction } from "./types/dashboard";
export default function calcSpendingsCategoriesPercentages(
  transactions: Transaction[]
): { name: string; value: number }[] {
  const totals: Record<string, number> = {};

  for (const transaction of transactions) {
    if (transaction.transactionType === "expense") {
      totals[transaction.category] =
        (totals[transaction.category] ?? 0) + Number(transaction.amount);
    }
  }
  // this calculates amount of category out of total, then rechards calculates the actual percentages
  // Object.entries(obj) turns the object into an array of key-value pairs like ["subscriptions",200]
  // now i have an array and i can iterate over it with map
  // after mapping, we return them as objects, so {name:"subscriptions",value:200}
  // need to do this because Recharts expects pie chart data as an array of objects

  return Object.entries(totals).map(([name, value]) => ({
    name,
    value,
  }));
}
