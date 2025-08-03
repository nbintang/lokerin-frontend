"use client";

import * as React from "react";
import {
  IconDashboard, IconHelp, IconListDetails, IconSearch,
  IconSettings
} from "@tabler/icons-react";

import {
  Sidebar
} from "@/components/ui/sidebar";
import { AppSidebar } from "../../../components/dashboard/app-sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Applier",
      url: "/recruiter/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Manage Jobs",
      url: "/recruiter/dashboard/jobs",
      icon: IconListDetails,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/recruiter/account/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/recruiter/help",
      icon: IconHelp,
    }, 
  ],
  accountPath: "/recruiter/account",
};

export function RecruiterAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>  ) {
  return (
    <AppSidebar navMain={data.navMain} navSecondary={data.navSecondary} accountPath={data.accountPath}{...props} />
  )
}
