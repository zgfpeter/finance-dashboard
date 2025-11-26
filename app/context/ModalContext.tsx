"use client";

import { createContext, useContext, useState } from "react";
import ModalContainer from "@/app/components/ModalContainer";
import { ModalType } from "@/lib/types/dashboard";

interface ModalContextValue {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalType>("none");

  const openModal = (type: ModalType) => setModal(type);
  const closeModal = () => setModal("none");

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* This renders above EVERYTHING */}
      <ModalContainer modal={modal} onClose={closeModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}
