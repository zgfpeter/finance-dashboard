"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdInfoOutline, MdAccountCircle, MdKey } from "react-icons/md";

import { FormData } from "@/lib/types/FormData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import customAxios from "@/lib/axios";
import { isAxiosError } from "axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: "",
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // to track loading status
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    //console.log([e.target.name], e.target.value);
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid.");
      handleSignup();
      // send to backend
    } else {
      console.log("Form has some errors: ", errors);
    }
  }

  async function handleSignup() {
    // start loading
    setIsLoading(true);
    const userData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
    };

    try {
      // const res = await axios.post(`${apiUrl}/users/signup`, userData);
      const res = await customAxios.post(`/users/signup`, userData);
      if (res.status === 201) {
        setRegistrationSuccess(true);
        setErrorMessage(null); // clear any previous errors
        setTimeout(() => {
          router.push("/userLogin");
        }, 1000);
      } else {
        setRegistrationSuccess(false);
        setIsLoading(false);
        setErrorMessage("An error has occurred. Please try again.");
      }
    } catch (error: unknown) {
      setRegistrationSuccess(false);
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "An error occurred.");
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.email) {
      newErrors.email = "Email cannot be empty.";
    }

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    // set the errors state so that i can use it to show error messages
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
    // if there are no errors in the for, this will return true
    // if there's at least one error, then it will return false
  }
  return (
    <section className=" h-screen flex items-center justify-center text-(--text-light)  ">
      <form
        className="z-20 flex flex-col items-center w-full max-w-2xl gap-3 py-10 border-none rounded-md justify-evenly inset-ring-4 inset-ring-cyan-600 bg-black/50"
        onSubmit={handleSubmit}
      >
        {registrationSuccess && (
          <p className="text-green-500">Success! You can now log in.</p>
        )}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="relative flex flex-col w-2/3 gap-3 p-3">
          <span className="absolute top-15.5 left-6.5 ">
            <span className="text-cyan-500">
              <MdEmail />
            </span>
          </span>
          <label htmlFor="email">Email</label>
          {errors.email && <span className="text-red-500">{errors.email}</span>}
          <input
            type="text"
            value={formData.email}
            onChange={handleChange}
            name="email"
            id="email"
            placeholder="example@gmail.com"
            className="p-2 pl-10 border rounded-md focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="relative flex flex-col w-2/3 gap-3 p-3">
          <span className="absolute top-15.5 left-6.5 ">
            <span className="text-cyan-500">
              <MdAccountCircle />
            </span>
          </span>
          <label htmlFor="username">Username</label>
          {errors.username && (
            <span className="text-red-500">{errors.username}</span>
          )}
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="p-2 pl-10 border rounded-md focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="relative flex flex-col w-2/3 gap-3 p-3">
          <span className="absolute top-15.5 left-6.5 ">
            <span className="text-cyan-500">
              <MdKey />
            </span>
          </span>
          <label htmlFor="password" className="flex items-center gap-2">
            Password{" "}
            <MdInfoOutline
              className="hover:cursor-pointer"
              onMouseEnter={() => setShowPasswordInfo(true)}
              onMouseLeave={() => setShowPasswordInfo(false)}
            />
          </label>
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
          {showPasswordInfo && (
            <span className="absolute z-20 flex items-center justify-center p-3 rounded-md bg-cyan-700 left-28 top-5 h-25 w-100">
              Password must be at least 6 characters long and contain at least
              one uppercase letter and one number.
            </span>
          )}

          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 pl-10 border rounded-md focus:outline-none focus:border-cyan-500 "
          />
        </div>

        <motion.button
          className="relative z-0 p-3 border rounded-md w-30 hover:cursor-pointer"
          aria-label="Sign up"
          whileHover={"hover"}
        >
          <motion.span
            className="absolute inset-0 z-0 rounded-md bg-cyan-800"
            style={{
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              transform: "translate(-50%, -50%)",
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            variants={{
              hover: {
                width: "100%",
                height: "100%",
              },
            }}
          />
          <span className="relative z-10 ">
            {isLoading ? <LoadingSpinner size="sm" /> : "Sign Up"}
          </span>
        </motion.button>
        <span>or</span>
        <Link href="/userLogin" aria-label="Create an account">
          <span>
            Already have an account?
            <span className="underline hover:cursor-pointer"> Log in</span>
          </span>
        </Link>
      </form>
    </section>
  );
}
