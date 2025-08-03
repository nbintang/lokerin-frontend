"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { companyColumns } from "@/features/administrator/companies/columns";
import {
  Company,
  useCompanies,
} from "@/shared-api/hooks/companies/useCompanies";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CompanyPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data: companies, ...companiesQuery } = useCompanies({
    page,
    limit,
  });
  const { table } = useTable<Company>({
    columns: companyColumns,
    data: companies?.companies ?? [],
  });
  return (
    <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      {companiesQuery.isLoading && <TableSkeleton />}
      {companiesQuery.isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {companiesQuery.isSuccess && companies && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<Company> table={table} />
            <Button asChild>
              <Link href="/administrator/dashboard/companies/new">
                <Building2 />
                Add New Company
              </Link>
            </Button>
          </div>
          <TableMain<Company> table={table} />
          <TablePagination<Company>
            limit={limit}
            page={page}
            table={table}
            total={companies.total}
          />
        </>
      )}
    </div>
  );
}
