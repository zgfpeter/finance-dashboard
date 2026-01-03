import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "../components/layout/Navbar";
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/UserLogin");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* only renders if session exists */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

// the getServerSesssion knows :
// if the user is really logged in
// if token expired
// if token matches DB
// if user was deleted
// if JWT has been tempered
