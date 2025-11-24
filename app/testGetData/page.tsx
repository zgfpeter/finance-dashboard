"use client";
import { useDashboard } from "../hooks/useDashboard";

export default function TestGetData() {
  const { data, isLoading, isError, error } = useDashboard();

  console.log(data?.overview);
  return <div></div>;
  // the ! just says that "I guarantee this is not null/undefined". Only a typescript compile-time instruction. No effect at runtime. Safe only after i've handled loading/error cases.
}
