"use client";
import {
    TableFilters,
    TableMain,
    TablePagination,
    TableSkeleton,
    useTable,
} from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Jobs } from "@/shared-api/hooks/jobs/useJobs";

import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconBriefcase2 } from "@tabler/icons-react";
import { Roles, useRoles } from "@/shared-api/hooks/roles/useRoles";
import { positiionColumns } from "@/features/administrator/positions/columns";

export default function JobDashboard() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data: user, isLoading: isProfileLoading } = useProfile();
  const positions = useRoles()
  const { table } = useTable<Roles>({
    columns: positiionColumns,
    data: positions.data?.roles ?? [],
  });
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
            <TableFilters<Roles> table={table} />
            <Button asChild>
              <Link href="/recruiter/dashboard/jobs/new">
                <IconBriefcase2 />
                Add New Roles
              </Link>
            </Button>
          </div>
          <TableMain<Roles> table={table} />
          <TablePagination<Roles>
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
