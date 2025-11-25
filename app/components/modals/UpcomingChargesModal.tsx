"use client";

interface Props {
  onClose: () => void;
}
import { MdEdit, MdDelete } from "react-icons/md";
import { useDashboard } from "@/app/hooks/useDashboard";
import { useState } from "react";
import { UpcomingCharge } from "@/lib/types/dashboard";
export default function UpcomingChargesModal({ onClose }: Props) {
  const UCData = useDashboard().data?.upcomingCharges;
  const [displayedCharges, setDisplayedCharges] = useState(UCData || []);

  function handleSearch(searchTerm: string) {
    if (!UCData) {
      // UCData is empty
      return;
    }
    const result = UCData?.filter((charge) => {
      return charge.company.toLowerCase().includes(searchTerm);
    });

    setDisplayedCharges(result); // set displayed charges to be the result
  }

  return (
    <div className=" text-(--text-light) rounded">
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Upcoming Charges</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-5 mb-2 rounded-xl"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul className="flex flex-col gap-2 h-100 overflow-y-auto ">
        {displayedCharges?.map((charge) => {
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
              <div className="flex justify-between">
                <div className="text-yellow-500 ">- € {charge.amount}</div>
                <div className="flex items-center gap-1 ">
                  <button className="p-1 hover:cursor-pointer">
                    <MdEdit color="orange" />
                  </button>
                  <button className="p-1 hover:cursor-pointer">
                    <MdDelete color="red" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
