"use client";
import {
  TableMain,
  TableSkeleton,
  TablePagination,
  useTable,
  TableFilters,
} from "@/components/dashboard/data-table";
import { RecruiterSectionsCards } from "@/components/recruiter/RecruiterSectionsCards";
import {
  Applyer,
  useJobApplicants,
} from "@/shared-api/hooks/job-applicants/useJobApplicants";
import { jobAppColumns } from "@/components/recruiter/jobAppColumns";
import { useSearchParams } from "next/navigation";

export default function RecruiterDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const jobApplicant = useJobApplicants(page, limit);
  const { table } = useTable<Applyer>({
    columns: jobAppColumns,
    data: jobApplicant.data?.applyers ?? [],
  });

  return (
    <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      <RecruiterSectionsCards query={jobApplicant} />
      {jobApplicant.isLoading && <TableSkeleton />}
      {jobApplicant.isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {jobApplicant.isSuccess && jobApplicant.data && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<Applyer> table={table} />
          </div>

          <TableMain<Applyer> table={table} />
          <TablePagination<Applyer>
            limit={limit}
            page={page}
            table={table}
            total={jobApplicant.data?.total}
          />
        </>
      )}
    </div>
  );
}
