"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import {
  IconHome,
  IconMoneybag,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function UserSidebar() {
  const [open, setOpen] = useState(true);

  const links = [
    {
      label: "Home",
      href: "/user/home",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Create",
      href: "/user/create",
      icon: (
        <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/user/profile",
      icon: (
        <IconUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My Ward",
      href: "/user/myward",
      icon: (
        <IconMoneybag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="flex flex-col justify-between gap-10 h-full w-64 md:w-80">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
                >
                  {link.icon}
                  {open && <span>{link.label}</span>}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md">
            <Link href="#" className="flex items-center">
              <div className="relative h-7 w-7">
                <Image
                  src="https://assets.aceternity.com/manu.png"
                  className="absolute inset-0 object-cover rounded-full"
                  fill
                  alt="Avatar"
                />
              </div>
              {open && <span>Manu Arora</span>}
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
      <img className="h-12" src="/logo.svg" alt="logo" />
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-fit w-fit bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
