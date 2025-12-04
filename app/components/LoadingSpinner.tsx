"use client";

import { motion } from "framer-motion";

// custom loading spinner
export default function LoadingSpinner() {
  return (
    <motion.div
      className="w-25 h-25 border border-t-teal-700 border-r-transparent border-b-teal-700 border-l-transparent  rounded-full absolute object-contain"
      animate={{
        rotate: 360,
        scale: [1, 1.5, 1],
      }}
      transition={{
        rotate: {
          repeat: Infinity,
          duration: 0.5, // very slow rotation
          ease: "linear",
        },
        scale: {
          repeat: Infinity,
          duration: 2, // for the pulse
          ease: "easeInOut",
        },
      }}
      // if i keep the scale and rotate durations in one object, doesn't work as i want it to
    ></motion.div>
  );
}
