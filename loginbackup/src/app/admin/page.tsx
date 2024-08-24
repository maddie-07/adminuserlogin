"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AdminDash = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin") {
      router.push("/adminlogin");
    }
  }, [pathname, router]);

  return null;
};

export default AdminDash;
