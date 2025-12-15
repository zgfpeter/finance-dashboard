// a custom hook to fetch the dashboard data
// tanstack provides things like loading ( so i can use isLoading ), error and caching

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/api/getDashboardData"; // this is the custom fetch function i made with axios
import { DashboardData } from "@/lib/types/dashboard"; // the type for the dashboard data
import useAxiosAuth from "./useAxiosAuth";
// import session
import { useSession } from "next-auth/react";
// a custom hook to wrap the query
export function useDashboard() {
  // get th authenticated axios instance
  const axiosAuth = useAxiosAuth();
  const fetchDashboard = async () => {
    // just call .get(). The interceptor handles the token automatically
    const res = await axiosAuth.get<DashboardData>("/dashboard");
    return res.data;
  };

  const { data: session, status } = useSession();

  return useQuery<DashboardData>({
    // adds the token to the queryKey, so if the user switches, cache resets
    queryKey: ["dashboardData", session?.user?.accessToken],
    queryFn: fetchDashboard,
    // only run htis query if authenticated
    enabled: status === "authenticated" && !!session?.user?.accessToken,

    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,

    // getDashboardData must return a promise
    // defaultOptions: sensible defaults so tha ti don't have to pass options in every hook.
    // if i pass here options like staleTime, it will override the defaults
    // defaultOptions:{
    // queries:{
    // staleTime: how long before a cache result is considered "stale"
    // cacheTime: how long to keep inactive cache in memory before garbage-collect
    // retry: retry failed requests this many times
    // refetchOnWindowFocus: 'always' - automatic refetch on window focus
    //}
    //mutations:{
    //  retry:0
    //}
    //}

    // useQuery returns an object with useful fields like data, error, status, isLoading, isError,isFetching,refetch,isStale that i use in my testGetData ( where i actually have the useDashboard())
  });
}
