"use client";
import { LuBellRing } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { MdClose, MdEdit, MdDelete } from "react-icons/md";
import { useDashboard } from "../hooks/useDashboard";
import { useModal } from "../context/ModalContext";
import axios from "axios";
export default function UpcomingCharges() {
  const UCData = useDashboard().data?.upcomingCharges;
  console.log(UCData);
  const { openModal } = useModal();
  const [notificationsModalOpen, setNotificationsModalOpen] =
    useState<boolean>(false);

  // const [notify, setNotify] = useState<boolean>(false);
  // const [tempNotify, setTempNotify] = useState<boolean>(notify); /// for inside the modal

  // // for the filtered result ( ex. a charge is deleted )
  // const [filteredData, setFilteredData] = useState(UCData || []);

  // function handleNotifications() {
  //   setNotificationsModalOpen(!notificationsModalOpen);
  // }

  // function handleSaveNotify() {
  //   setNotify(tempNotify); // save choice from modal, update state of checkbox
  //   setNotificationsModalOpen(false);
  // }

  // function handleDontNotify() {
  //   setTempNotify(notify); // change to original value, if user doesn't save
  //   setNotificationsModalOpen(false);
  // }

  return (
    <section className="bg-(--hover-blue) row-span-1 row-start-1 col-span-1 col-stat-3 flex flex-col text-(--text-light) rounded-xl gap-3 h-full w-full relative">
      {notificationsModalOpen && (
        <section className="absolute bg-(--primary-blue) h-full w-full inset-0 flex flex-col items-center justify-evenly gap-3 z-10">
          <button
            className="absolute top-3 right-3 p-1 text-2xl"
            onClick={() => setNotificationsModalOpen(false)}
            aria-label="Close Notification Modal"
          >
            <MdClose></MdClose>
          </button>
          <label className="flex items-center justify-evenly cursor-pointer px-2 w-full">
            {/* custom checkbox, easier to style */}
            <input
              type="checkbox"
              className="peer hidden accent-white"
              // checked={tempNotify}
              // onChange={(e) => setTempNotify(e.target.checked)}
            />
            <span>Notify me about upcoming charges:</span>
            <span
              className="h-5 w-5 min-w-5 min-h-5 rounded border border-blue-600 peer-checked:bg-blue-600 peer-checked:border-blue-600
                peer-checked:ring-2 peer-checked:ring-blue-600 
              "
            ></span>
          </label>
          <div className="flex justify-evenly w-full">
            <button
              className="px-2 py-1 "
              // onClick={handleDontNotify}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 text-teal-600"
              // onClick={handleSaveNotify}
              aria-label="Save"
            >
              Save
            </button>
          </div>
        </section>
      )}
      <div className="flex items-center justify-between ">
        <h2 className="flex items-center gap-2 p-2 rounded-xl text-xl">
          Upcoming Charges
        </h2>

        <div className="flex gap-5">
          <button
            className="p-1"
            // onClick={handleNotifications}
            aria-label="Notifications"
          >
            <span className="text-yellow-500">
              <LuBellRing />
            </span>
          </button>
          <button
            className="text-2xl flex items-center"
            onClick={() => openModal("addUpcomingCharge")}
          >
            <span className="text-yellow-500">
              <FaPlus />
            </span>
          </button>
        </div>
      </div>
      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-2 h-70 overflow-y-auto ">
        {/* {filteredData?.map((charge) => { */}
        {UCData?.map((charge) => {
          return (
            <li
              key={charge._id}
              className="grid grid-cols-2 justify-items-stretch items-center bg-(--border-blue) p-2 rounded-xl relative"
            >
              <div className="flex items-center gap-2">
                {/* <FaPlus color="green" /> */}

                <div className="flex flex-col ">
                  <span>{charge.company}</span>
                  <span>{charge.date}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-yellow-500 ">- € {charge.amount}</div>
                <div className="flex items-center gap-1 ">
                  {/* <button
                    className="p-1 hover:cursor-pointer"
                    aria-label="Edit"
                  >
                    <MdEdit color="orange" />
                  </button> */}
                  {/* <button
                    className="p-1 hover:cursor-pointer mr-3"
                    aria-label="Delete"
                  >
                    <MdDelete color="red" />
                  </button> */}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        className="underline p-2 w-fit self-center rounded-xl mt-auto"
        onClick={() => openModal("upcomingCharges")}
        aria-label="See All"
      >
        See All
      </button>
    </section>
  );
}
