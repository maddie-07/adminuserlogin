"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const UserDash = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/user") {
      router.push("/user/home");
    }
  }, [pathname, router]);

  return null;
};

export default UserDash;