// decides which modal to show
"use client";

import React from "react";
import ModalWrapper from "./ModalWrapper";
import TransactionsModal from "./modals/TransactionsModal";
import { ModalType } from "@/lib/types/dashboard";
import UpcomingChargesModal from "./modals/UpcomingChargesModal";
import SettingsModal from "./modals/SettingsModal";
import AddTransactionModal from "./modals/AddTransactionModal";
import AddUpcomingChargeModal from "./modals/AddUpcomingChargeModal";
interface Props {
  modal: ModalType;
  onClose: () => void;
}

export default function ModalContainer({ modal, onClose }: Props) {
  if (modal === "none") return null;

  // You can vary width per modal by passing widthClass to ModalWrapper
  return (
    <>
      {modal === "transactions" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Transactions"
        >
          <TransactionsModal onClose={onClose} />
        </ModalWrapper>
      )}
      {modal === "upcomingCharges" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Upcoming Charges"
        >
          <UpcomingChargesModal onClose={onClose} />
        </ModalWrapper>
      )}
      {modal === "settings" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Settings"
        >
          <SettingsModal onClose={onClose} />
        </ModalWrapper>
      )}
      {modal === "addTransaction" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Add Transaction"
        >
          <AddTransactionModal onClose={onClose} />
        </ModalWrapper>
      )}

      {modal === "addUpcomingCharge" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Add Upcoming Charge"
        >
          <AddUpcomingChargeModal onClose={onClose} />
        </ModalWrapper>
      )}

      {/* {modal === "upcoming" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-[600px] max-w-full"
          ariaLabel="Upcoming charges"
        >
          <UpcomingModal onClose={onClose} />
        </ModalWrapper>
      )}

      {modal === "profile" && (
        <ModalWrapper
          onClose={onClose}
          widthClass="w-96 max-w-full"
          ariaLabel="Profile"
        >
          <ProfileModal onClose={onClose} />
        </ModalWrapper>
      )} */}
    </>
  );
}
