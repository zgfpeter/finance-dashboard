"use client";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaSignOutAlt,
  FaFileImport,
  FaFileExport,
  FaWrench,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { MdMenu, MdClose } from "react-icons/md";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { useSession } from "next-auth/react";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const sidebarWidth = 350;
  const { data: session } = useSession();
  const username = session?.user?.username; // get username
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Schedule the state update after the effect phase
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <div className="relative z-50">
      {/* Sidebar */}
      <motion.nav
        className={`fixed top-0 left-0 h-screen bg-(--primary-blue)  flex flex-col justify-between z-50 w-[350px] max-w-[80%]`}
        initial={{ x: -sidebarWidth }}
        animate={{ x: menuOpen ? 0 : -sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        aria-label="Sidebar navigation"
      >
        <ul className="flex flex-col px-10 text-(--primary-orange) h-2/3 justify-around w-full">
          <div className="flex flex-col items-center justify-center ">
            <Image
              src="/logo_1.png"
              width={300}
              height={200}
              alt="Logo"
            ></Image>
          </div>

          <p className="bg-linear-to-r from-teal-500 via-cyan-600 to-teal-900 bg-clip-text text-transparent text-center text-xl  border-l border-r border-orange-500 w-fit self-center px-5 py-1 rounded-md ">
            {username}
          </p>

          <div className="flex justify-between py-3 items-center">
            <button
              className="hover:bg-(--hover-blue) hover:text-(--text-light) group w-fit"
              onClick={() =>
                dispatch(openModal({ type: "settings", data: null }))
              }
              aria-label="Settings"
            >
              <span className="flex items-center gap-2 relative">
                <FaWrench /> SETTINGS
                <span
                  className="absolute -bottom-1 left-0 h-1 rounded-md bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"
                  aria-hidden="true"
                ></span>
              </span>
            </button>

            {/* the light/dark toggle  */}
            {mounted && (
              <div
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`
        flex items-center w-15 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300
        ${isDark ? "bg-slate-800" : "bg-stone-300"}
      `}
              >
                <motion.div
                  className="w-5 h-5 bg-(--text-light) rounded-full shadow-lg flex items-center justify-center relative overflow-hidden"
                  // 1. Move the handle based on theme state
                  animate={{
                    x: isDark ? 30 : 0, // Moves 30px to the right
                    rotate: isDark ? 360 : 0, // Spins 360 degrees
                  }}
                  // 2. The spring gives it that physical "rolling" feel
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* SUN ICON */}
                  <motion.div
                    className="absolute text-orange-500"
                    animate={{
                      scale: isDark ? 0 : 1,
                      opacity: isDark ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSun size={18} />
                  </motion.div>
                  {/* MOON ICON */}
                  <motion.div
                    className="absolute "
                    animate={{
                      scale: isDark ? 1 : 0,
                      opacity: isDark ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaMoon size={16} />
                  </motion.div>
                </motion.div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs w-full justify-between rounded-md ">
            <button className=" hover:bg-(--hover-blue) hover:text-(--text-light) w-36 ">
              <div
                className="border px-2 py-3 rounded-md border-(--error-blue) hover:rounded-none transition-all duration-300 flex items-center justify-center gap-3 w-full "
                aria-label="Import data"
              >
                <span>IMPORT</span>
                <FaFileImport />
              </div>
            </button>
            <button
              className="hover:bg-(--hover-blue) hover:text-(--text-light) w-36"
              aria-label="Export data"
            >
              <div className="border px-2 py-3 rounded-md border-(--error-blue) hover:rounded-none transition-all duration-300 flex items-center justify-center gap-3 ">
                <span>EXPORT</span>
                <FaFileExport />
              </div>
            </button>
          </div>
        </ul>

        {/* Sign Out */}
        <motion.div
          className="relative w-36 self-center mb-20"
          initial="initial"
          whileHover="hover"
        >
          {" "}
          <motion.div
            className=" absolute inset-0 border-8 border-(--text-light)"
            variants={{ initial: { rotate: 5 }, hover: { rotate: 0 } }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          ></motion.div>{" "}
          <button
            onClick={() => signOut({ callbackUrl: "/UserLogin" })}
            className=" relative w-full h-20 flex items-center justify-center border-8 gap-3 text-(--primary-orange) border-(--primary-orange) "
            aria-label="Sign out"
          >
            {" "}
            SIGN OUT
            <motion.div variants={{ hover: { color: "rgba(255,255,255,1)" } }}>
              {" "}
              <FaSignOutAlt />{" "}
            </motion.div>{" "}
          </button>
        </motion.div>
      </motion.nav>

      {/* Background Overlay */}
      {/* TODO space button and page content properly */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-4.5 left-3  lg:top-1/2 lg:-translate-y-1/2 rounded-full bg-(--primary-orange) text-white flex items-center justify-center text-4xl z-30 w-16 h-16 "
        aria-label="Toggle Menu"
        animate={{
          x: menuOpen ? sidebarWidth : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        {menuOpen ? <MdClose /> : <MdMenu />}
      </motion.button>
    </div>
  );
}
