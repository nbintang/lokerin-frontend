"use client";
import {
  TableMain,
  TableSkeleton,
  TablePagination,
  useTable,
  TableFilters,
} from "@/components/dashboard/data-table";
import { RecruiterSectionsCards } from "@/features/recruiter/components/RecruiterSectionsCards";
import {
  Applier,
  useJobApplicants,
} from "@/shared-api/hooks/job-applicants/useJobApplicants";
import { jobAppColumns } from "@/features/recruiter/job-applications/columns";
import { useSearchParams } from "next/navigation";

export default function RecruiterDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const jobApplicant = useJobApplicants(page, limit);
  const { table } = useTable<Applier>({
    columns: jobAppColumns,
    data: jobApplicant.data?.appliers ?? [],
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
            <TableFilters<Applier> table={table} />
          </div>

          <TableMain<Applier> table={table} />
          <TablePagination<Applier>
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
