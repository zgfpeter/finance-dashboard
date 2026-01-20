// done
"use client";
// imports
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
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { MdMenu, MdClose, MdInfo } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/app/store/modalSlice";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const dispatch = useDispatch();
  const sidebarWidth = 350;
  const { data: session } = useSession(); // get session
  const username = session?.user?.username; // get username
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // menu bar state
  const [earlyAccessBubble, setEarlyAccessBubble] = useState(false); // early access info bubble state
  const { resolvedTheme, setTheme } = useTheme();
  const earlyAccessRef = useRef<HTMLDivElement | null>(null);

  const isDark = resolvedTheme === "dark";
  // toggles menu
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    // Schedule the state update after the effect phase
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // handle clicks outside the early access info bubble
  useEffect(() => {
    if (!earlyAccessBubble) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        earlyAccessRef.current &&
        !earlyAccessRef.current.contains(event.target as Node)
      ) {
        setEarlyAccessBubble(false);
      }
    }
    // listen for clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [earlyAccessBubble]);

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
        {/* navbar menu links */}
        <ul className="flex flex-col px-10 text-(--primary-orange) h-2/3 justify-around w-full ">
          <Image src="/logo_1.png" width={300} height={200} alt="Logo"></Image>
          {/* </div> */}
          <section
            className="self-center w-fit"
            onClick={(e) => setEarlyAccessBubble(!earlyAccessBubble)}
          >
            <div className="relative flex items-center gap-1">
              {/* Info icon */}
              Early access
              <MdInfo
                className="text-(--primary-orange) cursor-pointer"
                size={22}
              />
              {/* Info bubble */}
              <AnimatePresence>
                {earlyAccessBubble && (
                  <motion.div
                    ref={earlyAccessRef}
                    initial={{ opacity: 0, scale: 0.95, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 flex flex-col p-3 mt-2  text-white -translate-x-1/2 bg-black border rounded-md left-30 w-60 h-fit top-full border-(--primary-orange)"
                  >
                    <button
                      className="absolute text-lg right-1 top-1"
                      onClick={(e) => setEarlyAccessBubble(false)}
                    >
                      <MdClose color="red" />
                    </button>
                    <span>Early Access</span>
                    <span className="opacity-80">
                      Free during development. Pricing will be introduced later.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
          <button
            onClick={() => dispatch(openModal({ type: "pricing", data: null }))}
          >
            Upgrade
          </button>
          {/* display username */}
          <p className="self-center px-5 py-1 text-xl text-center text-transparent border-l border-r border-orange-500 rounded-md bg-linear-to-r from-teal-500 via-cyan-600 to-teal-900 bg-clip-text w-fit ">
            {username}
          </p>

          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col justify-between gap-3">
              <button
                className="hover:bg-(--hover-blue) hover:text-(--text-light) group w-fit p-2 text-sm"
                onClick={() =>
                  dispatch(openModal({ type: "settings", data: null }))
                }
                aria-label="Settings"
              >
                <span className="relative flex items-center gap-2">
                  <FaWrench /> SETTINGS
                  {/* underline animation */}
                  <span
                    className="absolute -bottom-1 left-0 h-1 rounded-md bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"
                    aria-hidden="true"
                  ></span>
                </span>
              </button>
              <button
                className="hover:bg-(--hover-blue) hover:text-(--text-light) group w-fit p-2 text-sm"
                aria-label="contact"
                onClick={() =>
                  dispatch(openModal({ type: "contact", data: null }))
                }
              >
                <span className="relative flex items-center gap-2">
                  <FaEnvelope /> CONTACT
                  {/* underline animation */}
                  <span
                    className="absolute -bottom-1 left-0 h-1 rounded-md bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"
                    aria-hidden="true"
                  ></span>
                </span>
              </button>
              {/* import / export button */}
              <button
                className="hover:bg-(--hover-blue) hover:text-(--text-light) group w-fit p-2 text-sm flex items-center gap-1"
                aria-label="Import/export data"
                onClick={() =>
                  dispatch(openModal({ type: "importExport", data: null }))
                }
              >
                <span className="relative flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <FaFileImport />
                    IMPORT
                  </span>
                  /
                  <span className="flex items-center gap-1">
                    EXPORT <FaFileExport />
                  </span>
                  <span
                    //  underline animation
                    className="absolute -bottom-1 left-0 h-1 rounded-md bg-(--limegreen) transition-all duration-300 w-0 group-hover:w-full"
                    aria-hidden="true"
                  ></span>
                </span>
              </button>
            </div>
            {/* the light/dark toggle  */}
            {mounted && (
              <div
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`
        flex items-center w-15 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isDark ? "bg-slate-800" : "bg-stone-300"
        }`}
              >
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5 overflow-hidden"
                  //  Move the handle based on theme state
                  animate={{
                    x: isDark ? 30 : 0, // Moves 30px to the right
                    rotate: isDark ? 360 : 0, // Spins 360 degrees
                  }}
                  // The spring gives it that physical rolling effect
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* sun icon */}
                  <motion.div
                    className="absolute "
                    animate={{
                      scale: isDark ? 0 : 1,
                      opacity: isDark ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSun size={18} />
                  </motion.div>
                  {/* moon icon */}
                  <motion.div
                    className="absolute "
                    animate={{
                      scale: isDark ? 1 : 0,
                      opacity: isDark ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaMoon size={18} />
                  </motion.div>
                </motion.div>
              </div>
            )}
          </div>
        </ul>

        {/* Sign out button */}
        <motion.div
          className="relative self-center mb-20 w-36"
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
            onClick={() => signOut({ callbackUrl: "/user-login" })}
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

      {/* Background overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            onClick={toggleMenu}
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Navbar toggle button */}
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
