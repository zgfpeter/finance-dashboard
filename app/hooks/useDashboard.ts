// a custom hook to fetch the dashboard data
// tanstack provides things like loading ( so i can use isLoading ), error and caching

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/api/getDashboardData"; // this is the custom fetch function i made with axios
import { DashboardData } from "@/lib/types/dashboard"; // the type for the dashboard data

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: getDashboardData,
    //staleTime: 1000*30, // data is stale after 30 seconds
    //cacheTime:1000*60*5 // 5 minute cache
  });
}
