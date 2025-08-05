import React from "react";
import FooterLinks from "./footer-links";
import { AuroraText } from "@/components/magicui/aurora-text";
import FooterBottom from "./footer-bottom";
import { useTheme } from "next-themes";

const Footer = () => {
    const {resolvedTheme  } = useTheme()
  return (
    <footer className="w-full flex items-center justify-center bg-background backdrop-blur-sm">
      <div className="container flex flex-col  px-4 py-10 md:px-6 lg:py-16">
        <FooterLinks />

        <div className="relative -mb-2.5  lg:-mb-7 overflow-hidden">
          <AuroraText
            colors={resolvedTheme  === "dark" ?  ["#082f49", "#172554", "#0284c7" ] : ["#c7d2fe", "#bae6fd", "#bfdbfe" ]}
            className="absolute inset-0 w-full text-center text-[92px] md:text-[145px] lg:text-[250px] font-semibold text-foreground/5 pointer-events-none select-none leading-none"
          >
            Lokerin.
          </AuroraText>
        </div>
        <div className="relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
