import LoadingSpinner from "./LoadingSpinner";

export default function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex gap-5 items-center text-xs justify-center p-5">
      <p>{message}</p>
      <LoadingSpinner size="sm" />
    </div>
  );
}
