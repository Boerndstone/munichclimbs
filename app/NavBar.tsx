"use client";

import { link } from "fs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBug } from "react-icons/fa";
import classnames from "classnames";

const NavBar = () => {
  const currentPath = usePathname();
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Issues", href: "/issues/list" },
  ];
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <FaBug className="text-black" />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            // className={`${
            //   link.href === currentPath ? "text-zinc-900" : "text-zinc-500"
            // } hover:text-zinc-800 transition-colors`}
            className={classnames({
              "text-zinc-900": link.href === currentPath,
              "text-zinc-500": link.href !== currentPath,
              "hover:text-zinc-800": true,
              "transition-colors": true,
            })}
            href={link.href}
          >
            {link.name}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
