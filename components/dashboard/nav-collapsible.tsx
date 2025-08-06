"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@tabler/icons-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAppearApplySuccess } from "@/hooks/useAppearApplySuccess";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavCollapsible({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | Icon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon | Icon;
    }[];
  }[];
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const setAppearApplySuccess = useAppearApplySuccess(
    (state) => state.setAppearApplySuccess
  );
  const { state, setOpen } = useSidebar();
  const currentStatus = useAppearApplySuccess((state) => state.status);
  const appearApplySuccess = useAppearApplySuccess(
    (state) => state.appearApplySuccess
  );
  const pathname = usePathname();
  useEffect(() => {
    if (!appearApplySuccess || !currentStatus) return;
    setOpenMap((prev) => ({
      ...prev,
      [currentStatus]: true,
    }));
    const timer = setTimeout(() => {
      setAppearApplySuccess(false, "");
    }, 4000);
    return () => clearTimeout(timer);
  }, [appearApplySuccess, currentStatus, setAppearApplySuccess]);

  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarGroupLabel>Company</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const shouldBeOpen =
              appearApplySuccess &&
              item.items?.some((subItem) => {
                const statusKey = subItem.title.split(" ")[0].toUpperCase();
                return statusKey === currentStatus;
              });
            return (
              <Collapsible
                key={item.title}
                asChild
                open={openMap[item.title] ?? shouldBeOpen ?? item.isActive}
                onOpenChange={(isOpen) =>
                  setOpenMap((prev) => ({ ...prev, [item.title]: isOpen }))
                }
                className="group/collapsible"
              >
                <SidebarMenuItem
                  onClick={() => {
                    if (state === "collapsed") setOpen(true);
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const statusKey = subItem.title
                          .split(" ")[0]
                          .toUpperCase();
                        const isThisOne =
                          appearApplySuccess && statusKey === currentStatus;
                        return (
                          <Tooltip
                            key={subItem.title}
                            open={isThisOne}
                            onOpenChange={(open) => {
                              if (!open) setAppearApplySuccess(false, "");
                            }}
                          >
                            <TooltipTrigger asChild>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  isActive={subItem.url === pathname}
                                  asChild
                                >
                                  <Link href={subItem.url}>
                                    {subItem.icon && (
                                      <subItem.icon
                                        className={cn(
                                          pathname === subItem.url &&
                                            "text-primary md:text-primary-foreground"
                                        )}
                                      />
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {isThisOne
                                ? "Applied!"
                                : "Check your inbox for updates"}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  );
}
