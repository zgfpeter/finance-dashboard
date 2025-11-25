"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaRegUserCircle,
  FaSignOutAlt,
  FaFileImport,
  FaFileExport,
} from "react-icons/fa";
import { FaGear, FaMoneyBillTransfer } from "react-icons/fa6";
import { MdMenu, MdClose } from "react-icons/md";
import { useState } from "react";
import { useModal } from "../context/ModalContext";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarWidth = 300;
  const { openModal } = useModal();

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <div className="relative z-50">
      {/* Sidebar */}
      <motion.nav
        className="fixed top-0 left-0 h-screen bg-(--primary-blue) w-[300px] flex flex-col justify-between z-50"
        initial={{ x: -sidebarWidth }}
        animate={{ x: menuOpen ? 0 : -sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <ul className="flex flex-col text-(--primary-orange)  h-2/3 justify-evenly">
          <li className="px-10 flex items-center justify-center">
            {/* <span className="absolute z-[-1]">
              <MdDashboard size={150} className="rounded-full" />
            </span> */}
            <Image src="/logo.png" width={150} height={150} alt="logo"></Image>
          </li>

          {/* Menu Items */}
          {/* <li className="relative px-10 py-5 flex items-center hover:bg-(--hover-blue) hover:text-white group hover:cursor-pointer">
            <Link href="/" className="flex items-center gap-3 relative">
              <FaRegUserCircle /> PROFILE
              <span className="absolute -bottom-1 left-0 h-1 rounded-full bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"></span>
            </Link>
          </li> */}
          <button
            className="relative px-10 py-5 flex items-center hover:bg-(--hover-blue) hover:text-white group hover:cursor-pointer"
            aria-label="Transactions"
          >
            <Link
              href="/"
              className="flex items-center gap-3 relative"
              onClick={() => openModal("transactions")}
            >
              <FaMoneyBillTransfer /> TRANSACTIONS
              <span className="absolute -bottom-1 left-0 h-1 rounded-full bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"></span>
            </Link>
          </button>
          <button
            className="relative px-10 py-5 flex items-center hover:bg-(--hover-blue) hover:text-white group hover:cursor-pointer"
            onClick={() => openModal("settings")}
            aria-label="Settings"
          >
            <Link href="/" className="flex items-center gap-3 relative">
              <FaGear /> SETTINGS
              <span className="absolute -bottom-1 left-0 h-1 rounded-full bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"></span>
            </Link>
          </button>
          <div className="flex items-center justify-evenly w-full text-sm ">
            <button className="relative py-5 flex items-center hover:bg-(--hover-blue) hover:text-white group hover:cursor-pointer">
              <Link
                href="/"
                className="flex items-center gap-3 relative"
                aria-label="Import"
              >
                <div className="flex items-center gap-1 border bottom-0 px-2 py-1 rounded-xl border-(--error-blue) hover:rounded-none transition-all duration-300">
                  <FaFileImport />
                  IMPORT
                </div>
                {/* <span className="absolute bottom-0 left-0 h-full rounded-full bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full z-0"></span> */}
              </Link>
            </button>
            <button className="relative py-5 flex items-center hover:bg-(--hover-blue) hover:text-white group hover:cursor-pointer ">
              <Link
                href="/"
                className="flex items-center gap-3 relative"
                aria-label="Export"
              >
                <div className="flex items-center gap-1 border bottom-0 px-2 py-1 rounded-xl border-(--error-blue) hover:rounded-none transition-all duration-300">
                  EXPORT
                  <FaFileExport />
                </div>
                {/* <span className="absolute bottom-0 left-0 h-full rounded-full bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full z-0"></span> */}
              </Link>
            </button>
          </div>
        </ul>

        {/* Sign Out */}
        <motion.div
          className="relative w-40 self-center mb-20"
          initial="initial"
          whileHover="hover"
        >
          {" "}
          <motion.div
            className=" absolute inset-0 border-8 text-(--limegreen)"
            variants={{ initial: { rotate: 5 }, hover: { rotate: 0 } }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          ></motion.div>{" "}
          <Link
            href="/signOut"
            className=" relative w-full py-5 flex items-center justify-center border-8 gap-3 text-(--primary-orange) border-(--primary-orange) "
            aria-label="Sign out"
          >
            {" "}
            SIGN OUT{" "}
            <motion.div variants={{ hover: { color: "rgba(255,255,255,1)" } }}>
              {" "}
              <FaSignOutAlt />{" "}
            </motion.div>{" "}
          </Link>
        </motion.div>
      </motion.nav>

      {/* Background Overlay */}
      {/* TODO space button and page content properly */}
      {menuOpen && (
        <motion.div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      )}

      {/* Toggle Button */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-4.5 left-0 md:left-0 lg:top-1/2 lg:-translate-y-1/2 rounded-full bg-(--primary-orange) text-white flex items-center justify-center text-4xl z-30 w-16 h-16 hover:cursor-pointer "
        aria-label="Toggle Menu"
        animate={{
          x: menuOpen ? sidebarWidth : 20,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {menuOpen ? <MdClose /> : <MdMenu />}
      </motion.button>
    </div>
  );
}
