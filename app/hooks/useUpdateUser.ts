import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";

export interface UpdateUserDetailsInput {
  username?: string;
  currency?: string;
  avatar?: string;
}

interface UpdateUserDetailsResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    currency?: string;
    avatar?: string; // for now it can be a url string, later maybe let user upload images
  };
}

export function useUpdateUserDetails() {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation<UpdateUserDetailsResponse, Error, UpdateUserDetailsInput>({
    mutationFn: async (data) => {
      const res = await axiosAuth.patch<UpdateUserDetailsResponse>(
        "/users/update",
        data
      );
      return res.data;
    },

    onSuccess: () => {
      // refetch dashboard to reflect changes (currency can change)
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },

    onError: (error) => {
      console.error("Failed to update user details:", error);
    },
  });
}
