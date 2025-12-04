// "use client";

// import { ReactNode, useEffect } from "react";

// interface ModalProps {
//   title?: string;
//   onClose: () => void;
//   children: ReactNode;
// }

// export function Modal({ title, onClose, children }: ModalProps) {
//   // close modal with ESC
//   useEffect(() => {
//     function handleESC(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     window.addEventListener("keydown", handleESC);
//     return () => window.removeEventListener("keydown", handleESC);
//   }, [onClose]);

//   return (
//     <div
//       className=" h-full flex items-center flex-col justify-evenly "
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
//       <button
//         onClick={onClose}
//         className="absolute right-10 top-4 text-red-500 text-xl"
//         aria-label="Close modal"
//       >
//         ✕
//       </button>

//       {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
//       {/* Content */}
//       <section className="flex flex-col w-full p-3">{children}</section>
//     </div>
//   );
// }
