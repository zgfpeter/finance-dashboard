import LoadingSpinner from "./LoadingSpinner";

export default function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-5 p-5 text-xs">
      <p>{message}</p>
      <LoadingSpinner size="sm" />
    </div>
  );
}
