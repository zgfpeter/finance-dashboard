"use client";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
export default function Error() {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-(--primary-blue) text-white">
      <h1 className="mb-4 text-5xl font-bold">Error</h1>
      <p className="mb-4">An error occured.</p>
      <Link
        href="/"
        className="text-(--error-blue) underline flex items-center gap-1"
      >
        <GoArrowLeft /> Return to Homepage
      </Link>
    </main>
  );
}
