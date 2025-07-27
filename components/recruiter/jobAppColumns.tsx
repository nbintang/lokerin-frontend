"use client";
import { Applyer } from "../../shared-api/hooks/job-applicants/useJobApplicants";

import {
  IconCircleCheckFilled,
  IconDotsVertical,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const jobAppColumns: ColumnDef<Applyer>[] = [
  {
    accessorKey: "user",
    header: "Applyer Name",
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
    accessorKey: "job",
    header: "Applied Job",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.job.title}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "text-muted-foreground px-1.5",
          row.original.status === "ACCEPTED" && "bg-green-400 text-white"
        )}
      >
        {row.original.status === "APPLIED" ||
        row.original.status === "ACCEPTED" ? (
          <IconCircleCheckFilled
            className={cn(
              row.original.status === "ACCEPTED"
                ? "fill-white"
                : "fill-green-500 ", 
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
    ),
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
    cell: ({row}) => (
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
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem >View {row.original.user.name.split(" ")[0]}</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem> 
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
