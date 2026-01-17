"use client";
import React, { useEffect, useRef } from "react";

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
  ariaLabel?: string;
}

// the general Modal component that will give the overall structure to Modals
export default function ModalWrapper({
  onClose,
  children,
  widthClass = "w-96",
  ariaLabel = "Modal",
}: ModalWrapperProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  // can be closed with escape ESC key

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // prevent background scroll while modal is open

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ALWAYS clean up useEffect, otherwise i can't scroll outside the modal after i close it.
    return () => {
      document.body.style.overflow = prev; // restore original value
    };
  }, []);

  const onOverlayClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-999 "
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={onOverlayClick} //  mouse down
    >
      {/* for the overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className={`relative z-10 ${widthClass} py-3 bg-(--primary-blue) rounded-md shadow-xl p-1  border-2 border-teal-500 flex flex-col overflow-hidden`}
        onMouseDown={(e) => e.stopPropagation()} // avoid closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
}
