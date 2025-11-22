"use client";
import { useDashboard } from "../hooks/useDashboard";

export default function TestGetData() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  console.log(data);
  return <div>test</div>;
  // the ! just says that "I guarantee this is not null/undefined". Only a typescript compile-time instruction. No effect at runtime. Safe only after i've handled loading/error cases.
}
