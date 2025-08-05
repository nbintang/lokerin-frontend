import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../button";
import { ChevronRight, Menu, X } from "lucide-react";
import { navLinks } from "./links";
 

const authLinks = [
  { label: "Log in", href: "/auth/signin", isButton: false },
  { label: "Get Started", href: "/auth/signup", isButton: true },
];
export const NavMobile = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) =>
  mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
    >
      <div className="container px-4 md:px-6 flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="py-2 text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="flex flex-col gap-2 pt-2 pb-4 border-t">
          {authLinks.map((link) =>
            link.isButton ? (
              <Button key={link.label} className="rounded-full" asChild>
                <Link href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </motion.div>
  );

export const NavMobileToggle = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Button
    variant="ghost"
    size="icon"
  
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
    <span className="sr-only">Toggle menu</span>
  </Button>
);
