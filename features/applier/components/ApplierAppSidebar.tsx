"use client";

import * as React from "react";
import {
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { Sidebar } from "@/components/ui/sidebar";
import {
  FileCheck2,
  FileClock,
  FileSearch,
  FileSymlink,
  FileX2,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Find Jobs",
      url: "/applier/dashboard/jobs",
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
          url: "/applier/dashboard/applied-jobs/applied",
          icon: FileSymlink,
        },
        {
          title: "Reviewed Jobs",
          url: "/applier/dashboard/applied-jobs/reviewed",
          icon: FileClock,
        },
        {
          title: "Accepted Jobs",
          url: "/applier/dashboard/applied-jobs/accepted",
          icon: FileCheck2,
        },
        {
          title: "Rejected Jobs",
          url: "/applier/dashboard/applied-jobs/rejected",
          icon: FileX2,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/applier/account/settings",
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
  accountPath: '/applier/account',
};

export function ApplierAppSidebar({
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
