"use client";
import { MdEmail, MdDelete } from "react-icons/md";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [changeAvatar, setChangeAvatar] = useState(false);
  return (
    <div className=" h-full flex items-center flex-col justify-between  text-(--text-light)">
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="w-full flex justify-evenly items-center">
        <div className="flex flex-col gap-3 justify-center">
          <h3 className="flex flex-col ">joedoghnut</h3>
          <div className="flex items-center gap-1">
            <MdEmail className="pt-px" color="orange" />
            <p>joedoenut@example.com</p>
          </div>
          <Link href="/" className="underline text-stone-400">
            Change email
          </Link>
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
            <button className=" bg-(--primary-blue)/80 border border-(--primary-orange) h-full  w-full rounded-full absolute hover:cursor-pointer">
              Change
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center p-3 gap-1 border rounded  hover:border-red-500 hover:cursor-pointer">
        <MdDelete className="pt-px" color="red" />
        <Link href="" className=" ">
          Delete Account
        </Link>
      </div>
    </div>
  );
}
