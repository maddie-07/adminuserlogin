"use client";
import React, { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AdminSidebarMobile() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",
        "md:hidden h-screen"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4">
          <Logo />
          <button
            onClick={() => setOpen(!open)}
            className="text-neutral-700 dark:text-neutral-200"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-2 px-4">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 p-4">
          <Link href="#" className="flex items-center">
            <div className="relative h-7 w-7">
              <Image
                src="https://assets.aceternity.com/manu.png"
                className="absolute inset-0 object-cover rounded-full"
                fill
                alt="Avatar"
              />
            </div>
            <span>Manu Arora</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-black dark:text-white whitespace-pre">
        Acet Labs
      </span>
    </Link>
  );
};
