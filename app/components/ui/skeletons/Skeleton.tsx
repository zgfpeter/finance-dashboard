// generic skeleton card, classes will be added by components that use it, ex Transactions
interface Props {
  className?: string;
}

export default function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-600/30 ${className} rounded-md`}
    />
  );
}
