// import all client-only providers here
"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import QueryProvider from "./QueryProvider";
// import { ModalProvider } from "../context/ModalContext";
import { Provider } from "react-redux"; // my global store provider
import { store } from "../store/store";
import ModalContainer from "../components/ModalContainer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute={"class"}
      defaultTheme={"light"}
      enableSystem={false}
    >
      <SessionProvider>
        <QueryProvider>
          <Provider store={store}>
            {/* <ModalProvider>{children}</ModalProvider> */}
            {children}
            <ModalContainer />
          </Provider>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
