export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full py-10 text-xs">
      <p>{message}</p>
    </div>
  );
}
