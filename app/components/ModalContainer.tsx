"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { closeModal } from "@/app/store/modalSlice";

import ModalWrapper from "./ModalWrapper";
import TransactionsModal from "./modals/TransactionsModal";
import UpcomingChargesModal from "./modals/UpcomingChargesModal";
import SettingsModal from "./modals/SettingsModal";
import AddTransactionModal from "./modals/AddTransactionModal";
import AddUpcomingChargeModal from "./modals/AddUpcomingChargeModal";
import EditUpcomingChargeModal from "./modals/EditUpcomingChargeModal"; // your edit modal
import EditTransactionModal from "./modals/EditTransactionModal";
import EditOverviewModal from "./modals/EditOverviewModal";

export default function ModalContainer() {
  const dispatch = useDispatch();

  // get the modal type and optional payload from Redux state
  // payload can be the data the modal has to display
  const { type: modalType, data: modalData } = useSelector(
    (state: RootState) => state.modal
  );
  // no modal open
  if (modalType === "none") return null;

  // function passed to every modal to close modal
  const handleClose = () => dispatch(closeModal());

  switch (modalType) {
    case "transactions":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Transactions"
        >
          <TransactionsModal onClose={handleClose} />
        </ModalWrapper>
      );
    case "settings":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Settings"
        >
          <SettingsModal onClose={handleClose} />
        </ModalWrapper>
      );
    case "addTransaction":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Add Transaction"
        >
          <AddTransactionModal onClose={handleClose} />
        </ModalWrapper>
      );
    case "addUpcomingCharge":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Add Upcoming Charge"
        >
          <AddUpcomingChargeModal onClose={handleClose} />
        </ModalWrapper>
      );
    case "editUpcomingCharge":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Edit Upcoming Charge"
        >
          {/* data is the Upcoming Charge to be edited */}
          <EditUpcomingChargeModal data={modalData} onClose={handleClose} />
        </ModalWrapper>
      );
    case "upcomingCharges":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Upcoming Charges"
        >
          <UpcomingChargesModal onClose={handleClose} />
        </ModalWrapper>
      );
    case "editTransaction":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Edit Transaction"
        >
          {/* Modal data is the Transaction to be edited */}
          <EditTransactionModal data={modalData} onClose={handleClose} />
        </ModalWrapper>
      );
    case "editOverview":
      return (
        <ModalWrapper
          onClose={handleClose}
          widthClass="w-[800px] max-w-full"
          ariaLabel="Edit Overview"
        >
          <EditOverviewModal onClose={handleClose} />
        </ModalWrapper>
      );

    default:
      return null;
  }
}
