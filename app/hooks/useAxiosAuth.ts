"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import axiosAuth from "@/lib/axios";

// custom hook that automatically attaches the Authorization bearer <token> header to every request send using the custom axios instance.
// this way, i never have to write axios.get("path",{headers:{Authorization:`Bearer..`}})
//if the user is logged in,
const useAxiosAuth = () => {
  // get the current logged in session
  // is user is authenticated, we'll have session.user and session.user.accessToken

  const { data: session } = useSession();

  useEffect(() => {
    //An axios interceptor is a function that runs before every request, letting you modify it.
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        // if header doesn't exist,add it
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.user?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // by using this flag, it avoids multiple redirects if severel requests fail at once
    let isLoggingOut = false;
    // handle expired sessions.
    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !isLoggingOut) {
          isLoggingOut = true;
          signOut({ callbackUrl: "/userLogin" });
        }
        return Promise.reject(error);
      }
    );
    //cleanup: remove interceptop when the component unmounts
    // to prevent memory leaks or duplicate interceptors
    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session]); // runs whenever session changes
  return axiosAuth;
};

export default useAxiosAuth;
