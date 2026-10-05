"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import BtnLink from "../BtnLink";
import Text from "../Text";

const links = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Componenti" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-[56px] min-h-[56px] w-full items-center gap-2 border-b border-solid border-border bg-card px-4">
      <Text size={3} weight="bolder" className="mr-auto text-primary">
        Hello World
      </Text>
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
