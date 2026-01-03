import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import EmptyState from "@/app/components/ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import { ChartCardSkeleton } from "../ui/skeletons/ChartCardSkeleton";
interface Props {
  isLoading: boolean;
  hasData: boolean;
  children: React.ReactNode;
  height?: number;
}

export default function ChartContainer({
  isLoading,
  hasData,
  children,
  height = 220, // default height
}: Props) {
  if (isLoading) {
    return <ChartCardSkeleton height={300} />;
  }

  if (!hasData) {
    return <EmptyState message="No data available." />;
  }

  return <>{children}</>;
}
