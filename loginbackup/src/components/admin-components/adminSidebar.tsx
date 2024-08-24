"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const [open, setOpen] = useState(true);

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Issues",
      href: "/admin/issues/3",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Ward",
      href: "/admin/ward",
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
        "flex flex-col md:flex-row bg-background dark:bg-background border border-neutral-200 dark:border-neutral-700",
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
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
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
