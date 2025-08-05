"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "../ui/footer";
import Navbar from "../ui/navbar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const excludeRoutes = ["/auth", "/recruiter", "/applier", "/administrator"];
  const isExcludedRoute = excludeRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
