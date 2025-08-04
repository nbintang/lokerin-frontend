"use client";
import {
  flexRender,
  type Table as TableType
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData> {
  table: TableType<TData>;
  isLoading?: boolean; // Tambahkan prop isLoading
}

export function TableMain<TData>({
  table,
  isLoading = false,
}: DataTableProps<TData>) {
  return (
    <>
      <div className="w-full rounded-md overflow-hidden relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin size-5" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
        
        <ScrollArea className="w-full ">
          <div className="min-w-full overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-accent sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHead
                        key={header.id}
                        className={`px-3 py-3 text-left font-medium ${
                          index === 0 ? 'min-w-[200px]' :
                          index === 1 ? 'min-w-[150px]' :
                          index === 2 ? 'min-w-[100px]' :
                          index === 3 ? 'min-w-[120px]' :
                          'min-w-[80px]'
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className={isLoading ? 'opacity-50' : ''}>
                {table.getRowModel()?.rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 border-b"
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={cell.id}
                          className={`px-3 py-4 ${
                            index === 0 ? 'font-medium' : '' // Name column bold
                          }`}
                        >
                          <div className="truncate max-w-[200px]">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin size-4" />
                          <span>Loading data...</span>
                        </div>
                      ) : (
                        "No data found."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}