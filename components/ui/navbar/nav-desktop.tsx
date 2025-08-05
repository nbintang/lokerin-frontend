import React from "react";
import { Button } from "../button";
import Link from "next/link";
import { IconBrandAirtable } from "@tabler/icons-react";
import ToggleTheme from "@/components/ThemeToggle";
import { ChevronRight } from "lucide-react";
import { navLinks } from "./links";

export const NavbarDesktop = () => {
  return (
    <>
      <Button variant="link" className="font-bold " asChild>
        <Link href="/">
          <div className="size-8 rounded-lg md:ml-3 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
            <IconBrandAirtable />
          </div>
          <span className="text-base font-semibold dark:text-white">Lokerin.</span>
        </Link>
      </Button>

      {/* Nav Links */}
      <nav className="hidden md:flex px-4 md:px-6 gap-3 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Action buttons */}
      <div className="hidden md:flex gap-4 items-center">
        <ToggleTheme />
        <Link
          href="/auth/signin"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Log in
        </Link>
        <Button className="rounded-full" asChild>
          <Link href="/auth/signup">
            Get Started
            <ChevronRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>
    </>
  );
};
