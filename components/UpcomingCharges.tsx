"use client";
import { LuBellRing } from "react-icons/lu";
import { FaPlus, FaClock } from "react-icons/fa6";
import { useState } from "react";
import { MdClose, MdOutlineRepeat } from "react-icons/md";
import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { calculateDeadline, prettifyDate } from "@/lib/utils";
import EmptyState from "./ui/EmptyState";
import ErrorState from "./ui/ErrorState";
import { UpcomingChargesSkeleton } from "./ui/skeletons/UpcomingChargesSkeleton";
import { useSession } from "next-auth/react";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";

export default function UpcomingCharges() {
  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;
  const { data, isLoading, isError } = useDashboard();

  const UCData = data?.upcomingCharges || [];

  const [notificationsModalOpen, setNotificationsModalOpen] =
    useState<boolean>(false);
  const dispatch = useDispatch();

  const hasUpcomingCharges = UCData.length > 0; // if true, there are some transactions
  // the modals are controlled by redux now, so dispatch opens the appropriate modal.
  // without redux, i'd have to lift state up to pass the charge
  // open the See All Modal, when clicking on See All
  const handleSeeAll = () => {
    dispatch(openModal({ type: "upcomingCharges", data: null }));
  };
  // open the Add Upcoming Charge Modal (When clicking on the + )
  const handleAddUpcomingCharge = () => {
    dispatch(openModal({ type: "addUpcomingCharge", data: null }));
  };
  const [notify, setNotify] = useState<boolean>(false);
  const [tempNotify, setTempNotify] = useState<boolean>(notify); /// for inside the modal

  // when clicking on the bell icon, open the notifications modal
  function handleNotifications() {
    setNotificationsModalOpen(!notificationsModalOpen);
  }

  function handleSaveNotify() {
    setNotify(tempNotify); // save choice from modal, update state of checkbox
    setNotificationsModalOpen(false);
  }

  function handleDontNotify() {
    setTempNotify(notify); // change to original value, if user doesn't save
    setNotificationsModalOpen(false);
  }

  return (
    <section className="relative flex flex-col w-full h-full col-span-1 row-span-1 row-start-1 gap-3 rounded-md col-stat-3 min-h-50">
      {/* backdrop for the notifications modal */}
      {notificationsModalOpen && (
        <div className="absolute inset-0 z-10 h-full bg-black/50 backdrop-blur-sm "></div>
      )}
      {/* notifications modal */}
      {notificationsModalOpen && (
        <section
          className="absolute bg-(--primary-blue) h-full self-center w-full inset-0 flex flex-col items-center justify-center gap-5 z-10 rounded-md "
          role="dialog"
        >
          <button
            className="absolute p-1 text-2xl top-3 right-3"
            onClick={() => setNotificationsModalOpen(false)}
            aria-label="Close Notification Modal"
          >
            <MdClose></MdClose>
          </button>
          <label className="flex items-center justify-center w-full gap-3 px-2 cursor-pointer">
            {/* custom checkbox, easier to style */}
            <input
              type="checkbox"
              className="hidden peer accent-white "
              checked={tempNotify}
              onChange={(e) => setTempNotify(e.target.checked)}
            />
            <span>Notify me about upcoming charges:</span>
            <span className="w-5 h-5 border border-blue-600 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-600 "></span>
          </label>
          <div className="flex w-full justify-evenly">
            <button
              className="px-2 py-1 "
              onClick={handleDontNotify}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 text-teal-600"
              onClick={handleSaveNotify}
              aria-label="Save"
            >
              Save
            </button>
          </div>
        </section>
      )}

      <div className="flex items-center justify-between ">
        <h2 className="flex items-center gap-2 p-2 text-lg rounded-md">
          <FaClock /> Upcoming Charges
        </h2>

        <div className="flex gap-3">
          <button
            className="p-1"
            onClick={handleNotifications}
            aria-label="Notifications"
          >
            <span className="text-yellow-500">
              <LuBellRing />
            </span>
          </button>
          <button
            className="flex items-center text-xl"
            onClick={handleAddUpcomingCharge}
          >
            <span className="text-yellow-500">
              <FaPlus />
            </span>
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <UpcomingChargesSkeleton />
      ) : isError ? (
        <ErrorState message="Could not load upcoming charges." />
      ) : hasUpcomingCharges ? (
        <ul className="flex flex-col gap-2 overflow-y-auto h-96 ">
          {UCData.map((charge) => {
            const deadline = calculateDeadline(charge.date);
            return (
              <li
                key={charge._id}
                className="bg-(--border-blue) rounded-md relative  grid grid-cols-[4fr_2fr_1fr] grid-rows-2 items-center text-sm py-2 "
              >
                {charge.category && (
                  <div className="text-[0.8em] font-extralight text-yellow-500 px-1 flex items-center gap-1">
                    <span>{charge.category}</span>
                    {charge.recurring && (
                      <span className="text-cyan-500">
                        <MdOutlineRepeat />
                      </span>
                    )}
                  </div>
                )}
                <div className="row-start-2 p-1 overflow-hidden whitespace-nowrap text-ellipsis ">
                  {charge.company}
                </div>

                <p className="row-start-2 p-1 overflow-hidden text-yellow-500 whitespace-nowrap text-ellipsis">
                  - {currencySymbol} {charge.amount}
                </p>

                <div className="relative flex flex-col col-start-3 row-span-2 gap-2 text-xs">
                  <span
                    className={
                      deadline.status === "upcoming"
                        ? "text-green-500"
                        : deadline.status === "soon"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                  >
                    {deadline.text}
                  </span>

                  <p className="pr-4 text-xs">{prettifyDate(charge.date)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState message="No upcoming charges. Add one to get started." />
      )}
      <button
        className="self-center p-2 mt-auto underline rounded-md"
        onClick={handleSeeAll}
        aria-label="See All"
        disabled={!hasUpcomingCharges}
      >
        {!hasUpcomingCharges ? "" : <span> See all</span>}
      </button>
    </section>
  );
}
