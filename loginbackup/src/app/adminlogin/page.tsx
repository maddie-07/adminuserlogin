"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaMapMarkerAlt, FaKey } from "react-icons/fa";

export default function AdminLogin() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    user_id: "",
    ward_id: "",
    role: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = await signIn("credentials", {
      user_id: authState.user_id,
      ward_id: authState.ward_id,
      role: authState.role,
      redirect: false,
    });

    if (data?.ok) {
      router.replace("/admin/dashboard/[admin_id]"); // Redirect to the admin dashboard or another admin page
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold mb-4 text-black">Admin Login</h1>
          <p className="mb-6 text-black">Welcome back, please login to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="user_id" className="text-black">User ID</label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <FaUser className="text-gray-500 ml-3" />
                <input
                  id="user_id"
                  type="text"
                  placeholder="Enter your User ID"
                  className="w-full p-3 border-gray-300 border-none outline-none text-black"
                  onChange={(e) => setAuthState({ ...authState, user_id: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="ward_id" className="text-black">Ward ID</label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <FaMapMarkerAlt className="text-gray-500 ml-3" />
                <input
                  id="ward_id"
                  type="text"
                  placeholder="Enter your Ward ID"
                  className="w-full p-3 border-gray-300 border-none outline-none text-black"
                  onChange={(e) => setAuthState({ ...authState, ward_id: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="role" className="text-black">Role</label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <FaKey className="text-gray-500 ml-3" />
                <input
                  id="role"
                  type="text"
                  placeholder="Enter your Role"
                  className="w-full p-3 border-gray-300 border-none outline-none text-black"
                  onChange={(e) => setAuthState({ ...authState, role: e.target.value })}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md shadow-md"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
