import type { Metadata } from "next";
import { Rowdies } from "next/font/google";
import "./globals.css";
// import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";
import Providers from "./providers/Providers";
import Background from "./components/ui/Background";
// import { store } from "./store/store";
const rowdies = Rowdies({
  variable: "--font-rowdies",
  weight: ["300"],
});

// Metadata
export const metadata = {
  title: "Pocket Memory",
  description:
    "A one-page personal finance dashboard built with Next.js, React, and TailwindCSS.",
  keywords: [
    "Next.js",
    "React",
    "Dashboard",
    "Finance",
    "TailwindCSS",
    "TypeScript",
    "NextAuth",
    "MongoDB",
    "Express.js",
    "Node.js",
  ],
  authors: [{ name: "zgfpeter" }],
  openGraph: {
    title: "Pocket Memory",
    description:
      "A one-page personal finance dashboard built with Next.js, React, and TailwindCSS.",
    url: "https://finance-dashboard-gules-omega.vercel.app/dashboard", // Live demo URL
    siteName: "Pocket Memory",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${rowdies.className} antialiased  bg-linear-to-r from-[#120319] to-[#0b181c] h-screen text-(--text-light) `}
      >
        {/* wrap my app in the QueryProvider (for tanstack query) */}
        {/* a Provider is a react pattern based on React Context. It makes a value available to all descendant components without passing it as props. QueryClientProvider places teh queryClient into context ( here i have a separate QueryProvider in my providers/QueryProvider.tsx ). The provider connects hooks and components to the central cache and behaviors*/}
        {/* <Provider store={store}> */}

        <Providers>
          {/* <Navbar /> */}
          <Background />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
