import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbPointFilled } from "react-icons/tb";

export default function Transactions() {
  return (
    <section className="bg-(--hover-blue) flex flex-col text-(--text-light) rounded-xl gap-3 w-full">
      <h2 className="flex items-center gap-2 p-2 rounded-xl text-xl mb-2">
        <FaMoneyBillTransfer /> Transactions
      </h2>
      {/* total balance-current net worth across accounts */}
      <ul className="flex flex-col gap-2 ">
        {/* each transaction li is a grid with 2 columns, one for company+date and one for amount */}
        <li className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <TbPointFilled color="green" />

            <div className="flex flex-col">
              <span>Company</span>
              <span>01/11</span>
            </div>
          </div>
          <p className="text-green-500">+ €500.00</p>
        </li>
        <li className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <TbPointFilled color="red" />
            <div className="flex flex-col">
              <span>Sklavenitis</span>
              <span>02/11</span>
            </div>
          </div>
          <p className="text-red-500">- €25.63</p>
        </li>
        <li className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <TbPointFilled color="red" />
            <div className="flex flex-col">
              <span>ZARA</span>
              <span>19/11</span>
            </div>
          </div>
          <p className="text-red-500">- €45.99</p>
        </li>
        <li className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <TbPointFilled color="red" />
            <div className="flex flex-col">
              <span>e-food</span>
              <span>20/11</span>
            </div>
          </div>
          <p className="text-red-500">- €16.99</p>
        </li>
        <li className="grid grid-cols-2 items-center bg-(--border-blue) p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <TbPointFilled color="red" />
            <div className="flex flex-col">
              <span>Skroutz</span>
              <span>24/11</span>
            </div>
          </div>
          <p className="text-red-500">- €37.49</p>
        </li>
      </ul>
      <button className="underline p-2 w-fit self-center rounded-xl">
        See All
      </button>
    </section>
  );
}
