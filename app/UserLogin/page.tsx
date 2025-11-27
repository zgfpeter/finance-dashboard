"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import { SignInType } from "@/lib/types/FormData";
import Link from "next/link";
import { signIn } from "next-auth/react";
import LoadingSpinner from "../components/LoadingSpinner";
import { redirect } from "next/navigation";
export default function UserLogin() {
  const [formData, setFormData] = useState<SignInType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: "",
    password: "",
  });
  // states for the user sign in
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

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
    if (!validateForm()) {
      console.log("Sign in form has errors: ", errors);
      return;
    }

    // sends a POST request to api/auth/[...nextauth]/route.ts
    // then NextAuth receives the request and calls the authorize () function

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    console.log("NextAuth result ", result);
    // this doesn't print the user, evne though that's what the authorize() does
    // this gives something like {ok:true, status:200,error:null} if the user was authorized
    // to get the user:
    // const {data:session} = useSession();
    // then i can console.log(session?.user);
    // signIn does NOT give the user object, it only tells NextAuth: "Hey we successfully authenticated this user, make the session".
    // the session is stored globally by NextAuth, not returned by signIn.

    if (result?.error) {
      console.log("Error: ", result.error);
      setLoginError("Invalid email or password.");
      setLoginSuccess(""); // clear success
    } else {
      console.log("Success");
      setLoginSuccess("Login successful!");
      setLoginError(""); // clear error
      setLoginSuccess("");
      redirect("/");
      // setTimeout(() => {
      //   setLoginSuccess(""); // hide after 2 seconds
      //   console.log("Redirecting...");
      //   redirect("/");
      // }, 2000);
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
  const DEMO_EMAIL = "testUser@example.com";
  const DEMO_PASSWORD = "Abc123";

  async function handleDemoLogin() {
    setFormData({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    const result = await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
    });
    if (result?.error) {
      setLoginError("Demo login failed.");
    } else {
      redirect("/dashboard");
    }
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
              one uppercase letter and one number. email: testUser@example.com,
              password: Abc123
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
        {isLoading && <LoadingSpinner />}
        {loginSuccess && (
          <div className="pb-3 text-green-500">{loginSuccess}</div>
        )}
        {loginError && <div className="pb-3 text-red-500">{loginError}</div>}

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
          <span className="relative z-10">Log In</span>
        </motion.button>
        <button
          className="border p-3 rounded w-30  z-0  hover:cursor-pointer"
          aria-label="Demo login"
          onClick={handleDemoLogin}
        >
          DEMO
        </button>
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
