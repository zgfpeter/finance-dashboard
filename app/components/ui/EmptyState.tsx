export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center text-xs justify-center h-full">
      <p>{message}</p>
    </div>
  );
}
