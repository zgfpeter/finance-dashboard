"use client";
// imports
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdCheck, MdEventRepeat } from "react-icons/md";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import SeparatorLine from "../ui/SeparatorLine";
import {
  ExpenseCategory,
  RepeatingUpcomingCharge,
} from "@/lib/types/dashboard";
import { AxiosError } from "axios";

interface Props {
  onClose: () => void;
}

export default function Pricing({ onClose }: Props) {
  //   if (isError) {
  //     return <ErrorState message="An error has occured" />;
  //   }

  return (
    <div
      className="flex flex-col items-center h-full justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={() => {
          onClose();
        }}
        className="absolute text-xl text-red-500 right-5 top-3"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="pt-3 pb-6 text-xl font-semibold">Upgrade & go ad free</h2>
      <section className="grid justify-between grid-cols-2 gap-5 p-3 my-20 text-lg">
        <div className="flex flex-col items-center gap-5  border-2 border-teal-900 shadow-[5px_5px] shadow-teal-700 p-10">
          <h2 className="px-3 py-1 bg-teal-500/20">Monthly</h2>
          <ul className="flex flex-col justify-between h-full gap-2">
            <li className="list-disc">€ 3.99 / month</li>
            <li className="list-disc">0 ads</li>
            <li className="list-disc">Cancel anytime</li>
          </ul>
          <button className="px-3 py-1 border transition-[border-color] duration-300 ease-in-out hover:border-teal-500">
            Select
          </button>
        </div>
        <div className="flex flex-col items-center gap-5  border-2 border-cyan-900 shadow-[5px_5px] shadow-cyan-700 p-10">
          <h2 className="px-3 py-1 bg-cyan-500/20">Yearly</h2>
          <ul className="flex flex-col justify-between h-full gap-2">
            <li className="list-disc">€ 35.99 / year</li>
            <li className="list-disc">Save 24.8%</li>

            <li className="list-disc">0 ads</li>
            <li className="list-disc">Cancel anytime</li>
          </ul>
          <button className="px-3 py-1 border transition-[border-color] duration-300 ease-in-out hover:border-cyan-500">
            Select
          </button>
        </div>
      </section>
    </div>
  );
}
