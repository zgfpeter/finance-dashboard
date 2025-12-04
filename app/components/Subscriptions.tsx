"use client";
import { LuBellRing } from "react-icons/lu";
import { useState } from "react";
import { MdClose, MdEdit, MdDelete } from "react-icons/md";
import { useDashboard } from "../hooks/useDashboard";
import { useModal } from "../context/ModalContext";
export default function Subscriptions() {
  const [notificationsModalOpen, setNotificationsModalOpen] =
    useState<boolean>(false);
  // track which item is to be deleted and show the delete confirmation modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [notify, setNotify] = useState<boolean>(false);
  const [tempNotify, setTempNotify] = useState<boolean>(notify); /// for inside the modal

  const SubscriptionsData = useDashboard().data?.subscriptions;

  // for the filtered result ( ex. a charge is deleted )
  const [filteredData, setFilteredData] = useState(SubscriptionsData || []);

  const { openModal } = useModal();

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

  function handleDelete(id: string) {
    if (!SubscriptionsData) return;
    setFilteredData((prev) => prev.filter((charge) => charge._id !== id));
    setDeleteId(null); // close the delete overlay;
  }

  return (
    <section className="bg-(--hover-blue) row-span-1 row-start-1 col-span-1 col-stat-3 flex flex-col  rounded-xl gap-3 h-full w-full relative">
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
              checked={tempNotify}
              onChange={(e) => setTempNotify(e.target.checked)}
            />
            <span className="w-3/4">
              Notify me about upcoming subscription charges:
            </span>
            <span
              className="h-5 w-5 min-w-5 min-h-5 rounded border border-blue-600 peer-checked:bg-blue-600 peer-checked:border-blue-600
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
      <h2 className="flex items-center justify-between gap-2 p-2 rounded-xl text-xl mb-2">
        {/* <FaMoneyBillTransfer /> Transactions */}
        Subscriptions
        <button
          className="p-1"
          onClick={handleNotifications}
          aria-label="Notifications"
        >
          <LuBellRing color="#efbd08" />
        </button>
      </h2>
      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-2 h-70 overflow-y-auto ">
        {filteredData?.map((charge) => {
          return (
            <li
              key={charge._id}
              className="grid grid-cols-2 justify-items-stretch items-center bg-(--border-blue) p-2 rounded-xl relative"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col ">
                  <span>{charge.company}</span>
                  <span>{charge.date}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-yellow-500 ">- € {charge.amount}</div>
                <div className="flex items-center gap-1 ">
                  <button
                    className="p-1 "
                    onClick={() => setDeleteId(charge._id)}
                    aria-label="Delete"
                  >
                    <MdDelete color="red" />
                  </button>
                </div>
              </div>
              {deleteId === charge._id && (
                <div className="absolute inset-0 bg-(--primary-blue)  rounded-xl flex flex-col items-center justify-center gap-1 z-20">
                  <p>Are you sure you want to delete this item?</p>

                  <div className="flex items-center ">
                    <button
                      className="px-3 text-stone-500 hover:text-stone-600 "
                      onClick={() => setDeleteId(null)}
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 text-red-500  hover:text-red-600"
                      onClick={() => {
                        // // TODO: perform deletion here
                        // setDeleteId(null);
                        handleDelete(charge._id);
                      }}
                      aria-label="Confirm Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
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
