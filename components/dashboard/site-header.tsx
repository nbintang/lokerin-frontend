"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { DynamicBreadcrumb } from "../ui/dynamic-breadcrumb";
import ToggleTheme from "../ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="flex h-(--header-height) z-20 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb
          path={pathname}
          excludeSegments={["recruiter", "admin"]}
        />
        <div className="ml-auto flex items-center gap-2">
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
