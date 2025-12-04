"use client";
import { MdDelete, MdEdit } from "react-icons/md";
import { useState } from "react";
import Image from "next/image";

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [changeAvatar, setChangeAvatar] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  function handleDelete() {}
  return (
    <div
      className=" h-full flex items-center flex-col justify-between relative"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
        aria-label="Close modal"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="w-full flex justify-around items-center h-full">
        <div className="flex flex-col h-full justify-evenly relative">
          <h3 className="flex  justify-between items-center">
            <span>joedoghnut</span>
          </h3>

          <div className="flex items-center gap-1">
            <p>joedoenut@example.com</p>
          </div>

          <div className="flex items-center gap-3 relative ">
            <label htmlFor="currencies">Currency</label>
            {/* {errors.type && (
                            <span className="text-red-500">{errors.type}</span>
                          )} */}
            <select
              id="currencies"
              // value={data.category}
              // onChange={handleChange}
              name="currencies"
              required
              className="border border-(--secondary-blue) px-2 rounded h-11 flex w-15"
            >
              <option value="eur">€</option>
              <option value="usd">$</option>
              <option value="gbp">£</option>
            </select>
          </div>
        </div>

        <div
          className="flex flex-col items-center gap-1 relative hover:cursor-pointer h-50 w-50"
          onMouseEnter={() => setChangeAvatar(true)}
          onMouseLeave={() => setChangeAvatar(false)}
        >
          <Image
            src="/userProfile.jpg"
            alt="user profile photo"
            fill
            className="border border-(--primary-orange) rounded-full object-cover"
            // object-cover so that the image keeps it's aspect ratio
          ></Image>
          {changeAvatar && (
            <button className=" bg-(--primary-blue)/80 border border-(--primary-orange) h-full  w-full rounded-full absolute">
              Change
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-10">
        <button
          className="flex items-center justify-center p-3 gap-1 border rounded  hover:border-orange-500 w-40"
          onClick={() => setOpenConfirmationModal(true)}
        >
          <MdEdit className="pt-px" color="orange" /> Edit Details
        </button>
        <button
          className="flex items-center justify-center p-3 gap-1 border rounded  hover:border-red-500 w-40"
          onClick={() => setOpenConfirmationModal(true)}
        >
          <MdDelete className="pt-px" color="red" /> Delete Account
        </button>
      </div>
      {/* position:fixed, doesn't move when scrolling */}
      {/* inset is shorthand for top-0, bottom-0,left-0,right-0 */}
      {openConfirmationModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          onClick={() => setOpenConfirmationModal(false)}
        ></div>
      )}
      {openConfirmationModal && (
        <div
          className="fixed z-30 bg-(--primary-blue) p-5 rounded shadow-lg top-1/2 left-1/2
                      -translate-x-1/2 -translate-y-1/2 w-9/10 max-w-xl h-75 text-center flex flex-col justify-evenly gap-5 border border-cyan-500 "
        >
          <h2 className="text-lg font-semibold ">
            Are you sure you want to delete your account?
          </h2>
          <p className="text-stone-400 ">
            Please note that this is permanent and all your data will be erased.
          </p>

          <div className="flex justify-around w-full ">
            <button
              className="flex items-center justify-evenly p-3 gap-1 border rounded  hover:border-cyan-500 w-40"
              onClick={() => setOpenConfirmationModal(false)}
            >
              Cancel
            </button>
            <button className="flex items-center justify-center p-3 gap-1 border rounded bg-red-800  hover:text-red-500 w-40">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
