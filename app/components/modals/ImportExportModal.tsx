// components/modals/ImportExportModal.tsx
import { MdClose } from "react-icons/md";
import ImportUploader from "../ImportUploader";
import ExportModal from "./ExportModal";
import { Entity } from "@/lib/types/dashboard";
export default function ImportExportModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="relative flex flex-col h-full gap-6 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-center">
        Import / Export Data
      </h2>
      <button
        onClick={onClose}
        className="absolute text-2xl text-red-500 right-4 top-2 hover:text-red-700"
      >
        <MdClose />
      </button>

      <div className="flex flex-col gap-2">
        <Section entity="transactions" title="Transactions" />
        <Section entity="upcomingCharges" title="Upcoming Charges" />
        <Section entity="debts" title="Debts" />
        <Section entity="goals" title="Goals" />
      </div>
    </div>
  );
}

// Helper component to keep the modal clean
function Section({ entity, title }: { entity: Entity; title: string }) {
  return (
    <div className="flex flex-col border border-(--secondary-blue) rounded-md ">
      <div className="flex items-center self-end justify-between pt-3 pr-3 mb-2">
        <ExportModal entity={entity} />
      </div>
      <ImportUploader entity={entity} />
    </div>
  );
}
