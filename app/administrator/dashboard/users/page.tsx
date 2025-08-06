"use client";
import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { Input } from "@/components/ui/input";
import { userColumns } from "@/features/administrator/user/columns";
import { User, useUsers } from "@/shared-api/hooks/users/useUsers";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function UsersPages() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);
  const {
    data: users,
    isLoading,
    isError,
    isSuccess,
    isFetching,
    error,
  } = useUsers({
    page,
    limit,
    name: debounceSearch,
  });
  useEffect(() => {
    if (debounceSearchState.isPending()) {
      setIsSearching(true);
    }
  }, [debounceSearchState]);

  const { table } = useTable<User>({
    columns: userColumns,
    data: users?.users ?? [],
  });
  if (isLoading || isSearching || isFetching) {
    return (
      <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
        <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
          <TableFilters<User> table={table} />
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search users..."
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
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-destructive">{error?.message}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      {isSuccess && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<User> table={table} />
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search users..."
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
          <TableMain<User> table={table} />
          <TablePagination<User>
            limit={limit}
            page={page}
            table={table}
            total={users.total}
          />
        </>
      )}
    </div>
  );
}
