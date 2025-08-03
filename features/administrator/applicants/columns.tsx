"use client";
import { Applier } from "../../../shared-api/hooks/job-applicants/useApplicants";

import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconFileCv,
  IconLoader,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useHandleSelectStatusDialog from "@/hooks/useHandleSelectStatusDialog";

export const jobAppColumns: ColumnDef<Applier>[] = [
  {
    accessorKey: "user",
    header: "Applier Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-5">
          <Avatar>
            <AvatarImage src={row.original.user.avatarUrl} />
            <AvatarFallback>{row.original.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {row.original.user.name}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "job.role.name",
    header: "Applied Job",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.job.role.name}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const setOpenDialogStatus = useHandleSelectStatusDialog(
        (state) => state.setOpen
      );

      return (
        <Badge
          variant="outline"
          className={cn(
            "text-muted-foreground px-1.5  cursor-pointer  hover:bg-muted hover:text-muted-foreground",
            row.original.status === "ACCEPTED" && "bg-green-500 text-white"
          )}
          onClick={() => {
            setOpenDialogStatus({
              isOpen: true,
              applicant: {
                jobId: row.original.job.id,
                status: row.original.status,
                id: row.original.id,
              },
            });
          }}
        >
          {row.original.status === "APPLIED" ||
          row.original.status === "ACCEPTED" ? (
            <IconCircleCheckFilled
              className={cn(
                row.original.status === "ACCEPTED"
                  ? "fill-white"
                  : "fill-green-500 "
              )}
            />
          ) : row.original.status === "REJECTED" ? (
            <CircleAlertIcon className="fill-red-500 dark:fill-red-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.status.toUpperCase().charAt(0) +
            row.original.status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },

  {
    accessorKey: "user.cvUrl",
    header: "CV",
    cell: ({ row }) => {
      return (
        <Link
          href={row.original.user.cvUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconFileCv />
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Applied At",
    cell: ({ row }) => {
      return format(row.original.createdAt, "dd MMM, yyyy");
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/administrator/dashboard/applicants/${row.original.id}`}>
                View {row.original.user.name.split(" ")[0]}'s profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
