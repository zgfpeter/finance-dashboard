import { MdClose } from "react-icons/md";
import ImportUploader from "../ImportUploader";
import SeparatorLine from "../ui/SeparatorLine";

export default function ImportExportModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full relative gap-3 overflow-y-auto">
      <h2 className="text-xl font-semibold text-center">
        Import / Export (CSV Only)
      </h2>
      <button
        onClick={onClose}
        className="absolute right-8 top-1 text-red-500 text-2xl"
      >
        <MdClose />
      </button>

      <div className="flex flex-col h-full justify-around gap-3 md:gap-0">
        <ImportUploader entity="transactions" />
        <ImportUploader entity="upcomingCharges" />
        <ImportUploader entity="debts" />
        <ImportUploader entity="goals" />
      </div>
    </div>
  );
}
