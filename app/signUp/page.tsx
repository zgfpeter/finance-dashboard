"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import { FormData } from "@/lib/types/FormData";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function SignUp() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("API URL:", apiUrl);

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
    const userData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
    };

    try {
      // const res = await axios.post(`${apiUrl}/api/users/signup`, userData);
      const res = await axios.post(`${apiUrl}/api/users/signup`, userData);
      if (res.status === 201) {
        setRegistrationSuccess(true);
        setErrorMessage(null); // clear any previous errors
        setTimeout(() => {
          router.push("/UserLogin");
        }, 1000);
      } else {
        setRegistrationSuccess(false);
        setErrorMessage("An error has occurred. Please try again.");
      }
    } catch (error: unknown) {
      setRegistrationSuccess(false);
      if (axios.isAxiosError(error)) {
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
    <section className=" h-screen flex items-center justify-center text-(--text-light)">
      <form
        className="flex flex-col items-center gap-3 justify-evenly py-10 rounded  w-full max-w-xl border-none inset-ring-4 inset-ring-cyan-600"
        onSubmit={handleSubmit}
      >
        {registrationSuccess && (
          <p className="text-green-500">Success! You can now log in.</p>
        )}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="flex flex-col w-2/3  p-3 gap-3">
          <label htmlFor="email">Email</label>
          {errors.email && <span className="text-red-500">{errors.email}</span>}
          <input
            type="text"
            value={formData.email}
            onChange={handleChange}
            name="email"
            id="email"
            placeholder="example@gmail.com"
            className="border rounded p-2  focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex flex-col w-2/3 p-3 gap-3">
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
            className="border rounded p-2  focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex flex-col w-2/3 p-3 gap-3 relative">
          <label htmlFor="password" className="flex items-center gap-2">
            Password{" "}
            <FaInfoCircle
              className="hover:cursor-pointer"
              onMouseEnter={() => setShowPasswordInfo(true)}
              onMouseLeave={() => setShowPasswordInfo(false)}
            />
          </label>
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
          {showPasswordInfo && (
            <span className="absolute bg-cyan-700 p-3 rounded left-28 top-5 z-20 h-25 w-100 flex items-center justify-center">
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
            className="border rounded p-2 focus:outline-none focus:border-cyan-500  "
          />
        </div>

        <motion.button
          className="border p-3 rounded w-30 relative z-0  hover:cursor-pointer"
          aria-label="Sign up"
          whileHover={"hover"}
        >
          <motion.span
            className="absolute inset-0 bg-cyan-800 z-0 rounded"
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
          <span className="relative z-10">Sign Up</span>
        </motion.button>
        <span>or</span>
        <Link href="/UserLogin" aria-label="Create an account">
          <span>
            Already have an account?
            <span className="underline hover:cursor-pointer"> Log in</span>
          </span>
        </Link>
      </form>
    </section>
  );
}
