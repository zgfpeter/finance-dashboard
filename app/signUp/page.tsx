"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import { FormData } from "@/lib/types/FormData";
import Link from "next/link";
export default function SignUp() {
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
    } else {
      console.log("Form has some errors: ", errors);
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
            className="absolute inset-0 bg-cyan-800 z-0 h-0 w-0 rounded -left-58"
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            variants={{
              hover: {
                width: "100%",
                height: "100%",
                left: 0,
              },
            }}
          ></motion.span>
          <span className="relative z-10">Sign Up</span>
        </motion.button>
        <span>or</span>
        <Link href="/UserLogin" aria-label="Create an account">
          <span>
            Already have an account?{" "}
            <span className="underline hover:cursor-pointer"> Log in</span>
          </span>
        </Link>
      </form>
    </section>
  );
}
