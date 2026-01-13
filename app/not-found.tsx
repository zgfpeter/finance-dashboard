import Link from "next/link";
import React from "react";
import { GoArrowLeft } from "react-icons/go";
const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-(--primary-blue) text-white">
      <h1 className="mb-4 text-5xl font-bold">404</h1>
      <p className="mb-4">Page not found.</p>
      <Link
        href="/"
        className="text-(--error-blue) underline flex items-center gap-1"
        aria-label="Return to Homepage"
      >
        <GoArrowLeft /> Return to Homepage
      </Link>
    </main>
  );
};

export default NotFound;
