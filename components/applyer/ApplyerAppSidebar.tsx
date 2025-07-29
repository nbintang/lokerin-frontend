"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "../dashboard/app-sidebar";
import {
  FileCheck2,
  FileClock,
  FilePlus2,
  FileSearch,
  FileSymlink,
  FileX2,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Jobs",
      url: "/applyer/dashboard/jobs",
      icon: FileSearch,
    },
  ],
  navCollapsible: [
    {
      title: "Job Applications",
      url: "#",
      icon: IconListDetails,
      items: [
        {
          title: "Applied Jobs",
          url: "/applyer/dashboard/applications/applied",
          icon: FileSymlink,
        },
        {
          title: "Reviewed Jobs",
          url: "/applyer/dashboard/applications/reviewed",
          icon: FileClock,
        },
        {
          title: "Accepted Jobs",
          url: "/applyer/dashboard/applications/accepted",
          icon: FileCheck2,
        },
        {
          title: "Rejected Jobs",
          url: "/applyer/dashboard/applications/rejected",
          icon: FileX2,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function ApplyerAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <AppSidebar
      navMain={data.navMain}
      navSecondary={data.navSecondary}
      navCollapsible={data.navCollapsible}
      {...props}
    />
  );
}
