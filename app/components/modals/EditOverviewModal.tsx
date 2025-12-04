// "use client";

// import React, { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { DashboardData, Overview } from "@/lib/types/dashboard";
// import { useDashboard } from "@/app/hooks/useDashboard";

// interface Props {
//   onClose: () => void;
// }

// export default function EditOverviewModal({ onClose }: Props) {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//   const queryClient = useQueryClient();
//   const { data } = useDashboard();
//   // TODO fix these hardcoded values, decide if user inputs them or not

//   const overview = data?.overview;

//   // total account balance, need to decide if it's set by the user only or calculated from the transaction incomes?
//   const [totalBalance, setTotalBalance] = useState(
//     overview?.totalBalance?.toString() ?? ""
//   );
//   const [savings, setSavings] = useState(3500);
//   const [checkings, setCheckings] = useState(2347);

//   // TODO savings and checkings don't really exist, but maybe i should add them
//   // const [savings, setSavings] = useState(
//   //   overview?.savings?.toString() ?? ""
//   // );
//   // const [checkings, setCheckings] = useState(
//   //   overview?.checkings?.toString() ?? ""
//   // );

//   const [errors, setErrors] = useState<{ [k: string]: string }>({});

//   // the data will be of type Overview, which now has totalBalance and MonthlyChange
//   const updateOverview = useMutation({
//     mutationFn: (newData: Overview) =>
//       axios.put(`${apiURL}/api/dashboard/overview", newData),

//     // can do optimistic updates here
//     onMutate: async (newOverview) => {
//       await queryClient.cancelQueries({ queryKey: ["dashboardData"] });

//       // store the previous cache state, in case i need to restore
//       const previous = queryClient.getQueryData<DashboardData>([
//         "dashboardData",
//       ]);

//       queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => {
//         if (!old) return old;
//         return { ...old, overview: newOverview };
//       });

//       return { previous };
//     },

//     // if the PUT is a success
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
//       onClose();
//     },
//     // if the PUT is an error
//     onError: (_err, _newOverview, ctx) => {
//       queryClient.setQueryData(["dashboardData"], ctx?.previous);
//     },
//   });

//   function validate() {
//     const newErrors: { generalError: string; totalBalanceError: string } = {
//       generalError: "",
//       totalBalanceError: "",
//     };

//     if (Number(totalBalance) < 0)
//       newErrors.totalBalanceError = "Invalid number";
//     // if (Number(savings) < 0) newErrors.savings = "Invalid number";
//     // if (Number(checkings) < 0) newErrors.checkings = "Invalid number";

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!validate()) return;

//     updateOverview.mutate({
//       totalBalance: Number(totalBalance),
//       monthlyChange: 250,
//     });
//   }

//   return (
//     <div
//       className=" h-full flex items-center flex-col justify-evenly"
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
//       <h2 className="text-xl font-semibold">Editing Overview</h2>

//       <form
//         className="flex flex-col items-center w-full max-w-xl justify-evenly gap-5 relative"
//         onSubmit={handleSubmit}
//       >
//         <div className="w-full flex flex-col justify-between ">
//           <div className="flex flex-col p-3 gap-3 relative">
//             <label htmlFor="totalBalance">Total Balance</label>
//             {/* A general error if the form validation fails */}
//             {errors.totalBalance && (
//               <span className="text-red-500 absolute right-5">
//                 {errors.totalBalance}
//               </span>
//             )}
//             <input
//               type="text"
//               value={totalBalance}
//               required
//               onChange={(e) => setTotalBalance(e.target.value)}
//               name="totalBalance"
//               id="totalBalance"
//               className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
//             />
//           </div>
//           <div className="flex flex-col p-3 gap-3 relative">
//             <label htmlFor="savingsAccount">Savings Account</label>
//             {/* A general error if the form validation fails */}
//             {errors.savings && (
//               <span className="text-red-500 absolute right-5">
//                 {errors.savings}
//               </span>
//             )}
//             <input
//               type="text"
//               value={3500}
//               required
//               onChange={(e) => setSavings(Number(e.target.value))}
//               name="savingsAccount"
//               id="savingsAccount"
//               className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
//             />
//           </div>
//           <div className="flex flex-col p-3 gap-3 relative">
//             <label htmlFor="checkingsAccount">Checkings Account</label>
//             {/* A general error if the form validation fails */}
//             {errors.checkings && (
//               <span className="text-red-500 absolute right-5">
//                 {errors.checkings}
//               </span>
//             )}
//             <input
//               type="text"
//               value={checkings}
//               required
//               onChange={(e) => setCheckings(Number(e.target.value))}
//               name="checkingsAccount"
//               id="checkingsAccount"
//               className="border border-(--secondary-blue) rounded p-2  focus:outline-none focus:border-cyan-500"
//             />
//           </div>
//         </div>
//         <button
//           className="border p-3 rounded w-50 relative z-0  hover:border-teal-500 text-emerald-600"
//           aria-label="Save changes"
//         >
//           {/* {transactionAdded && (
//             <div className="border p-3 rounded w-50 absolute z-10 bg-emerald-900 top-0 left-0 ">
//               Success
//             </div>
//           )} */}
//           <span>Save</span>
//         </button>
//       </form>
//     </div>
//   );
// }
