import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcAnimationWidth(currentPaid: number, totalAmount: number) {
  console.log((currentPaid / totalAmount) * 100);
  return Math.floor((currentPaid / totalAmount) * 100);
}
