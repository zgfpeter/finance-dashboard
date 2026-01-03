import LoadingSpinner from "./LoadingSpinner";

export default function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center text-xs justify-center h-full">
      <p>
        {message} <LoadingSpinner />
      </p>
    </div>
  );
}
