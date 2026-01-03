export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center text-xs justify-center h-full text-red-500">
      <p>{message}</p>
    </div>
  );
}
