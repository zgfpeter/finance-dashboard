import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MonthlySpending, Transaction } from "./types/dashboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcProgressPercent(current: number, total: number): number {
  if (total <= 0) return 0;

  const percent = (current / total) * 100;

  return Math.min(Math.max(percent, 0), 100);
}

// calculate the deadline for an upcoming charge or goal or debt
export function calculateDeadline(date: string) {
  const now = new Date();
  const dueDate = new Date(date);

  // get the difference in dates
  const differenceInMs = dueDate.getTime() - now.getTime();

  if (differenceInMs > 0) {
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    const differenceInHours = Math.floor(
      (differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (differenceInDays > 0) {
      return `In ${differenceInDays} day${differenceInDays > 1 ? "s" : ""}`;
    } else if (differenceInHours > 0) {
      return `In ${differenceInHours} day${differenceInHours > 1 ? "s" : ""}`;
    } else {
      return "Due very soon";
    }
  } else {
    const overdueMs = Math.abs(differenceInMs);
    const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor(
      (overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (overdueDays > 0) {
      return `Overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`;
    } else if (overdueHours > 0) {
      return `Overdye by ${overdueHours} hour${overdueHours > 1 ? "s" : ""}`;
    } else {
      return "Overdue";
    }
  }
}

// calculate the total amount spend this year ( or in a year )

export function getTotalSpendings(transactions: Transaction[]) {
  const total = transactions.reduce((total, currentTransaction) => {
    // only calculate total for expenses
    if (currentTransaction.transactionType === "expense") {
      // this total only updates the accumulator
      return total + Number(currentTransaction.amount);
    }
    // this is the total returned by getTotalSpendings
    // can't do .toFixed(2) here because it would be a string, i want a number
    return Math.round(total * 100) / 100;
  }, 0);
  return total;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
export function getMonthlySpendingsData(
  transactions: Transaction[]
): MonthlySpending[] {
  // initial array, with zeroes
  const monthlyTotals = Array(12).fill(0);

  //calculate expenses per month
  transactions.forEach((transactions) => {
    if (transactions.transactionType !== "expense") return; // i only want the expenses
    const date = new Date(transactions.date); // get the date, right now it's in the format 2025-12-12
    const monthIndex = date.getMonth(); // index based, jan = 0 , feb = 1 etc
    monthlyTotals[monthIndex] += Number(transactions.amount);
  });

  // convert it into recharts format
  return months.map((month, index) => ({
    name: month,
    Spending: Math.round(monthlyTotals[index] * 100) / 100,
  }));
}
