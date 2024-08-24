"use client";
import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/adminSidebar";
import { AdminSidebarMobile } from "@/components/adminSidebarMobile";
import { UserSidebar } from "@/components/userSidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {isDesktop ? <UserSidebar /> : <UserSidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default UserLayout;
