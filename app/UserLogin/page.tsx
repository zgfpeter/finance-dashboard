"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdInfoOutline, MdKey } from "react-icons/md";
import { SignInType } from "@/lib/types/FormData";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function UserLogin() {
  const [formData, setFormData] = useState<SignInType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: "",
    password: "",
  });
  // get the session
  const { data: session } = useSession();
  const router = useRouter();
  // if the user is already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // states for the user sign in
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    //console.log([e.target.name], e.target.value);
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // prevents automatic redirection
    });

    setIsLoading(false);

    if (result?.error) {
      setLoginError("Invalid email or password.");
    } else if (result?.ok) {
      setLoginSuccess(true);
      console.log("login success");
      // redirect manually after login
      router.push("/dashboard");
    }
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email cannot be empty.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    // set the errors state so that i can use it to show error messages
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
    // if there are no errors in the form, this will return true
    // if there's at least one error, then it will return false
  }

  // TEST FUNCTIONALITY
  const DEMO_EMAIL = "testuser@example.com";
  const DEMO_PASSWORD = "Abc12345";

  async function handleDemoLogin() {
    setFormData({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    setIsLoading(true);

    const result = await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setLoginError("Demo login failed.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <section className=" h-screen flex items-center justify-center text-(--text-light)">
      <form
        className="z-20 flex flex-col items-center w-full max-w-2xl gap-3 py-10 border-none rounded-md justify-evenly inset-ring-4 inset-ring-cyan-600 bg-black/50"
        onSubmit={handleSubmit}
      >
        {errors.email && <span className="text-red-500">{errors.email}</span>}
        {errors.password && (
          <span className="text-red-500">{errors.password}</span>
        )}

        <div className="relative flex flex-col w-2/3 gap-3 p-3">
          <span className="absolute top-15.5 left-6.5 ">
            <span className="text-cyan-500">
              <MdEmail />
            </span>
          </span>
          <label htmlFor="email">Email</label>

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
          {showPasswordInfo && (
            <span className="absolute z-20 flex items-center justify-center h-32 p-3 rounded-md bg-cyan-700 left-28 top-5 w-96">
              Password must be at least 6 characters long and contain at least
              one uppercase letter and one number.
            </span>
          )}
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

          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 pl-10 border rounded-md focus:outline-none focus:border-cyan-500 "
          />
        </div>
        {isLoading && <LoadingSpinner />}
        {loginSuccess && (
          <div className="pb-3 text-green-500">{loginSuccess}</div>
        )}
        {loginError && <div className="pb-3 text-red-500">{loginError}</div>}
        <div className="flex gap-3">
          <motion.button
            className="relative z-0 p-3 border rounded-md w-30 hover:cursor-pointer"
            aria-label="Log in"
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
            <span className="relative z-10">Log In</span>
          </motion.button>
          <button
            className="z-0 p-3 border rounded-md w-30 hover:cursor-pointer"
            aria-label="Demo login"
            onClick={handleDemoLogin}
          >
            DEMO
          </button>
        </div>
        <span>or</span>
        <Link
          href="/signUp"
          className="underline hover:cursor-pointer"
          aria-label="Create an account"
        >
          <span>Create an account</span>
        </Link>
      </form>
    </section>
  );
}
