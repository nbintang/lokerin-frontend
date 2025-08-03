"use client";

import * as React from "react";
import {
  IconHelp,
  IconUsers, IconSettings,
  IconUserCheck,
  IconUserStar,
  IconFileText,
  IconBriefcase2,
  IconBuildingSkyscraper
} from "@tabler/icons-react";

import { Sidebar } from "@/components/ui/sidebar";
import { Building2, LayoutDashboard } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/administrator/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/administrator/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Company Management",
      url: "/administrator/dashboard/companies",
      icon: Building2,
    },
  ],
  navCollapsible: [
    {
      title: "User Roles",
      url: "#",
      icon: IconUsers,
      items: [
        {
          title: "Manage Applicants",
          url: "/administrator/dashboard/applicants",
          icon: IconUserCheck,
        },
        {
          title: "Manage Recruiters",
          url: "/administrator/dashboard/recruiters",
          icon: IconUserStar,
        },
      ],
    },
    {
      title: "Job Management",
      url: "#",
      icon: IconBriefcase2,
      items: [
        {
          title: "Manage Job Listings",
          url: "/administrator/dashboard/jobs",
          icon: IconFileText,
        },
        {
          title: "Manage Job Positions",
          url: "/administrator/dashboard/job-positions",
          icon: IconBuildingSkyscraper,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/administrator/account/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/administrator/help",
      icon: IconHelp,
    },
  ],
  accountPath: "/administrator/account",
};

export function AdministratorAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar
      navMain={data.navMain}
      navSecondary={data.navSecondary}
      navCollapsible={data.navCollapsible}
      accountPath={data.accountPath}
      {...props}
    />
  );
}
