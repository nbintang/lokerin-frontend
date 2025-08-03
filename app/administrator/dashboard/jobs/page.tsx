"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { Jobs, useJobs } from "@/shared-api/hooks/jobs/useJobs";

import { useProfile } from "@/shared-api/hooks/profile/useProfile";
import { useSearchParams } from "next/navigation";
import { adminJobColumns } from "@/features/administrator/job-applications/columns";

export default function JobDashboard() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data: user, isLoading: isProfileLoading } = useProfile();
  const jobApplicant = useJobs(
    {
      isPublic: false,
      page,
      limit,
      postedBy: user?.id,
    },
    {
      enabled: !!user?.id,
      placeholderData: (prev) => prev,
    }
  );
  const { table } = useTable<Jobs>({
    columns: adminJobColumns,
    data: jobApplicant.data?.jobs ?? [],
  });
  if (isProfileLoading || jobApplicant.isLoading) {
    return <TableSkeleton />;
  }

  return (
    <>
      {jobApplicant.isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {jobApplicant.isSuccess && jobApplicant.data && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<Jobs> table={table} />
          </div>
          <TableMain<Jobs> table={table} />
          <TablePagination<Jobs>
            limit={limit}
            page={page}
            table={table}
            total={jobApplicant.data?.total}
          />
        </>
      )}
    </>
  );
}
