interface Props {
  onClose?: () => void;
  message: string;
}
export default function EmptyState({ message, onClose }: Props) {
  return (
    <div className="flex items-center justify-center h-full py-10 text-xs">
      {/* only show close button if onClose was provided, need it for modals but not "cards" */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute z-10 text-xl text-red-500 right-5 top-4"
          aria-label="Close modal"
        >
          ✕
        </button>
      )}
      <p>{message}</p>
    </div>
  );
}
