"use client";
import { MdClose, MdDelete, MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { motion, AnimatePresence } from "framer-motion"; // import Framer Motion

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  const username = user?.username || "";
  const currency = user?.currency || "EUR";
  const avatarUrl = user?.avatarUrl || "";
  const [deleteAccountMessage, setDeleteAccountMessage] = useState("");

  const dispatch = useDispatch();
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  // handle delete with fade-out
  function handleDelete() {
    // show message immediately
    setDeleteAccountMessage(
      "We received your request and are working on it. This might take a few days."
    );
  }

  // automatically clear message after 2 seconds
  useEffect(() => {
    if (!deleteAccountMessage) return;

    const timer = setTimeout(() => {
      setDeleteAccountMessage("");
      setOpenConfirmationModal(false);
    }, 2000);

    return () => clearTimeout(timer); // cleanup if message changes quickly
  }, [deleteAccountMessage]);

  return (
    <div
      className="flex flex-col items-center h-full py-10 "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute text-xl text-red-500 right-10 top-4"
        aria-label="Close modal"
      >
        ✕
      </button>
      <h2 className="mb-4 text-xl font-semibold">Settings</h2>
      <div className="flex items-center justify-around w-full h-full">
        <div className="relative flex flex-col justify-center h-full gap-5">
          <h3 className="flex items-center justify-between">
            <span>{user?.username}</span>
          </h3>

          <div className="flex items-center gap-1">
            <p>{user?.email}</p>
          </div>

          <div className="relative flex items-center gap-3 ">
            <p>
              Currency:{" "}
              <span>
                {user?.currency &&
                  currencies[user.currency as CurrencyCode]?.symbol}
              </span>
            </p>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-1 hover:cursor-pointer h-50 w-50">
          <Image
            src="/userProfile.jpg"
            alt="user profile photo"
            fill
            className="border border-(--primary-orange) rounded-full object-cover"
            // object-cover so that the image keeps its aspect ratio
          ></Image>
          {/* {changeAvatar && (
            <button className=" bg-(--primary-blue)/80 border border-(--primary-orange) h-full  w-full rounded-md absolute">
              Change
            </button>
          )} */}
        </div>
      </div>
      <div className="relative flex gap-10">
        <button
          className="flex items-center gap-1 p-3 hover:text-orange-400 "
          onClick={() =>
            dispatch(
              openModal({
                type: "editSettings",
                data: { username, currency, avatarUrl },
              })
            )
          }
        >
          <MdEdit className="pt-px" color="orange" /> Edit Details
        </button>
        <button
          className="flex items-center gap-1 p-3 hover:text-red-500"
          onClick={() => setOpenConfirmationModal(true)}
        >
          <MdDelete className="pt-px " color="red" /> Delete Account
        </button>
      </div>
      {/* position:fixed, doesn't move when scrolling */}
      {/* inset is shorthand for top-0, bottom-0,left-0,right-0 */}
      {openConfirmationModal && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpenConfirmationModal(false)}
        ></div>
      )}
      {openConfirmationModal && (
        <div
          className="fixed z-30 bg-(--primary-blue)  rounded-md shadow-lg top-1/2 left-1/2
                      -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-75 text-center flex flex-col justify-evenly gap-5 border border-cyan-500 "
        >
          {/* Animated delete message */}
          <AnimatePresence>
            {deleteAccountMessage && (
              <motion.div
                key="deleteMessage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute z-40 flex items-center w-full h-full bg-black rounded-md"
              >
                <button className="absolute text-2xl text-red-500 top-5 right-5">
                  <MdClose />
                </button>
                {deleteAccountMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-lg font-semibold ">
            Are you sure you want to delete your account?
          </h2>
          <p className="flex flex-col text-stone-400">
            <span className="font-semibold text-red-500">Warning! </span>
            <span>This cannot be undone. All your data will be erased.</span>
          </p>

          <div className="flex items-center justify-evenly">
            <button
              className="flex items-center justify-center px-3 hover:text-emerald-600 h-11"
              onClick={() => setOpenConfirmationModal(false)}
            >
              Cancel
            </button>
            <button
              className="flex items-center justify-center px-3 text-red-500 hover:text-red-600 h-11"
              onClick={(e) => handleDelete()}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
