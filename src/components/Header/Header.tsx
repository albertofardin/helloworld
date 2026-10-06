"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BtnLink from "../BtnLink";
import logo from "@/assets/higeco-more-logo.png";

const links = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Componenti" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-[56px] min-h-[56px] w-full items-center gap-2 border-b border-solid border-border bg-card px-4">
      <Link href="/" className="mr-auto flex items-center">
        <Image src={logo} alt="Higeco More" height={22} priority />
      </Link>
      <nav className="flex items-center gap-1">
        {links.map(({ href, label }) => (
          <BtnLink
            key={href}
            href={href}
            label={label}
            selected={pathname === href}
          />
        ))}
      </nav>
    </header>
  );
};

export default Header;
