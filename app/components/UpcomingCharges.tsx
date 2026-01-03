"use client";
import { LuBellRing } from "react-icons/lu";
import { FaPlus, FaClock } from "react-icons/fa6";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useDashboard } from "../hooks/useDashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { calculateDeadline, prettifyDate } from "@/lib/utils";
import LoadingSpinner from "./ui/LoadingSpinner";
import EmptyState from "./ui/EmptyState";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
export default function UpcomingCharges() {
  const { data, isLoading, isError } = useDashboard();

  const UCData = data?.upcomingCharges || [];
  // console.log(UCData);
  // const { openModal } = useModal();
  const [notificationsModalOpen, setNotificationsModalOpen] =
    useState<boolean>(false);
  const dispatch = useDispatch();

  const hasUpcomingCharges = UCData.length > 0; // if true, there are some transactions
  const showEmptyState = !isLoading && !hasUpcomingCharges;
  const showUpcomingCharges = !isLoading && hasUpcomingCharges;

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

  if (isLoading) {
    return <LoadingState message="Loading upcoming charges..." />;
  }

  if (isError) {
    return <ErrorState message="Could not load upcoming charges." />;
  }

  if (!hasUpcomingCharges) {
    return (
      <EmptyState message="No upcoming charges. Add one to get started." />
    );
  }

  return (
    <section className="row-span-1 row-start-1 col-span-1 col-stat-3 flex flex-col  rounded-xl gap-3 h-full min-h-50 w-full relative">
      {/* backdrop for the notifications modal */}
      {notificationsModalOpen && (
        <div className="absolute h-full inset-0 bg-black/50 backdrop-blur-sm z-10 "></div>
      )}
      {/* notifications modal */}
      {notificationsModalOpen && (
        <section
          className="absolute bg-(--primary-blue) h-full self-center w-full inset-0 flex flex-col items-center justify-center gap-5 z-10 rounded-xl "
          role="dialog"
        >
          <button
            className="absolute top-3 right-3 p-1 text-2xl"
            onClick={() => setNotificationsModalOpen(false)}
            aria-label="Close Notification Modal"
          >
            <MdClose></MdClose>
          </button>
          <label className="flex items-center justify-center gap-3 cursor-pointer px-2 w-full">
            {/* custom checkbox, easier to style */}
            <input
              type="checkbox"
              className="peer hidden accent-white "
              checked={tempNotify}
              onChange={(e) => setTempNotify(e.target.checked)}
            />
            <span>Notify me about upcoming charges:</span>
            <span
              className="h-5 w-5 rounded border border-blue-600 peer-checked:bg-blue-600 peer-checked:border-blue-600
                peer-checked:ring-2 peer-checked:ring-blue-600 
              "
            ></span>
          </label>
          <div className="flex justify-evenly w-full">
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
        <h2 className="flex items-center gap-2 p-2 rounded-xl text-xl">
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
            className="text-xl flex items-center"
            onClick={handleAddUpcomingCharge}
          >
            <span className="text-yellow-500">
              <FaPlus />
            </span>
          </button>
        </div>
      </div>

      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-2 h-96 overflow-y-auto ">
        {UCData.map((charge) => {
          const deadline = calculateDeadline(charge.date);
          return (
            <li
              key={charge._id}
              className="bg-(--border-blue) rounded-xl relative  grid grid-cols-[2fr_2fr_1fr] grid-rows-2 items-center text-sm py-2 "
            >
              {/* <FaPlus color="green" /> */}

              {charge.category && (
                <div className="text-xs  text-yellow-500 p-1">
                  {charge.category}
                </div>
              )}
              <div className="p-1 overflow-hidden whitespace-nowrap text-ellipsis row-start-2 ">
                {charge.company}
              </div>

              <p className=" text-yellow-500  p-1 overflow-hidden whitespace-nowrap text-ellipsis row-start-2">
                - € {charge.amount}
              </p>

              <div className="text-xs col-start-3 row-span-2 flex flex-col gap-2">
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

                <p className="text-xs">{prettifyDate(charge.date)}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        className="underline p-2 self-center rounded-xl mt-auto"
        onClick={handleSeeAll}
        aria-label="See All"
      >
        See All
      </button>
    </section>
  );
}
