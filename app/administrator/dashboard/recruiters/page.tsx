import { TableFilters, TableMain, TablePagination, TableSkeleton, useTable } from "@/components/dashboard/data-table";
import { recruiterColumns } from "@/features/administrator/recruiter/columns";
import { Recruiter, useRecruiters } from "@/shared-api/hooks/recruiters/useRecruiters";
import { useSearchParams } from "next/navigation";

export default function RecruiterPage() {
      const searchParams = useSearchParams();
      const page = Number(searchParams.get("page") ?? 1);
      const limit = Number(searchParams.get("limit") ?? 10);
      const { data: recruiters, ...recruitersQuery } = useRecruiters({
        page,
        limit,
      });
      const { table } = useTable<Recruiter>({
        columns: recruiterColumns,
        data: recruiters?.recruiters ?? [],
      });
    return (
  <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
       {recruitersQuery.isLoading && <TableSkeleton />}
       {recruitersQuery.isError && (
         <div className="flex items-center justify-center gap-2">
           <span className="text-destructive">Error</span>
         </div>
       )}
       {recruitersQuery.isSuccess && recruiters && (
         <>
           <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
             <TableFilters<Recruiter> table={table} />
           </div>
           <TableMain<Recruiter> table={table} />
           <TablePagination<Recruiter>
             limit={limit}
             page={page}
             table={table}
             total={recruiters.total}
           />
         </>
       )}
     </div>
    );
}