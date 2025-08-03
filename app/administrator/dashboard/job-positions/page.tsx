"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import { useSearchParams } from "next/navigation";
import { IconBriefcase2 } from "@tabler/icons-react";
import { Role, useRoles } from "@/shared-api/hooks/roles/useRoles";
import { positionColumns } from "@/features/administrator/positions/columns";
import { usePositionDialogStore } from "@/features/administrator/positions/hooks/usePositionDialogStore";

export default function JobDashboard() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const open = usePositionDialogStore((state) => state.open);
  const { data: user, isLoading: isProfileLoading } = useProfile();
  const positions = useRoles();
  const { table } = useTable<Role>({
    columns: positionColumns,
    data: positions.data?.roles ?? [],
  });

  const handleOpenDialog = () => open();

  if (isProfileLoading || positions.isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      {positions.isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {positions.isSuccess && positions.data && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<Role> table={table} />
            <Button onClick={handleOpenDialog}>
              <IconBriefcase2 />
              Add New Roles
            </Button>
          </div>
          <TableMain<Role> table={table} />
          <TablePagination<Role>
            limit={limit}
            page={page}
            table={table}
            total={positions.data?.total}
          />
        </>
      )}
    </>
  );
}
