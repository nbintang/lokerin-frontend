"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { appliedJobColumns } from "@/features/applier/applied-job/columns";
import { 
  AppliedJobsResponse,
  useAppliedJobs,
} from "@/shared-api/hooks/applied-job/useAppliedJobs";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import { AppliedJobResponse } from "@/shared-api/hooks/applied-job/useAppliedJob";

export default function StatusPages({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = use(params);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const {
    data: appliedJobs,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useAppliedJobs({page, limit, status});
  const { table } = useTable<AppliedJobResponse>({
    columns: appliedJobColumns,
    data: appliedJobs?.appliedJobs ?? [],
  });
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col  md:gap-4 gap-2 py-4 mx-3 md:mx-5  md:py-6">
        <TableSkeleton />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col  md:gap-4 gap-2 py-4 mx-3 md:mx-5  md:py-6">
      {isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {isSuccess && appliedJobs && (
        <>
          <div className="flex items-start gap-x-3 justify-between sm:justify-start rounded-b-md">
            <TableFilters<AppliedJobResponse> table={table} />
          </div>
          <TableMain<AppliedJobResponse> table={table} />
          <TablePagination<AppliedJobResponse>
            limit={limit}
            page={page}
            table={table}
            total={appliedJobs.total}
          />
        </>
      )}
    </div>
  );
}
