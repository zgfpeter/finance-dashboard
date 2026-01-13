export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full text-xs text-red-500">
      <p>{message}</p>
    </div>
  );
}
