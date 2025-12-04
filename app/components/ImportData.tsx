export default async function HandleImport() {
  //     const [file, setFile] = useState<File | null>(null);
  //   const [fileName, setFileName] = useState<string | null>(null);
  //   const file: File | null = null;
  //   if (!file) return;
  //   try {
  //     const result = await uploadFile(file);
  //     console.log(result); // result for now is just the file the user oploaded
  //     // setFileName(result);
  //     setFileName("AVeryLongAssNameForAAfile");
  //   } catch (error) {
  //     console.log(error);
  //   }
  return <div>Uploading data.</div>;
}

//   <div className="">
//               <div className="flex items-center justify-between">
//                 <label className="relative flex items-center hover:bg-(--hover-blue) hover:text-white group cursor-pointer ">
//                   <input
//                     type="file"
//                     accept=".csv"
//                     hidden
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                   />

//                   {/* <div className="flex items-center gap-1 border px-2 py-1 rounded-xl border-(--error-blue)">
//                   <FaFileImport />
//                   IMPORT FROM FILE
//                 </div> */}
//                   <div className="flex items-center gap-2 relative ">
//                     <FaFileImport size={18} />
//                     {!fileName ? (
//                       <span>SELECT FILE</span>
//                     ) : (
//                       <span className="w-30 overflow-hidden text-ellipsis whitespace-nowrap text-teal-500">
//                         {fileName}
//                       </span>
//                     )}
//                     <span className="text-(--text-light) absolute top-8 left-1 text-xs">
//                       [Max: 1MB]
//                     </span>
//                   </div>
//                 </label>

//                 {/* I need to 1: select the file, then upload the file, so 2 buttons, if i only had one button, the selected file would be uploaded immediately */}

//                 <button
//                   className="flex hover:bg-(--hover-blue) hover:text-white  "
//                   onClick={handleImport}
//                 >
//                   <div className="border rounded-xl border-(--error-blue) hover:rounded-none transition-all duration-300 h-fit px-2 py-1 text-sm">
//                     UPLOAD
//                   </div>
//                 </button>
//               </div>
