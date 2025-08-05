import React from "react";

import Link from "next/link";
import {
  IconBrandAirtable,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react"; // atau dari lucide-react
import { footerLinks } from "./links";

export default function FooterLinks() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
      {/* Brand Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
            <IconBrandAirtable />
          </div>
          <span className="text-base font-semibold  ">Lokerin.</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Lokerin is an AI-powered recruitment platform that connects talent
          with the right opportunities.
        </p>
        <div className="flex gap-4">
          {[IconBrandFacebook, IconBrandX, IconBrandLinkedin].map(
            (Icon, index) => (
              <Link
                key={index}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="size-5" />
                <span className="sr-only">Social</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Link Sections */}
      {footerLinks.map((section) => (
        <div key={section.title} className="space-y-4">
          <h4 className="text-sm font-bold">{section.title}</h4>
          <ul className="space-y-2 text-sm">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
