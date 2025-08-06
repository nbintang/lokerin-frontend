"use client";
import {
  TableMain,
  TableSkeleton,
  TablePagination,
  useTable,
  TableFilters,
} from "@/components/dashboard/data-table";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  Applier,
  useApplicants,
} from "@/shared-api/hooks/job-applicants/useApplicants";
import { jobAppColumns } from "@/features/recruiter/job-applications/columns";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { SectionCardSkeleton } from "@/components/skeletons/SectionCardSkeleton";
import useHandleSelectStatusDialog from "@/hooks/useHandleSelectStatusDialog";
import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/shallow";

export default function RecruiterDashboardPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);

  const { isOpen, setOpenHandleSelectStatus } = useHandleSelectStatusDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpenHandleSelectStatus: state.setOpen,
    }))
  );
  const {
    data: jobApplicant,
    isLoading,
    isError,
    error,
    isSuccess,
    isFetching,
  } = useApplicants({
    page,
    limit,
    name: debounceSearch,
  });

  const jobId = jobApplicant?.appliers[0]?.job.id;

  const { table } = useTable<Applier>({
    columns: jobAppColumns,
    data: jobApplicant?.appliers ?? [],
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  useEffect(() => {
    if (!isOpen) {
      table.resetRowSelection();
    }
  }, [isOpen, table]);

  const handleOpenDialog = () =>
    setOpenHandleSelectStatus({
      applicant: { ids: selectedRows, jobId: jobId ?? "" },
      isOpen: true,
    });

  useEffect(() => {
    if (debounceSearchState.isPending()) {
      setIsSearching(true);
    }
  }, [debounceSearchState]);

  if (isLoading || isSearching || isFetching) {
    return (
      <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
        <SectionCardSkeleton />
        <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
          <TableFilters<Applier> table={table} />
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search applicants..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full"
            />
            {isFetching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (isError || error) {
    <div className="flex items-center justify-center gap-2">
      <span className="text-destructive">{error?.message}</span>
    </div>;
  }

  return (
    <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      {isSuccess && (
        <>
          <SectionCard total={jobApplicant?.total} />
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<Applier> table={table} />
            <div className="relative flex-1">
              <Input
                placeholder="Search applicants..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full max-w-md"
              />
            </div>
            <Button onClick={handleOpenDialog}>Update Status</Button>
          </div>

          <TableMain<Applier> table={table} />
          <TablePagination<Applier>
            limit={limit}
            page={page}
            table={table}
            total={jobApplicant?.total}
          />
        </>
      )}
    </div>
  );
}
