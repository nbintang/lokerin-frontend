"use client";

import * as React from "react";
import { Icon, IconInnerShadowTop } from "@tabler/icons-react";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { LucideIcon } from "lucide-react";
import { NavCollapsible } from "./nav-collapsible";

export function AppSidebar({
  navMain,
  navSecondary,
  navCollapsible,
  accountPath,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navMain: {
    title: string;
    url: string;
    icon: Icon | LucideIcon;
  }[];
  navCollapsible?: {
    title: string;
    url: string;
    icon?: Icon | LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  navSecondary: {
    title: string;
    url: string;
    icon: Icon;
  }[];
  accountPath: string;
}) {
  const { data: userProfile, isLoading, isSuccess } = useProfile();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Lokerin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {navCollapsible && <NavCollapsible items={navCollapsible} />}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isLoading && (
          <div
            className={cn("flex items-center gap-2  py-1.5 text-left text-sm")}
          >
            <Skeleton className="size-9 bg-muted-foreground rounded-lg grayscale" />
            <div className="flex flex-col h-6 gap-1 justify-between text-black">
              <Skeleton className="h-3 w-16 rounded-md bg-muted-foreground" />
              <Skeleton className="h-2.5 w-20 rounded-md bg-muted-foreground" />
            </div>
          </div>
        )}
        {isSuccess && <NavUser user={userProfile} accountPath={accountPath} />}
      </SidebarFooter>
    </Sidebar>
  );
}
