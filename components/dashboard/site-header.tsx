"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { DynamicBreadcrumb } from "../ui/dynamic-breadcrumb";
import ToggleTheme from "../ThemeToggle";
import { useApplicant } from "@/shared-api/hooks/job-applicants/useApplicant";

export function SiteHeader() {
  const pathname = usePathname();
  const { applicantId } = useParams();
  const { data: applicant, isSuccess } = useApplicant(
    String(applicantId) ?? ""
  );
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
          excludeSegments={["recruiter", "admin", String(applicantId)]}
          appendSegments={isSuccess ? [applicant?.user.name] : []}
        />
        <div className="ml-auto flex items-center gap-2">
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
