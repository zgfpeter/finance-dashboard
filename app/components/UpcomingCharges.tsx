"use client";
import { LuBellRing } from "react-icons/lu";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useDashboard } from "../hooks/useDashboard";
export default function UpcomingCharges() {
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [notify, setNotify] = useState(false);
  const [tempNotify, setTempNotify] = useState(notify); /// for inside the modal

  const UCData = useDashboard().data?.upcomingCharges;

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
    <section className="bg-(--hover-blue) row-span-1 row-start-1 col-span-1 col-stat-3 flex flex-col text-(--text-light) rounded-xl gap-3 h-full w-full relative">
      {notificationsModalOpen && (
        <section className="absolute bg-(--primary-blue) h-full w-full inset-0 flex flex-col items-center justify-evenly gap-3">
          <button
            className="absolute top-3 right-3 p-1 text-2xl"
            onClick={() => setNotificationsModalOpen(false)}
          >
            <MdClose></MdClose>
          </button>
          <label className="flex items-center justify-evenly cursor-pointer px-2 w-full">
            {/* custom checkbox, easier to style */}
            <input
              type="checkbox"
              className="peer hidden accent-white"
              checked={tempNotify}
              onChange={(e) => setTempNotify(e.target.checked)}
            />
            <span>Notify me about upcoming charges:</span>
            <span
              className="
    h-5 w-5 min-w-5 min-h-5 rounded border border-blue-600 
    peer-checked:bg-blue-600 peer-checked:border-blue-600
    peer-checked:ring-2 peer-checked:ring-blue-600 
  "
            ></span>
          </label>
          <div className="flex justify-evenly w-full">
            <button
              className="px-2 py-1 hover:cursor-pointer"
              onClick={handleDontNotify}
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 hover:cursor-pointer text-teal-600"
              onClick={handleSaveNotify}
            >
              Save
            </button>
          </div>
        </section>
      )}
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        {/* <FaMoneyBillTransfer /> Transactions */}
        Upcoming Charges
        <button className="p-1" onClick={handleNotifications}>
          <LuBellRing color="#efbd08" />
        </button>
      </h2>
      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-2 ">
        {UCData?.map((charge) => {
          return (
            <li
              key={charge.id}
              className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl"
            >
              <div className="flex items-center gap-2">
                {/* <FaPlus color="green" /> */}

                <div className="flex flex-col">
                  <span>{charge.company}</span>
                  <span>{charge.date}</span>
                </div>
              </div>
              <div className="text-yellow-500">- € {charge.amount}</div>
            </li>
          );
        })}
      </ul>
      <button className="underline p-2 w-fit self-center rounded-xl">
        See All
      </button>
    </section>
  );
}
