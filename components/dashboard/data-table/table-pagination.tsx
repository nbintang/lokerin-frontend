import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { Table } from "@tanstack/react-table";

export const TablePagination = <TData,>({
  page,
  limit,
  table,
  total,
}: {
  page: number;
  limit: number;
  table: Table<TData>;
  total: number;
}) => {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const visibleRowCountOnPage = table.getPaginationRowModel().rows.length;
  return (
    <div className="flex justify-center md:justify-between w-full flex-wrap-reverse items-center gap-4 mt-3 px-3">
      <div className="text-sm text-muted-foreground">
        {selectedRowCount} of {visibleRowCountOnPage} Row(s) selected
      </div>
      <PaginationWithLinks page={page} pageSize={limit} totalCount={total} />
    </div>
  );
};
