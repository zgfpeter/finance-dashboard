"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type SpinnerSize = "sm" | "md" | "lg";

const sizeMap: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-4",
  lg: "w-16 h-16 border-4",
};

// custom loading spinner
export default function LoadingSpinner({
  size = "md",
}: {
  size?: SpinnerSize;
}) {
  return (
    <motion.span
      className={clsx(
        "inline-block rounded-full border-t-teal-700 border-b-teal-700 border-r-transparent border-l-transparent",
        sizeMap[size]
      )}
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
          duration: 1.5, // for the pulse
          ease: "easeInOut",
        },
      }}
      // if i keep the scale and rotate durations in one object, doesn't work as i want it to
    ></motion.span>
  );
}
