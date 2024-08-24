"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";
import { LockIcon, LockOpenIcon } from "lucide-react";  // Importing the icon

type loginErrorType = {
  email?: string;
  password?: string;
};

export default function Login() {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<loginErrorType>();

  const submitForm = () => {
    console.log("The auth state is ", authState);
    setLoading(true);
    axios
      .post("/api/auth/login", authState)
      .then((res) => {
        setLoading(false);
        const response = res.data;
        console.log("The response is: ", response);
        if (response.status === 200) {
          signIn("credentials", {
            email: authState.email,
            password: authState.password,
            callbackUrl: "/",
            redirect: true,
          });
        } else if (response?.status === 400) {
          setErrors(response?.errors);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Something went wrong");
      });
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="bg-white shadow-lg rounded-lg p-8 xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-4 flex justify-center">
            <LockIcon className="h-12 w-12 text-black" /> {/* Added icon here */}
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Create a free account
            </Link>
          </p>
          <form action="#" method="POST" className="mt-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setAuthState({ ...authState, email: e.target.value })}
                  />
                  <span className="text-red-500 font-bold">{errors?.email}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-base font-medium text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setAuthState({ ...authState, password: e.target.value })}
                  />
                  <span className="text-red-500 font-bold">{errors?.password}</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={submitForm}
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-900"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
