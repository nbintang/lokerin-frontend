import {
  TableFilters,
  TableMain,
  TablePagination,
  TableSkeleton,
  useTable,
} from "@/components/dashboard/data-table";
import { userColumns } from "@/features/administrator/user/columns";
import { User, useUsers } from "@/shared-api/hooks/users/useUsers";
import { useSearchParams } from "next/navigation";

export default function UsersPages() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data: users, ...usersQuery } = useUsers({
    page,
    limit,
  });
  const { table } = useTable<User>({
    columns: userColumns,
    data: users?.users ?? [],
  });
  return (
    <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      {usersQuery.isLoading && <TableSkeleton />}
      {usersQuery.isError && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-destructive">Error</span>
        </div>
      )}
      {usersQuery.isSuccess && users && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<User> table={table} />
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
