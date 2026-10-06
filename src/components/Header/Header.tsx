"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BtnLink from "../BtnLink";
import FieldSelect from "../FieldSelect";
import logo from "@/assets/higeco-more-logo.png";

const links = [
  { href: "/", label: "Esercizio" },
  { href: "/components", label: "Componenti" },
  { href: "/api-docs", label: "Api Doc" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const onChangeLink = React.useCallback(
    (value: string | number | (string | number)[]) => {
      // riselezionare la voce corrente la deseleziona: resto sulla pagina
      if (typeof value !== "string" || value === pathname) return;
      router.push(value);
    },
    [pathname, router]
  );

  return (
    <header className="flex h-[56px] min-h-[56px] w-full items-center gap-2 border-b border-solid border-border bg-card px-4">
      <Link href="/" className="mr-auto flex items-center">
        <Image src={logo} alt="Higeco More" height={22} priority />
      </Link>
      <FieldSelect
        className="w-[150px] sm:hidden"
        placeholder="Menu"
        value={pathname}
        items={links.map(({ href, label }) => ({ id: href, label }))}
        onChange={onChangeLink}
      />
      <nav className="hidden sm:flex border rounded overflow-hidden border-border">
        {links.map(({ href, label }) => (
          <BtnLink
            key={href}
            href={href}
            label={label}
            selected={pathname === href}
            className="border-0 rounded-none min-w-[110px] text-center"
          />
        ))}
      </nav>
    </header>
  );
};

export default Header;
