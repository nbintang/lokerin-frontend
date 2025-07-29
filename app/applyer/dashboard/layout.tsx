import { cookies } from "next/headers";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SelectStatusDialog from "@/components/SelectStatusDialog";
import { ApplyerAppSidebar } from "@/components/applyer/ApplyerAppSidebar";
export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarState = (await cookies()).get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={sidebarState}
    >
      <ApplyerAppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
            <SelectStatusDialog />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
