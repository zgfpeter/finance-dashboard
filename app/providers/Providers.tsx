// import all client-only providers here
"use client";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./QueryProvider";
import { ModalProvider } from "../context/ModalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ModalProvider>{children}</ModalProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
